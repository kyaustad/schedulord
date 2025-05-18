"use client";

import { PageContainer } from "@/components/containers/page-container";
import { LoadingSpinner } from "@/components/loading-spinner";
import { LocationQuotas } from "@/features/quotas/components/location-quotas";
import { useCompanyData } from "@/hooks/use-company-data";
import { useSession } from "@/hooks/use-session";
export default function Dashboard() {
  const { session, isLoading, error } = useSession();
  const {
    companyData,
    error: companyError,
    isLoading: isCompanyLoading,
    refetch: refetchCompany,
  } = useCompanyData(session?.user?.id ?? "", session?.user?.role ?? "user");

  console.log("data", session);
  return (
    <PageContainer>
      <div className="flex flex-col gap-4 h-full w-full">
        <h1 className="text-2xl font-bold mt-4">{companyData?.name}</h1>
        {isCompanyLoading || isLoading ? (
          <LoadingSpinner />
        ) : (
          <LocationQuotas />
        )}
      </div>
    </PageContainer>
  );
}
