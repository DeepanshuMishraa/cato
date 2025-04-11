import { z } from "zod";


export const SiteTypes = z.object({
  name: z.string().nonempty().min(3).max(20),
  url: z.string().url().nonempty(),
})

export const urlType = z.object({
  url: z.string().url().nonempty()
})


export type SiteType = z.infer<typeof SiteTypes>;
