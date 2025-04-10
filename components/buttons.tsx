import { Button } from "./ui/button";

export default function JoinWaitlistButton({ children }: { children: React.ReactNode }) {
  return (
    <Button id="#waitlist" size={"sm"} variant={null} className="cursor-pointer shadow-xs border border-gray-200 text-xs font-normal">
      {children}
    </Button>
  )
}
