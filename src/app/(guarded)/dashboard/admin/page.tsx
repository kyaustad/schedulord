"use client";

import { authClient } from "@/lib/auth-client";
import { PageContainer } from "@/components/containers/page-container";
import { SimpleCalendar } from "@/features/calendar/components/simple-calendar";
import { useSession } from "@/hooks/use-session";
export default function Dashboard() {
  const { session, isLoading, error } = useSession();
  console.log("data", session);
  return (
    <PageContainer>
      <div className="flex flex-col gap-4 h-full w-full">
        <h1 className="text-2xl font-bold mt-4">Dashboard</h1>
        <SimpleCalendar className="h-full w-full" />
      </div>
    </PageContainer>
  );
}
