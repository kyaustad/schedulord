"use client";

import { SignOutButton } from "@/components/client/sign-out-button";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/hooks/use-session";
export default function Dashboard() {
  const { session, isLoading, error } = useSession();
  console.log("data", session);
  const router = useRouter();
  useEffect(() => {
    if (isLoading) return; // Don't navigate while loading
    if (!session?.user?.role) {
      router.push("/");
      return;
    }

    const role = session?.user?.role;
    if (role === "admin") {
      router.push("/dashboard/admin");
    } else if (role === "manager") {
      router.push("/dashboard/manager");
    } else if (role === "user") {
      router.push("/dashboard/user");
    } else {
      router.push("/"); // Fallback for invalid roles
    }
  }, [session, isLoading, router]);
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <div className="flex flex-row items-center align-middle justify-between gap-4">
        <Spinner size="small" />
        <h1>Taking you to the right place...</h1>
      </div>
    </div>
  );
}
