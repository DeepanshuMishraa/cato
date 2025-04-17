'use client'

import { authClient } from "@/lib/auth.client";
import Link from "next/link";

const Hero = () => {
  const session = authClient.useSession();
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center max-w-3xl mx-auto px-4 sm:px-6 motion-preset-fade motion-duration-1000 border-b">
      <div className="mb-2 text-xs sm:text-sm font-mono tracking-wider text-gray-500 uppercase">Uptime monitoring</div>
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-light text-center mb-4 sm:mb-6 leading-tight">
        Monitor <span className="font-normal text-gray-500">every</span> second of your digital presence
      </h1>
      <p className="font-mono text-gray-600 text-[10px] sm:text-xs mb-8 sm:mb-12 text-center max-w-lg px-2 sm:px-0">
        Instant notifications. Real-time analytics. Reliable monitoring.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
        <Link href={session?.data?.user ? "/dashboard" : "/sign-in"}>
          <button
            type="submit"
            className="w-full sm:w-auto rounded-none bg-black hover:bg-gray-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg"
          >
            Start Monitoring
          </button>
        </Link>
        <a href="#learn-more" className="text-xs sm:text-sm font-mono underline text-gray-600 hover:text-black">
          Learn more →
        </a>
      </div>
    </div >
  );
};

export default Hero;
