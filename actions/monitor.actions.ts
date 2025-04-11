"use server";

import { db } from "@/db";
import { website, websiteLog } from "@/db/schema";
import { auth } from "@/lib/auth";
import { SiteTypes, urlType } from "@/lib/types"
import { eq } from "drizzle-orm";
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
  const pingOnce = async () => {
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

      const ping = await axios.get(url, { timeout: 5000 }); 

      const responseTime = Date.now() - start;
      const isUp = ping.status >= 200 && ping.status < 400;

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
        message: "Site is up",
        responseTime,
        status: ping.status,
      };
    } catch (err: any) {
      console.error("Error pinging site:", err);

      const parsedUrl = urlType.safeParse({ url: siteUrl });
      const { url } = parsedUrl.success ? parsedUrl.data : { url: siteUrl };

      const websiteEntry = await db.select().from(website).where(eq(website.url, url));

      if (websiteEntry[0]) {
        await db.insert(websiteLog).values({
          id: uuidv4(),
          websiteId: websiteEntry[0].id,
          checkedAt: new Date(),
          responseTime: 0,
          statusCode: 0,
          isUp: false,
        });

        await db
          .update(website)
          .set({
            status: 0,
            responseTime: 0,
            updatedAt: new Date(),
          })
          .where(eq(website.url, url));
      }

      return {
        success: false,
        message: err instanceof Error ? err.message : "Failed to ping site",
        responseTime: 0,
        status: 0,
      };
    }
  };
  return {
    success: true,
    message: "Ping monitoring started",
  };
}

