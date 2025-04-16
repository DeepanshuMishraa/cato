"use client"
import { searchSites } from "@/actions/monitor.actions"
import { AddSiteButton } from "@/components/buttons"
import SearchResult from "@/components/SearchResult"
import SiteCard from "@/components/SitesCard"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { authClient } from "@/lib/auth.client"
import { useMutation } from "@tanstack/react-query"
import { Search } from 'lucide-react'
import { useState, useEffect } from "react"

const Dashboard = () => {
  const { data: session } = authClient.useSession()
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  const mutation = useMutation({
    mutationFn: async () => { 
      if (!session?.user?.id) return null
      return await searchSites(debouncedSearch)
    }
  })

  useEffect(() => {
    if (debouncedSearch && session?.user?.id) {
      mutation.mutate()
    }
  }, [debouncedSearch, session?.user?.id])

  return (
    <main className="min-h-[100svh] bg-white text-black p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <h1 className="text-xl font-mono tracking-tight">Hey, {session?.user?.name || "User"}</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search"
                className="bg-white border border-gray-200 rounded-md pl-10 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <AddSiteButton />
          </div>
        </header>
        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 font-medium">Monitors</h2>
            <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
          </div>
          {mutation.isPending && <div className="text-sm text-gray-500">Searching...</div>}
          {search ? (
            <SearchResult searchResults={mutation.data || undefined} />
          ) : (
            <SiteCard />
          )}
        </section>
      </div>
    </main>
  )
}


export default Dashboard;
