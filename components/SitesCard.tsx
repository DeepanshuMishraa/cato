'use client';

import { getSites } from "@/actions/monitor.actions";
import { authClient } from "@/lib/auth.client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SiteType {
  id: string;
  name: string;
  url: string;
  responseTime: number;
  status: number;
  userId: string;
}

const SiteCard = () => {
  const { data: session } = authClient.useSession();

  const query = useQuery({
    queryKey: ["getSites", session?.user?.id],
    queryFn: async () => {
      const response = await getSites(session?.user?.id as string);
      if (!response.success) {
        toast.error(response.message);
        return [];
      }
      return response.sites;
    },
    enabled: !!session?.user?.id
  });

  if (query.isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading Sites....</div>
  }

  if (query.error) {
    return <div className="flex justify-center items-center h-screen">Error loading sites</div>
  }

  if (query.data?.length === 0) {
    return <div className="flex justify-center items-center h-screen">No sites added yet</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {query.data?.map((site: SiteType) => (
        <div key={site.id} className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-bold">{site.name}</h2>
          <p className="text-gray-600">{site.url}</p>
          <p className="text-gray-600">Response Time: {site.responseTime} ms</p>
          <p className="text-gray-600">Status: {site.status === 1 ? "Online" : "Offline"}</p>
        </div>
      ))}
    </div>
  )
}

export default SiteCard;

