import Link from "next/link";
import JoinWaitlistButton from "./buttons";
import  CatoIcon  from "@/app/icons";


export default function Appbar() {
  return (
    <div className="py-4 px-20 flex justify-between items-center">
      <div>
        <Link href="/" className="text-lg font-bold flex items-center gap-2"><CatoIcon className=""/> CATO</Link>
      </div>
      <div className="space-x-4 text-xs">
        <Link href="/how-it-works" className="text-gray-500 hover:text-black duration-200">How it works</Link>
        <Link href="Features" className="text-gray-500  hover:text-black duration-200">Features</Link>
      </div>

      <JoinWaitlistButton>
        Join Waitlist
      </JoinWaitlistButton>

    </div>
  )
}
