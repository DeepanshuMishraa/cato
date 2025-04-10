import { Button } from "./ui/button";

export default function JoinWaitlistButton({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      id="#waitlist"
      size={"sm"}
      variant={null}
      onClick={onClick}
      className="cursor-pointer shadow-xs border border-gray-200 text-xs font-normal"
    >
      {children}
    </Button>
  )
}

export function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} id="#waitlist" size={"sm"} variant={null} className="cursor-pointer shadow-xs border border-gray-200 text-xs font-normal">
      Logout
    </Button>
  )
}
