import { Checkout } from '@polar-sh/nextjs'

export const GET = Checkout({
  accessToken: process.env.NODE_ENV === "production" ? process.env.POLAR_ACCESS_TOKEN! : process.env.POLAR_ACCESS_TOKEN_DEV!,
  server: process.env.NODE_ENV === 'production' ? "production" : "sandbox",
  successUrl: `${process.env.NEXT_PUBLIC_URL}/success`,
});
