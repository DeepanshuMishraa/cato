"use client"
import { getSites, pingSites } from "@/actions/monitor.actions"
import { authClient } from "@/lib/auth.client"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useEffect, useState } from "react"

interface SiteType {
  id: string
  name: string
  url: string
  responseTime: number
  status: number
  userId: string
  updatedAt?: Date
}

const SiteCard = () => {
  const { data: session } = authClient.useSession()
  const [pingingIds, setPingingIds] = useState<Set<string>>(new Set())
  const [lastPingTime, setLastPingTime] = useState<Record<string, number>>({})

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
    refetchInterval: 10000, // Refetch data every 10 seconds to update UI
  })

  // Initial ping for all sites when component mounts or data changes
  useEffect(() => {
    if (query?.data?.length > 0) {
      query?.data.forEach((site: SiteType) => {
        const now = Date.now()
        // Only ping if it hasn't been pinged in the last 3 minutes
        if (!lastPingTime[site.id] || now - lastPingTime[site.id] >= 3 * 60 * 1000) {
          pingSite(site.url, site.id)
        }
      })
    }
  }, [query.data])

  // Setup interval for regular pinging
  useEffect(() => {
    const interval = setInterval(() => {
      if (query?.data?.length > 0) {
        query?.data.forEach((site: SiteType) => {
          const now = Date.now()
          // Only ping if it hasn't been pinged in the last 3 minutes
          if (!lastPingTime[site.id] || now - lastPingTime[site.id] >= 3 * 60 * 1000) {
            pingSite(site.url, site.id)
          }
        })
      }
    }, 60000) // Check every minute which sites need to be pinged

    return () => clearInterval(interval)
  }, [query.data, lastPingTime])

  const pingSite = async (url: string, siteId: string) => {
    // Don't ping if already in progress
    if (pingingIds.has(siteId)) return

    // Mark site as being pinged
    setPingingIds(prev => new Set(prev).add(siteId))
    setLastPingTime(prev => ({ ...prev, [siteId]: Date.now() }))

    try {
      await pingSites(url)
      // No need for setTimeout here as we're updating lastPingTime
      query.refetch()
      setPingingIds(prev => {
        const updated = new Set(prev)
        updated.delete(siteId)
        return updated
      })
    } catch (error) {
      toast.error(`Failed to ping ${url}`)
      setPingingIds(prev => {
        const updated = new Set(prev)
        updated.delete(siteId)
        return updated
      })
    }
  }

  const getStatusIndicator = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500" // Good
    if (status >= 300 && status < 400) return "bg-yellow-500" // Redirect
    if (status >= 400 && status < 500) return "bg-red-500" // Client Error
    if (status >= 500) return "bg-purple-500" // Server Error
    return "bg-gray-500" // Unknown/No response
  }

  const getStatusText = (status: number) => {
    if (status >= 200 && status < 300) return "ONLINE"
    if (status >= 300 && status < 400) return "REDIRECT"
    if (status >= 400 && status < 500) return "CLIENT ERROR"
    if (status >= 500) return "SERVER ERROR"
    return "OFFLINE"
  }

  const getStatusAnimation = (status: number) => {
    if (status >= 200 && status < 300)
      return "animate-ping opacity-75"
    if (status >= 300 && status < 400)
      return "animate-pulse opacity-75"
    if (status >= 400)
      return "animate-pulse opacity-75"
    return "opacity-75"
  }

  const getStatusDuration = (status: number) => {
    if (status >= 200 && status < 300) return "3s"
    return "1s"
  }

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
                  className={`h-3 w-3 rounded-full ${getStatusIndicator(site.status)}`}
                ></div>
                <div
                  className={`absolute inset-0 rounded-full ${getStatusIndicator(site.status)} ${getStatusAnimation(site.status)}`}
                  style={{
                    animationDuration: getStatusDuration(site.status),
                    animationIterationCount: "infinite"
                  }}
                ></div>
              </div>
              <div>
                <h3 className="font-mono text-sm">{site.url}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{getStatusText(site.status)}</span>
                  <span className="text-gray-300">|</span>
                  <span>{site.responseTime} ms</span>
                  {pingingIds.has(site.id) && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="text-blue-500">CHECKING...</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-500 font-mono">
                {site.status >= 200 && site.status < 400
                  ? "ONLINE"
                  : site.status >= 400 && site.status < 600
                    ? getStatusText(site.status)
                    : "DOWN"}
              </div>

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
