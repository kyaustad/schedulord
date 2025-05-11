import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CompanyPrefsFormProps {
  locationName?: string;
  teamName?: string;
  userName?: string;
  userId: string;
  companyId: number;
  onSave: () => void;
}

export const CompanyPrefsForm = ({
  locationName = "Location",
  teamName = "Team",
  userName = "User",
  userId,
  companyId,
  onSave,
}: CompanyPrefsFormProps) => {
  const [location, setLocation] = useState(locationName);
  const [team, setTeam] = useState(teamName);
  const [user, setUser] = useState(userName);
  console.log("userId", userId);
  const handleSave = async () => {
    try {
      const response = await fetch("/api/company/preferences/update", {
        method: "POST",
        body: JSON.stringify({
          userId,
          locationName: location,
          teamName: team,
          userName: user,
          companyId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save company preferences");
      }
      toast.success("Company preferences saved");
      onSave();
    } catch (error) {
      toast.error("Failed to save company preferences");
    }
  };

  useEffect(() => {
    setLocation(locationName);
    setTeam(teamName);
    setUser(userName);
  }, [locationName, teamName, userName]);

  return (
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
              This is what you want 'Locations' to be called. Think of locations
              as the physical places, like a Store, Office, Branch, or
              Warehouse.
            </p>
          </PopoverContent>
        </Popover>
        <p className="text-lg font-bold">Locations</p>
      </div>
      <Select onValueChange={setLocation} value={location}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Locations">Locations</SelectItem>
          <SelectItem value="Stores">Stores</SelectItem>
          <SelectItem value="Offices">Offices</SelectItem>
          <SelectItem value="Branches">Branches</SelectItem>
          <SelectItem value="Warehouses">Warehouses</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex flex-row items-center align-middle text-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <InfoIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <p>
              This is what you want 'Teams' to be called. Think of teams as
              groups of people, like a Team, Department, or Section.
            </p>
          </PopoverContent>
        </Popover>
        <p className="text-lg font-bold">Teams</p>
      </div>
      <Select onValueChange={setTeam} value={team}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Teams">Teams</SelectItem>
          <SelectItem value="Departments">Departments</SelectItem>
          <SelectItem value="Sections">Sections</SelectItem>
          <SelectItem value="Units">Units</SelectItem>
          <SelectItem value="Groups">Groups</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex flex-row w-full justify-end">
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};
