"use server";

import { db } from "@/db";
import { website, websiteLog } from "@/db/schema";
import { auth } from "@/lib/auth";
import { SiteTypes, urlType } from "@/lib/types"
import { and, eq, like } from "drizzle-orm";
import { headers } from "next/headers";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

type AddSiteResponse = {
  success: boolean;
  message: string;
};

type GetSitesResponse = {
  success: boolean;
  message?: string;
  sites?: any[];
};

export const addSite = async (site: unknown): Promise<AddSiteResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to add a site",
      };
    }

    const parsedData = SiteTypes.safeParse(site);
    if (!parsedData.success) {
      return {
        success: false,
        message: "Invalid site data provided",
      };
    }

    const { name, url } = parsedData.data;
    const now = new Date();

    await db.insert(website).values({
      id: crypto.randomUUID(),
      name: name.trim(),
      url: url.trim(),
      responseTime: 0,
      status: 0,
      userId: session.user.id,
      createdAt: now,
      updatedAt: now,
    });

    return {
      success: true,
      message: "Site added successfully",
    };
  } catch (err) {
    console.error("Error adding site:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to add site",
    };
  }
}

export const getSites = async (userId: string): Promise<GetSitesResponse> => {
  if (!userId) {
    return {
      success: false,
      message: "User ID is required",
    };
  }

  try {
    const sites = await db.select().from(website).where(eq(website.userId, userId));
    return {
      success: true,
      sites: sites || [],
    };
  } catch (err) {
    console.error("Error getting sites:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to get sites",
      sites: [],
    };
  }
}

export const pingSites = async (siteUrl: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }
    const parsedUrl = urlType.safeParse({ url: siteUrl });
    if (!parsedUrl.success) {
      throw new Error("Invalid URL");
    }
    const { url } = parsedUrl.data;
    const start = Date.now();
    const ping = await axios.get(url, {
      timeout: 5000,
      validateStatus: function (status) {
        return true; 
      }
    });

    const responseTime = Date.now() - start;
    const isUp = ping.status >= 200 && ping.status < 600; // Consider any response as "up"

    await db
      .update(website)
      .set({
        status: ping.status,
        responseTime,
        updatedAt: new Date(),
      })
      .where(eq(website.url, url));

    const websiteEntry = await db.select().from(website).where(eq(website.url, url));
    if (websiteEntry[0]) {
      await db.insert(websiteLog).values({
        id: uuidv4(),
        websiteId: websiteEntry[0].id,
        checkedAt: new Date(),
        responseTime,
        statusCode: ping.status,
        isUp,
      });
    }

    return {
      success: true,
      message: "Site responded",
      responseTime,
      status: ping.status,
    };
  } catch (err: any) {
    console.error("Error pinging site:", err);
    const parsedUrl = urlType.safeParse({ url: siteUrl });
    const { url } = parsedUrl.success ? parsedUrl.data : { url: siteUrl };

    const statusCode = err.response?.status || 0;
    const responseTime = err.response ? (err.response.responseTime || 0) : 0;

    const websiteEntry = await db.select().from(website).where(eq(website.url, url));
    if (websiteEntry[0]) {
      await db.insert(websiteLog).values({
        id: uuidv4(),
        websiteId: websiteEntry[0].id,
        checkedAt: new Date(),
        responseTime,
        statusCode,
        isUp: statusCode >= 200 && statusCode < 600,
      });

      await db
        .update(website)
        .set({
          status: statusCode,
          responseTime,
          updatedAt: new Date(),
        })
        .where(eq(website.url, url));
    }

    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to ping site",
      responseTime,
      status: statusCode,
    };
  }
};


export const searchSites = async (userId: string, name: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user.id) {
      throw new Error("User not authenticated")
    }

    const sites = await db.select().from(website).where(
      and(
        eq(website.userId, userId),
        like(website.url, `%${name}%`)
      )
    )

    if (sites.length === 0) {
      return {
        success: false,
        message: "No sites found",
      }
    } else {
      return {
        success: true,
        sites: sites,
      }
    }
  } catch (err) {
    console.error("Error searching sites:", err)
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to search sites",
    }
  }
}
