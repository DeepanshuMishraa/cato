'use client'

import Link from "next/link";
import JoinWaitlistButton, { LogoutButton } from "./buttons";
import CatoIcon from "@/app/icons";
import { authClient } from "@/lib/auth.client";
import { useRouter } from "next/navigation";


export default function Appbar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  return (
    <div className="py-4 px-20 flex justify-between items-center">
      <div>
        <Link href="/" className="text-lg font-bold flex items-center gap-2"><CatoIcon className="" /> CATO</Link>
      </div>
      <div className="space-x-4 text-xs">
        <Link href="/how-it-works" className="text-gray-500 hover:text-black duration-200">How it works</Link>
        <Link href="Features" className="text-gray-500  hover:text-black duration-200">Features</Link>
      </div>

      {session ? (
        <LogoutButton onClick={() => {
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/");
              }
            }
          })
        }} />
      ) : (
        <JoinWaitlistButton>
          Join Waitlist
        </JoinWaitlistButton>
      )}

    </div>
  )
}
