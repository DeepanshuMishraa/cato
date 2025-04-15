'use client'

import { Menu, X } from "lucide-react";
import Link from "next/link";
import JoinWaitlistButton, { LogoutButton } from "./buttons";
import CatoIcon from "@/app/icons";
import { authClient } from "@/lib/auth.client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Appbar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative z-50">
      <div className="py-4 px-4 md:px-20 flex justify-between items-center bg-white">
        <div>
          <Link href="/" className="text-lg font-bold flex items-center gap-2">
            <CatoIcon className="" /> CATO
          </Link>
        </div>
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="hidden md:block">
          <div className="space-x-4 text-xs">
            <Link href="#how-it-works" className="text-gray-500 hover:text-black duration-200">
              How it works
            </Link>
            <Link href="#subscribe" className="text-gray-500 hover:text-black duration-200">
              Subscribe
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          {session ? (
            <LogoutButton onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/dashboard");
                  }
                }
              })
            }} />
          ) : (
            <JoinWaitlistButton href="/sign-in">
              Get Started
            </JoinWaitlistButton>
          )}
        </div>
      </div>
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-[64px] left-0 right-0 bg-white/95 backdrop-blur-md border-b shadow-sm py-6 px-4 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-4">
              <Link
                href="#features"
                className="text-gray-600 hover:text-black duration-200 text-sm py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-600 hover:text-black duration-200 text-sm py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                How it works
              </Link>
            </div>
            <div>
              {session ? (
                <LogoutButton onClick={() => {
                  authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push("/");
                        setIsMenuOpen(false);
                      }
                    }
                  })
                }} />
              ) : (
                <JoinWaitlistButton href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </JoinWaitlistButton>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
