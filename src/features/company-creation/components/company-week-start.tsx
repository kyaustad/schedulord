import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectTrigger, SelectValue } from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CompanyWeekStartProps {
  companyId: number;
  userId: string;
  onSave: () => void;
  companyWeekStart: string;
}

export const CompanyWeekStart = ({
  companyId,
  userId,
  onSave,
  companyWeekStart,
}: CompanyWeekStartProps) => {
  const [weekStart, setWeekStart] = useState<string>(companyWeekStart);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const response = await fetch("/api/company/week-start/update", {
        method: "POST",
        body: JSON.stringify({ companyId, userId, weekStart }),
      });
      if (!response.ok) {
        throw new Error("Failed to save company week start");
      }
      toast.success("Successfully updated company week start!");
      onSave();
    } catch (error) {
      toast.error("Failed to save company week start: " + error);
    } finally {
      setSaveLoading(false);
    }
  };
  return (
    <>
      <div className="flex flex-row items-center align-middle text-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <InfoIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <p>
              This is the day of the week your company's schedules should start
              on.
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
      <div className="flex flex-row w-full justify-end mt-4">
        <Button onClick={handleSave} disabled={saveLoading}>
          {saveLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </>
  );
};
