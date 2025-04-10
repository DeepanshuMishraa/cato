import JoinWaitlistButton from "./buttons";
import { Input } from "./ui/input";


export default function EarlyAccess() {
  return (
    <div id="#waitlist" className="flex flex-col items-center justify-center h-[100svh]">
      <h1 className="text-4xl">Get Early Access for</h1>
      <span className="text-gray-500 text-center text-4xl mb-4">cato</span>
      <p className="text-sm font-mono">Be the first to try it!</p>

      <div className="mt-8 flex gap-3">
        <Input type="text" placeholder="your email address" className="w-64" />
        <JoinWaitlistButton >
          Join waitlist
        </JoinWaitlistButton>
      </div>
    </div>
  )
}
