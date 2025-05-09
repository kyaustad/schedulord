"use client";

import { authClient } from "@/lib/auth-client";
import { PageContainer } from "@/components/containers/page-container";
import { SimpleCalendar } from "@/features/calendar/components/simple-calendar";
export default function Dashboard() {
  const { data, isPending, error } = authClient.useSession();
  console.log("data", data);
  return (
    <PageContainer>
      <div className="flex flex-col gap-4 h-full w-full">
        <h1 className="text-2xl font-bold mt-4">Dashboard</h1>
        <SimpleCalendar className="h-full w-full" />
      </div>
    </PageContainer>
  );
}
