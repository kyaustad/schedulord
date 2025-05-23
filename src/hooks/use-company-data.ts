import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import type { Company } from "@/types/company";

type CompanyResponse = {
  companyData: Company | null;
};

type CompanyRequest = {
  userId: string;
  scope: string;
};

export const useCompanyData = (userId: string, role: string) => {
  const { data, error, isLoading, refetch } = useQuery<CompanyResponse>({
    queryKey: ["companyData", userId, role],
    queryFn: async () => {
      try {
        const response = await fetch("/api/company", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, role }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch company data");
        }

        const responseData = await response.json();
        return responseData;
      } catch (error: unknown) {
        const err = error as {
          response?: {
            status: number;
            data: { detail: string };
          };
          message: string;
        };

        throw new Error(
          err.response?.data.detail || "Failed to fetch company data"
        );
      }
    },
    enabled: !!userId,
    staleTime: 600000, // 10 minutes
    gcTime: 3600000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    companyData: data?.companyData ?? null,
    error,
    isLoading,
    refetch,
  };
};
