"use client";

import LoginCard from "@/components/login-card";
import Image from "next/image";
import SignUpCard from "@/components/sign-up-card";
import { checkIfNoUsers } from "@/lib/check-if-no-users";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { PageContainer } from "@/components/containers/page-container";
import ThemeSelectionButton from "@/features/theme-selection-button/components/theme-selection-button";
import { env } from "@/env/env";
export default function Home() {
  const [noUsers, setNoUsers] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await authClient.getSession();
      setData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const checkUsers = async () => {
      const result = await checkIfNoUsers();
      setNoUsers(result);
    };
    checkUsers();
  }, []);

  return (
    <div className="flex flex-col justify-items-center place-items-center min-w-screen min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ThemeSelectionButton />
      <div className="text-center gap-4 flex flex-col items-center place-items-center w-full">
        <Image
          src={env.NEXT_PUBLIC_APP_ICON_URL}
          alt="logo"
          className="rounded-xl"
          width={300}
          height={300}
        />
        {noUsers ? <SignUpCard /> : <LoginCard />}
      </div>
    </div>
  );
}
