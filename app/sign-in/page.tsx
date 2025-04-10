'use client'
import { Github } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth.client"
import CatoIcon from "../icons"

export default function SignInPage() {
  return (
    <div className="min-h-[100svh] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(to_bottom,white,rgba(255,255,255,0.5))] pointer-events-none" />
      <div className="absolute top-10 left-10 w-24 h-24 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-40"></div>

      <Card className="w-full max-w-sm rounded-xs border-slate-200 shadow-sm relative z-10 backdrop-blur-sm bg-white/80">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
            <CatoIcon />
          </div>
        </div>

        <CardHeader className="pb-2 pt-6">
          <div className="w-12 h-1 bg-slate-800 mx-auto mb-4 rounded-full" />
          <CardTitle className="text-center text-xl font-medium">Sign In</CardTitle>
          <CardDescription className="text-center text-sm text-slate-500">Login to your cato account</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 pt-4">
          <Button onClick={async () => {
            await authClient.signIn.social({
              provider: "github",
              callbackURL: "/"
            })
          }} className="w-full rounded-xs flex items-center justify-center gap-2 py-5 border-slate-300 transition-colors">
            <Github size={18} />
            <span>Continue with GitHub</span>
          </Button>

          <div className="text-center text-xs text-slate-400 mt-6">
            By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>
          </div>
        </CardContent>

        <div className="p-4 text-center border-t border-slate-100">
          <span className="text-sm text-slate-500">
            Need help? <a href="https://x.com/DeepanshuDipxsy" className="text-slate-900 font-medium cursor-pointer">Contact support</a>
          </span>
        </div>
      </Card>
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-700"></div>
      <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
    </div>
  )
}
