import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET_DEV!,
  onPayload: async (payload) => {
    // Handle the payload
    // No need to return an acknowledge response
  },
});
