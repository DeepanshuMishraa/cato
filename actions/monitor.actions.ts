"use server";

import { db } from "@/db";
import { website } from "@/db/schema";
import { auth } from "@/lib/auth";
import { SiteTypes } from "@/lib/types"
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

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
