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
import { useSession } from "@/hooks/use-session";
import { LocationTable } from "@/features/location-creation/components/location-table";

export default function Locations() {
  const {
    session: sessionData,
    isLoading: isSessionLoading,
    error: sessionError,
  } = useSession();
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
    console.log("companyData", companyData);
  }, [companyData]);

  if (isSessionLoading || isCompanyLoading) {
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

  const renderLocationsPage = () => {
    return (
      <div className="flex h-full w-full gap-4">
        <Card className="min-w-lg w-full grow">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {finalCompanyData?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {finalCompanyData && (
              <LocationTable
                userId={sessionData.user.id}
                companyData={finalCompanyData}
                onRefresh={refetchCompany}
                onCreate={refetchCompany}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold">
        {finalCompanyData?.preferences?.names?.location}
      </h1>
      <div className="flex flex-col gap-4 items-center h-full w-full">
        <div className="flex items-center flex-row gap-4 w-full p-4">
          {sessionData.user.companyId ? (
            renderLocationsPage()
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>No company found</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
