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

export const getSites = async (): Promise<GetSitesResponse> => {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    throw new Error("User not authenticated")
  }

  const userId = session.user.id as string;
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
    });

    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const parsedUrl = urlType.safeParse({ url: siteUrl });
    if (!parsedUrl.success) {
      throw new Error("Invalid URL");
    }

    const { url } = parsedUrl.data;
    const start = Date.now();

    console.log(`Pinging site: ${url}`);

    let status = 0;
    let responseTime = 0;
    let isUp = false;

    try {
      const ping = await axios.get(url, {
        timeout: 5000,
        validateStatus: null,
      });


      responseTime = Date.now() - start;
      status = ping.status;
      isUp = status >= 200 && status < 400;

      await db
        .update(website)
        .set({
          status,
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
          statusCode: status,
          isUp,
        });
      }

      return {
        success: true,
        message: `Site returned status ${status}`,
        responseTime,
        status,
      };
    } catch (requestError) {
      console.error('Request error:', requestError);

      if (requestError.response) {
        console.log('Error response:', {
          status: requestError.response.status,
          headers: requestError.response.headers,
          data: requestError.response.data
        });

        status = requestError.response.status;
      } else if (requestError.request) {
        console.log('No response received:', requestError.request);
        status = 0;
      } else {
        console.log('Error setting up request:', requestError.message);
        status = 0;
      }

      responseTime = Date.now() - start;
      isUp = status >= 200 && status < 400;

      return {
        success: false,
        message: "Failed to connect to the site",
        responseTime,
        status,
      };
    }

  } catch (outerError) {
    console.error("Error in pingSites function:", outerError);

    const parsedUrl = urlType.safeParse({ url: siteUrl });
    const { url } = parsedUrl.success ? parsedUrl.data : { url: siteUrl };


    const status = 0;
    const responseTime = 0;
    const isUp = false;

    try {
      const websiteEntry = await db.select().from(website).where(eq(website.url, url));
      if (websiteEntry[0]) {
        await db.insert(websiteLog).values({
          id: uuidv4(),
          websiteId: websiteEntry[0].id,
          checkedAt: new Date(),
          responseTime,
          statusCode: status,
          isUp,
        });

        await db
          .update(website)
          .set({
            status,
            responseTime,
            updatedAt: new Date(),
          })
          .where(eq(website.url, url));
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
    }

    return {
      success: false,
      message: outerError instanceof Error ? outerError.message : "Failed to ping site",
      responseTime,
      status,
    };
  }
};


export const searchSites = async (name: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user.id) {
      throw new Error("User not authenticated")
    }

    const userId = session.user.id as string;

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
