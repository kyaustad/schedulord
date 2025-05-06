"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({});
    router.refresh();
  };
  return <Button onClick={handleSignOut}>Sign Out</Button>;
}
