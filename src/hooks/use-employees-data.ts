import { useQuery } from "@tanstack/react-query";
import type { Employee } from "@/types/employee";

type EmployeesResponse = {
  employees: Employee[] | null;
};

type CompanyRequest = {
  userId: string;
  scope: string;
};

export const useEmployeesData = (userId: string, scope: string) => {
  const { data, error, isLoading, refetch } = useQuery<EmployeesResponse>({
    queryKey: ["employeesData", userId, scope],
    queryFn: async () => {
      try {
        const response = await fetch("/api/employee", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, scope }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch employees data");
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
          err.response?.data.detail || "Failed to fetch employees data"
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
    employees: data?.employees ?? null,
    error,
    isLoading,
    refetch,
  };
};
