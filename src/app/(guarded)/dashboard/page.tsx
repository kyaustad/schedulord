"use client";

import { SignOutButton } from "@/components/client/sign-out-button";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
export default function Dashboard() {
  const { data, isPending, error } = authClient.useSession();
  console.log("data", data);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-row items-center align-middle justify-between gap-4">
        <Spinner size="small" />
        <h1>Taking you to the right place...</h1>
      </div>
    </div>
  );
}
