import { db } from "@/db";
import { user } from "@/db/schema";
import { Webhooks } from "@polar-sh/nextjs";
import { eq } from "drizzle-orm";

export const POST = Webhooks({
  webhookSecret: process.env.NODE_ENV === "production" ? process.env.POLAR_WEBHOOK_SECRET! : process.env.POLAR_WEBHOOK_SECRET_DEV!,
  onOrderCreated: async (payload) => {
    const customerId = payload.data.customerId;
    const customerEmail = payload.data.customer.email;

    if (!customerEmail) {
      throw new Error('No customer email provided in webhook payload');
    }

    const userByEmail = await db.select().from(user).where(
      eq(user.email, customerEmail)
    ).limit(1).then(users => users[0]);

    if (!userByEmail) {
      throw new Error('No user found with the provided email');
    }

    await db.update(user).set({
      subscribed: true,
      polarCustomerId: customerId,
      polarOrderId: payload.data.id,
      plan: payload.data.product.name
    }).where(eq(user.id, userByEmail.id));
  }
});
