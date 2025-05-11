"use client";

import { SignOutButton } from "@/components/client/sign-out-button";
import { useSession } from "@/hooks/use-session";
import { authClient } from "@/lib/auth-client";

export default function Dashboard() {
  const { session, isLoading, error } = useSession();
  console.log("data", session);
  return (
    <div>
      <h1>Dashboard</h1>
      <h1>Manager</h1>
      <p>Welcome, {session?.user?.name}</p>
      <p>TOKEN: {session?.session?.token}</p>
      <p>ROLE: {session?.user?.role}</p>
      <SignOutButton />
    </div>
  );
}
