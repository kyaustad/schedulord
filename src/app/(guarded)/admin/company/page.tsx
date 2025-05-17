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
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { SelectContent } from "@/components/ui/select";
import { SelectItem, SelectValue } from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { InfoIcon } from "lucide-react";
import { Select } from "@/components/ui/select";

export default function Company() {
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
  const [weekStart, setWeekStart] = useState<string>(
    companyData?.weekStart ?? "monday"
  );
  useEffect(() => {
    setFinalCompanyData(companyData);
    setWeekStart(companyData?.weekStart ?? "monday");
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

  const handleCompanySave = () => {
    refetchCompany();
  };

  const renderCompanyPage = () => {
    return (
      <div className="flex h-full w-full gap-4">
        <Card className="md:min-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {finalCompanyData?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="prefs">
              <TabsList>
                <TabsTrigger value="prefs">Preferences</TabsTrigger>
                <TabsTrigger value="week-start">Week Start</TabsTrigger>
              </TabsList>
              <TabsContent value="prefs">
                <CompanyPrefsForm
                  locationName={finalCompanyData?.preferences?.names?.location}
                  teamName={finalCompanyData?.preferences?.names?.team}
                  userName={finalCompanyData?.preferences?.names?.user}
                  userId={sessionData.user.id}
                  companyId={sessionData.user.companyId ?? -1}
                  onSave={refetchCompany}
                />
              </TabsContent>
              <TabsContent value="week-start">
                <div className="flex flex-row items-center align-middle text-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <InfoIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <p>
                        This is the day of the week your company's work week
                        starts on.
                      </p>
                    </PopoverContent>
                  </Popover>
                  <p className="text-lg font-bold">Week Start</p>
                </div>
                <Select value={weekStart} onValueChange={setWeekStart}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </TabsContent>
            </Tabs>
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
