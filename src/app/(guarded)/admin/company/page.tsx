"use client";

import { PageContainer } from "@/components/containers/page-container";
import { authClient } from "@/lib/auth-client";
import { CompanyCreationDialog } from "@/features/company-creation/components/company-creation-dialog";
import { useEffect, useState } from "react";
import type { Company } from "@/types/company";
import { Spinner } from "@/components/ui/spinner";
import { useCompanyData } from "@/hooks/use-company-data";
import { useRouter } from "next/navigation";

export default function Company() {
  const router = useRouter();
  const {
    data: sessionData,
    isPending: isSessionPending,
    error: sessionError,
    refetch: refetchSession,
  } = authClient.useSession();
  const {
    companyData,
    error: companyError,
    isLoading: isCompanyLoading,
    refetch: refetchCompany,
  } = useCompanyData(
    sessionData?.user?.id ?? "",
    sessionData?.user?.role ?? "user"
  );
  const [finalCompanyData, setFinalCompanyData] = useState<Company | null>(
    companyData
  );
  useEffect(() => {
    setFinalCompanyData(companyData);
  }, [companyData, sessionData]);

  if (isSessionPending || isCompanyLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-full">
          <Spinner size="large" />
        </div>
      </PageContainer>
    );
  }

  if (sessionError) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">
            Error loading session: {sessionError.message}
          </p>
        </div>
      </PageContainer>
    );
  }

  if (companyError) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">
            Error loading company data: {companyError.message}
          </p>
        </div>
      </PageContainer>
    );
  }

  if (!sessionData?.user) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-full">
          <p>No user session found</p>
        </div>
      </PageContainer>
    );
  }

  if (sessionData.user.role !== "admin") {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-full">
          <p>You do not have permission to access this page</p>
        </div>
      </PageContainer>
    );
  }

  const handleCompanySave = () => {
    refetchSession();
    refetchCompany();
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 h-full w-full">
        <h1 className="text-2xl font-bold mt-4">Company Settings</h1>
        <div className="flex flex-row gap-4">
          {sessionData.user.companyId ? (
            <div>
              <h2>Company Name</h2>
              <p>{finalCompanyData?.name ?? "No company name available"}</p>
            </div>
          ) : (
            <CompanyCreationDialog
              onSave={handleCompanySave}
              userId={sessionData.user.id}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
