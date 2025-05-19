import { useCompanyData } from "@/hooks/use-company-data";
import { useSession } from "@/hooks/use-session";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Location } from "@/types/location";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { InfoIcon, SaveIcon } from "lucide-react";
import { removePlural } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
export const LocationQuotas = () => {
  const { session, isLoading, error } = useSession();
  const {
    companyData,
    error: companyError,
    isLoading: isCompanyLoading,
    refetch: refetchCompany,
  } = useCompanyData(session?.user?.id ?? "", session?.user?.role ?? "user");
  const [location, setLocation] = useState<Location | null>(null);
  useEffect(() => {
    const matchingLocation = companyData?.locations?.find(
      (location) => location.id === session?.user?.locationId
    );
    setLocation(matchingLocation ?? null);
  }, [companyData, session?.user?.locationId]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hoursQuota, setHoursQuota] = useState<number>(
    location?.hoursQuota ?? 0
  );

  useEffect(() => {
    if (location) {
      setHoursQuota(location.hoursQuota);
    }
  }, [location, companyData]);

  if (isCompanyLoading || isLoading) {
    return <LoadingSpinner />;
  }
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/location/update-hours-quota", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user?.id,
          companyId: companyData?.id,
          hoursQuota,
          locationId: location?.id,
        }),
      });
      if (response.ok) {
        refetchCompany();
        toast.success("Hours quota updated successfully!");
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update hours quota");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full justify-center items-center gap-4">
      <Card className="min-w-sm">
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-bold">{location?.name}</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center align-middle text-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <InfoIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <p>
                    {`This is the quota of hours needed per week for your ${removePlural(
                      companyData?.preferences?.names?.location ?? "location"
                    )} to hit when making schedules.`}
                  </p>
                </PopoverContent>
              </Popover>
              <p className="text-lg font-bold">Weekly Hours Quota</p>
            </div>
            <Input
              type="number"
              value={hoursQuota}
              onChange={(e) => setHoursQuota(Number(e.target.value))}
            />
            <div className="flex flex-row justify-end w-full text-center gap-2 mt-2">
              <Button disabled={isSaving} onClick={handleSave}>
                <SaveIcon />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
