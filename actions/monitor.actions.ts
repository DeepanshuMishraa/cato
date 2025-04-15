"use server";

import { db } from "@/db";
import { user, website, websiteLog } from "@/db/schema";
import { auth } from "@/lib/auth";
import { SiteTypes, urlType } from "@/lib/types"
import { and, eq, like } from "drizzle-orm";
import { headers } from "next/headers";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { sendEmailAlert } from "@/lib/mail";

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

      const websiteEntry = await db.select().from(website).where(eq(website.url, url));
      if (websiteEntry[0]) {
        const isSiteDown = !isUp;
        const lastAlert = websiteEntry[0].lastEmailAlert;
        const threeHoursInMs = 3 * 60 * 60 * 1000;
        const shouldSendEmail = isSiteDown && (!lastAlert || Date.now() - lastAlert.getTime() > threeHoursInMs);

        if (shouldSendEmail) {
          const userResult = await db.select().from(user).where(eq(user.id, session.user.id));
          if (userResult[0]?.email) {
            await sendEmailAlert(userResult[0].email, websiteEntry[0].name, websiteEntry[0].url);
            await db.update(website)
              .set({
                lastEmailAlert: new Date(),
              })
              .where(eq(website.url, url));
          }
        }

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

      return {
        success: true,
        message: `Site returned status ${status}`,
        responseTime,
        status,
      };
    } catch (requestError) {
      console.error('Request error:', requestError);

      if (axios.isAxiosError(requestError) && requestError.response) {
        status = requestError.response.status;
      } else {
        status = 0;
      }

      responseTime = Date.now() - start;
      isUp = false;
      const websiteEntry = await db.select().from(website).where(eq(website.url, url));
      if (websiteEntry[0]) {
        const lastAlert = websiteEntry[0].lastEmailAlert;
        const threeHoursInMs = 3 * 60 * 60 * 1000;
        const shouldSendEmail = !lastAlert || Date.now() - lastAlert.getTime() > threeHoursInMs;

        if (shouldSendEmail) {
          const userResult = await db.select().from(user).where(eq(user.id, session.user.id));
          if (userResult[0]?.email) {
            await sendEmailAlert(userResult[0].email, websiteEntry[0].name, websiteEntry[0].url);
            await db.update(website)
              .set({
                lastEmailAlert: new Date(),
              })
              .where(eq(website.url, url));
          }
        }

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

      return {
        success: false,
        message: "Failed to connect to the site",
        responseTime,
        status,
      };
    }
  } catch (outerError) {
    console.error("Error in pingSites function:", outerError);
    return {
      success: false,
      message: outerError instanceof Error ? outerError.message : "Failed to ping site",
      responseTime: 0,
      status: 0,
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

export const deleteSite = async (siteId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user) {
      throw new Error("User not authenticated")
    }

    //check if site belongs to the user

    const SiteBelongsToUser = await db.select().from(website).where(
      and(
        eq(website.id, siteId),
        eq(website.userId, session?.user.id)
      )
    )

    if (!SiteBelongsToUser[0]) {
      return {
        success: false,
        message: "Site does not belong to user",
      }
    }

    await db.delete(website).where(eq(website.id, siteId));

    return {
      success: true,
      message: "Site deleted successfully",
    }
  } catch (err) {
    console.error("Error deleting site:", err)
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to delete site",
    }
  }
}
