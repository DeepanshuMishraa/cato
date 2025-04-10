'use client';

import { AddSiteButton } from "@/components/buttons";
import { authClient } from "@/lib/auth.client";

const Dashboard = () => {

  const { data: session } = authClient.useSession();
  return (
    <div className="p-4 h-[100svh]">
      <div className="flex items-center justify-between">
        <h1 className="font-mono">Hey there, {session?.user.name}</h1>
        <AddSiteButton />
      </div>
    </div>
  )
}

export default Dashboard;
