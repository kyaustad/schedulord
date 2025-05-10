import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";

interface CompanyPrefsFormProps {
  locationName?: string;
  teamName?: string;
  userName?: string;
}

export const CompanyPrefsForm = ({
  locationName = "Location",
  teamName = "Team",
  userName = "User",
}: CompanyPrefsFormProps) => {
  const [location, setLocation] = useState(locationName);
  const [team, setTeam] = useState(teamName);
  const [user, setUser] = useState(userName);
  return (
    <div className="flex flex-col gap-4">
      <Select onValueChange={() => {}} value={locationName}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Location">Location</SelectItem>
          <SelectItem value="Store">Store</SelectItem>
          <SelectItem value="Office">Office</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
