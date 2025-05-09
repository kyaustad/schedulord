import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

type SessionResponse = Awaited<
  ReturnType<typeof authClient.getSession>
>["data"];

export const useSession = () => {
  const { data, error, isLoading } = useQuery<SessionResponse>({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const response = await authClient.getSession();

        return response.data;
      } catch (error: unknown) {
        const err = error as {
          response?: {
            status: number;
            data: { detail: string };
          };
          message: string;
        };

        throw new Error(err.response?.data.detail || "Failed to fetch session");
      }
    },
    enabled: true,
    staleTime: 60 * 1000,
  });

  return {
    session: data,
    error,
    isLoading,
  };
};
