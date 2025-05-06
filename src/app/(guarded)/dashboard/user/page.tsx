"use client";

import { SignOutButton } from "@/components/client/sign-out-button";
import { authClient } from "@/lib/auth-client";

export default function Dashboard() {
  const { data, isPending, error } = authClient.useSession();
  console.log("data", data);
  return (
    <div>
      <h1>Dashboard</h1>
      <h1>User</h1>
      <p>Welcome, {data?.user?.name}</p>
      <p>TOKEN: {data?.session?.token}</p>
      <p>ROLE: {data?.user?.role}</p>
      <SignOutButton />
    </div>
  );
}
