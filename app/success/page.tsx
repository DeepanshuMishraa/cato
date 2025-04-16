import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function Page({
  searchParams: { checkoutId },
}: {
  searchParams: {
    checkoutId: string
  }
}) {
  return (
    <div className="container max-w-lg min-h-[80vh] mx-auto flex items-center justify-center p-4">
      <Card>
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <CardTitle className="text-xl">Payment Successful</CardTitle>
          <CardDescription>Your subscription has been confirmed</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground text-center">
            Thank you for subscribing to Cato. Your checkout is being processed and you&apos;ll receive a confirmation email shortly.
          </p>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
