import JoinWaitlistButton from "./buttons";
import { Input } from "./ui/input";

export default function EarlyAccess() {
  return (
    <div id="#waitlist" className="flex flex-col items-center justify-center min-h-[100svh] px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-center">Get Early Access for</h1>
      <span className="text-gray-500 text-center text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4">cato</span>
      <p className="text-xs sm:text-sm font-mono">Be the first to try it!</p>

      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Input type="text" placeholder="your email address" className="w-full sm:w-64" />
        <JoinWaitlistButton className="w-full sm:w-auto">
          Join waitlist
        </JoinWaitlistButton>
      </div>
    </div>
  )
}
