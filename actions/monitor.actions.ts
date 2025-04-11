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

    // Debug logging
    console.log(`Pinging site: ${url}`);

    let status = 0;
    let responseTime = 0;
    let isUp = false;

    try {
      // Configure axios to never throw on status codes
      const ping = await axios.get(url, {
        timeout: 5000,
        validateStatus: () => true  // Accept any status code
      });

      // Debug logging
      console.log(`Received response from ${url}:`, {
        status: ping.status,
        data: typeof ping.data,
        headers: ping.headers
      });

      responseTime = Date.now() - start;
      status = ping.status;
      isUp = status >= 200 && status < 600;
    } catch (requestError) {
      // This catch block will only run for network errors, not status code errors
      console.error(`Network error pinging ${url}:`, requestError);

      // Try to extract status from error response if available
      if (requestError.response && requestError.response.status) {
        status = requestError.response.status;
        isUp = status >= 200 && status < 600;
      } else {
        status = 0; // Genuine connection error
        isUp = false;
      }

      responseTime = Date.now() - start;
    }

    // Debug logging
    console.log(`Final status for ${url}:`, {
      status,
      responseTime,
      isUp
    });

    // Update database regardless of status
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

    // Return response with actual status
    return {
      success: true, // We're always returning success:true because we got a response
      message: isUp ? "Site is up" : "Site is down",
      responseTime,
      status,
    };

  } catch (outerError) {
    // This catch block is for errors in our function's logic, not the HTTP request
    console.error("Error in pingSites function:", outerError);

    const parsedUrl = urlType.safeParse({ url: siteUrl });
    const { url } = parsedUrl.success ? parsedUrl.data : { url: siteUrl };

    // Default values in case of error
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
