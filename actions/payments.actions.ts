"use server"

import { db } from "@/db"
import { user } from "@/db/schema"
import { auth } from "@/lib/auth"
import { and, eq } from "drizzle-orm"
import { headers } from "next/headers"

export const SubscribedUser = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user) {
      throw new Error("User not authenticated")
    }

    const subscribedUser = await db.select().from(user).where(and(
      eq(user.id, session.user.id),
      eq(user.subscribed, true)
    ));

    if (!subscribedUser || subscribedUser.length === 0) {
      return {
        subscribed: false,
      }
    }

    return {
      subscribed: true,
    }
  } catch (err) {
    console.error(err);
    return {
      subscribed: false,
    }
  }
}
