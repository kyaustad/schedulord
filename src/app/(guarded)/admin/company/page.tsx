"use client";

import { PageContainer } from "@/components/containers/page-container";
import { authClient } from "@/lib/auth-client";
import { CompanyCreationDialog } from "@/features/company-creation/components/company-creation-dialog";
import { useEffect, useState } from "react";
import type { Company } from "@/types/company";
import { Spinner } from "@/components/ui/spinner";
import { useCompanyData } from "@/hooks/use-company-data";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CompanyPrefsForm } from "@/features/company-creation/components/company-prefs-form";
export default function Company() {
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
  }, [companyData]);

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

  const renderCompanyPage = () => {
    return (
      <div className="flex h-full w-full gap-4">
        <Card className="min-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {finalCompanyData?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyPrefsForm
              locationName={finalCompanyData?.preferences?.names?.location}
              teamName={finalCompanyData?.preferences?.names?.team}
              userName={finalCompanyData?.preferences?.names?.user}
              userId={sessionData.user.id}
              companyId={sessionData.user.companyId ?? -1}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold">Company Settings</h1>
      <div className="flex flex-col gap-4 items-center h-full w-full">
        <div className="flex items-center flex-row gap-4">
          {sessionData.user.companyId ? (
            renderCompanyPage()
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
