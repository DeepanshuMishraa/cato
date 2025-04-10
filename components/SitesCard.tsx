"use client"

import { getSites } from "@/actions/monitor.actions"
import { authClient } from "@/lib/auth.client"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

interface SiteType {
  id: string
  name: string
  url: string
  responseTime: number
  status: number
  userId: string
}

const SiteCard = () => {
  const { data: session } = authClient.useSession()

  const query = useQuery({
    queryKey: ["getSites", session?.user?.id],
    queryFn: async () => {
      const response = await getSites(session?.user?.id as string)
      if (!response.success) {
        toast.error(response.message)
        return []
      }
      return response.sites
    },
    enabled: !!session?.user?.id,
  })

  if (query.isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (query.error) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500 font-mono text-sm">Error loading sites</div>
    )
  }

  if (query.data?.length === 0) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500 font-mono text-sm">No sites added yet</div>
    )
  }

  return (
    <div className="space-y-4">
      {query.data?.map((site: SiteType) => (
        <div key={site.id} className="border border-gray-100 hover:border-gray-200 transition-all rounded-sm p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className={`h-3 w-3 rounded-full ${site.status === 1 ? "bg-green-500" : "bg-red-500"
                    }`}
                ></div>
                <div
                  className={`absolute inset-0 rounded-full ${site.status === 1
                      ? "bg-green-500 animate-ping opacity-75"
                      : "bg-red-500 animate-pulse opacity-75"
                    }`}
                  style={{
                    animationDuration: site.status === 1 ? "3s" : "1s",
                    animationIterationCount: "infinite"
                  }}
                ></div>
              </div>
              <div>
                <h3 className="font-mono text-sm">{site.url}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{site.status === 1 ? "ONLINE" : "OFFLINE"}</span>
                  <span className="text-gray-300">|</span>
                  <span>{site.responseTime} ms</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-500 font-mono">{site.status === 1 ? "14h 26m" : "DOWN"}</div>

              <button className="text-gray-400 hover:text-black transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4ZM8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6ZM8 12C6.9 12 6 12.9 6 14C6 15.1 6.9 16 8 16C9.1 16 10 15.1 10 14C10 12.9 9.1 12 8 12Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SiteCard
