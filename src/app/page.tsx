"use client";

import LoginCard from "@/components/login-card";
import Image from "next/image";
import SignUpCard from "@/components/sign-up-card";
import { checkIfNoUsers } from "@/lib/check-if-no-users";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

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
    <div className="grid grid-rows-[20px_1fr_20px]  justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center flex flex-col items-center">
          <Image
            src="/logo_v1.png"
            alt="logo"
            className="rounded-xl"
            width={300}
            height={300}
          />
          {noUsers ? <SignUpCard /> : <LoginCard />}
        </div>
      </main>
    </div>
  );
}
