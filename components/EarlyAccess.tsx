'use client'

import { toast } from "sonner";
import JoinWaitlistButton from "./buttons";
import { Input } from "./ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function EarlyAccess() {
  const [loading, setLoading] = useState(false);
  return (
    <div id="waitlist" className="flex flex-col items-center justify-center h-[100svh] space-y-2 px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-center">Get email notifications</h1>
      <span className="text-gray-500 text-center text-2xl sm:text-3xl md:text-4xl">when your site</span>
      <span className="text-gray-700 text-center text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4">goes down</span>
      <p className="text-xs sm:text-sm font-mono">Be the first to try it!</p>

      <div className="mt-6 items-center justify-center sm:mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Input required type="text" placeholder="your email address" className="w-full sm:w-64" />
        <JoinWaitlistButton href="#" onClick={() => {
          setTimeout(() => {
            try {
              setLoading(true);
              toast.success("Now, you will be notified when your site goes down.");
            } catch (err) {
              toast.error("Something went wrong, please try again.");
            } finally {
              setLoading(false);
            }
          }, 1000)
        }}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Get notified"}
        </JoinWaitlistButton>
      </div>
    </div>
  )
}
