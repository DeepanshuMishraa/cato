"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SiteType, SiteTypes } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addSite } from "@/actions/monitor.actions";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowUp10Icon, Loader2 } from "lucide-react";
import Link from "next/link";
import type { UrlObject } from 'url';
import { useRouter } from "next/navigation";



type Url = string | UrlObject;


export default function JoinWaitlistButton({
  children,
  onClick,
  href
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href: Url;
}) {
  return (
    <Link href={href}>
      <Button
        size={"sm"}
        variant={null}
        onClick={onClick}
        className="cursor-pointer shadow-xs border border-gray-200 text-xs font-normal"
      >
        {children}
      </Button>
    </Link>

  )
}

export function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} id="#waitlist" size={"sm"} variant={null} className="cursor-pointer shadow-xs border border-gray-200 text-xs font-normal">
      Logout
    </Button>
  )
}


export function AddSiteButton() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<SiteType>({
    resolver: zodResolver(SiteTypes),
    defaultValues: {
      name: "",
      url: ""
    },
  })



  async function onSubmit(values: SiteType) {
    try {
      const res = await addSite(values);
      if (res.success == false) {
        toast.error(res.message)
      } else {
        toast.success(res.message)
        form.reset();
      }
    } catch (err) {
      toast.error("An error occurred while adding the site")
      console.error(err);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-center">
        <DialogTrigger asChild>
          <Button className="rounded-xs">Create Monitor</Button>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a site</DialogTitle>
          <DialogDescription>
            Add a site to monitor. You can add multiple sites and manage them
            from your dashboard.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Url</FormLabel>
                    <FormControl>
                      <Input placeholder="site url" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add site</Button>
            </form>
          </Form>
        </DialogContent>
        <DialogFooter>
          <Button type="submit" className="w-full">
            {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Add site"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function UpgradeToPlus() {
  const router = useRouter();
  const productId = process.env.NEXT_PUBLIC_PLUS_PRODUCT_ID;
  if (!productId) {
    console.error("PLUS_PRODUCT_ID is not defined in the environment variables");
    return null;
  }
  return (
    <Button onClick={() => {
      router.push(`/api/checkout?productId=${productId}`)
    }} size="sm" variant={null} className="cursor-pointer  bg-blue-600/90 hover:bg-blue-600/95 text-white py-4 rounded-xl text-xs font-normal">
      <ArrowUp10Icon /> Upgrade to Plus
    </Button>
  )
}
