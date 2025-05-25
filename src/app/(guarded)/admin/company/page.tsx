"use client";

import { PageContainer } from "@/components/containers/page-container";
import { Spinner } from "@/components/ui/spinner";
import { CompanyCreationDialog } from "@/features/company-creation/components/company-creation-dialog";
import { useCompanyData } from "@/hooks/use-company-data";
import type { Company } from "@/types/company";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyPrefsForm } from "@/features/company-creation/components/company-prefs-form";
import { CompanyWeekStart } from "@/features/company-creation/components/company-week-start";
import { useSession } from "@/hooks/use-session";

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
								<CompanyWeekStart
									companyId={finalCompanyData?.id ?? -1}
									userId={sessionData.user.id}
									onSave={refetchCompany}
									companyWeekStart={finalCompanyData?.weekStart ?? "monday"}
								/>
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
