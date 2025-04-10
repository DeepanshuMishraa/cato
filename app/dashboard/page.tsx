'use client';

import { AddSiteButton } from "@/components/buttons";
import SiteCard from "@/components/SitesCard";
import { authClient } from "@/lib/auth.client";

const Dashboard = () => {
  const { data: session } = authClient.useSession();
  return (
    <main className="container mx-auto p-4 min-h-[100svh]">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-mono">
          Welcome, {session?.user?.name || 'User'}
        </h1>
        <AddSiteButton />
      </header>
      <section className="mt-4">
        <SiteCard />
      </section>
    </main>
  );
};

export default Dashboard;
