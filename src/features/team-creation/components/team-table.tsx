import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Company } from "@/types/company";
import { removePlural } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, RefreshCcw, Trash } from "lucide-react";
import { ColorPicker } from "@/components/color-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteButton } from "@/features/delete-entity-button/components/delete-entity-button";

interface TeamTableProps {
  companyData: Company;
  userId: string;
  onRefresh?: () => void;
  onCreate?: () => void;
}

export const TeamTable = ({
  companyData,
  userId,
  onRefresh,
  onCreate,
}: TeamTableProps) => {
  const singularName = removePlural(companyData.preferences?.names?.team ?? "");
  const [selectedLocation, setSelectedLocation] = useState<number>(-1);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [createData, setCreateData] = useState<{
    name: string;
    color: string;
    locationId: string;
  }>({
    name: "",
    color: "",
    locationId: "-1",
  });

  const handleCreate = async () => {
    console.log(createData);
    if (!createData.name || !createData.color) {
      toast.error("Please fill in all fields");
      return;
    }
    if (createData.name.length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }
    if (createData.color.length < 4) {
      toast.error("Color must be at least 4 characters");
      return;
    }
    if (createData.locationId === "-1") {
      toast.error("Please select a location");
      return;
    }
    setCreateLoading(true);
    try {
      const response = await fetch("/api/team/create", {
        method: "POST",
        body: JSON.stringify({
          name: createData.name,
          color: createData.color,
          locationId: createData.locationId,
          userId: userId,
          companyId: companyData.id,
        }),
      });
      if (!response.ok) {
        toast.error("Failed to create team");
        throw new Error("Failed to create team");
      }
      const data = await response.json();
      console.log(data);
      toast.success("Team created successfully");
      setCreateData({
        ...createData,
        name: "",
        color: "",
      });
      onCreate?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create team");
    } finally {
      setCreateLoading(false);
    }
  };

  const renderTableContent = () => {
    if (companyData.locations) {
      const selectedLocationData = companyData.locations.find(
        (location) => location.id === selectedLocation
      );

      if (!selectedLocationData) {
        return (
          <div className="flex flex-col items-center gap-1 w-full">
            <p>
              Please select a{" "}
              {removePlural(companyData.preferences?.names?.location || "")} to
              view {companyData.preferences?.names?.team}
            </p>
          </div>
        );
      }

      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>
                {removePlural(companyData.preferences?.names?.location || "")}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedLocationData.teams?.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.name}</TableCell>
                <TableCell>
                  <div
                    className="h-6 rounded-full w-[50%]"
                    style={{ backgroundColor: team.color }}
                  ></div>
                </TableCell>
                <TableCell>{selectedLocationData.name}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="default">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <DeleteButton
                    entity="team"
                    id={team.id}
                    userId={userId}
                    companyId={companyData.id}
                    onDelete={onRefresh}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
  };

  return (
    <Tabs defaultValue="view">
      <TabsList>
        <TabsTrigger value="view">View</TabsTrigger>
        <TabsTrigger value="create">Create</TabsTrigger>
      </TabsList>
      <TabsContent value="view">
        <div className="flex flex-col gap-4 items-end">
          <Button variant="default" className="md:min-w-20" onClick={onRefresh}>
            <RefreshCcw className="min-w-5 min-h-5" />
          </Button>
          <div className="flex flex-col items-center gap-1 w-full">
            <p className="font-bold text-2xl">
              {removePlural(companyData.preferences?.names?.location || "")}
            </p>
            <Select
              defaultValue={selectedLocation.toString()}
              onValueChange={(value) => setSelectedLocation(parseInt(value))}
            >
              <SelectTrigger className="md:min-w-md">
                <SelectValue
                  placeholder={`Select a ${removePlural(
                    companyData.preferences?.names?.location || ""
                  )}`}
                />
              </SelectTrigger>
              <SelectContent>
                {companyData.locations?.map((location) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {renderTableContent()}
        </div>
      </TabsContent>
      <TabsContent value="create">
        <div className="flex flex-col w-full justify-center items-center gap-4">
          <div className="flex flex-col items-center gap-1 w-full">
            <p className="font-bold text-2xl">
              {removePlural(companyData.preferences?.names?.location || "")}
            </p>
            <Select
              defaultValue={createData.locationId}
              onValueChange={(value) =>
                setCreateData({ ...createData, locationId: value })
              }
            >
              <SelectTrigger className="md:min-w-md">
                <SelectValue
                  placeholder={`Select a ${removePlural(
                    companyData.preferences?.names?.location || ""
                  )}`}
                />
              </SelectTrigger>
              <SelectContent>
                {companyData.locations?.map((location) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Card className="md:min-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {`Create a ${singularName}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 max-w-md">
                <p className="font-bold">Name</p>
                <Input
                  placeholder={`Enter the ${singularName} name`}
                  value={createData.name}
                  onChange={(e) =>
                    setCreateData({ ...createData, name: e.target.value })
                  }
                />
                <p className="font-bold">Color</p>
                <ColorPicker
                  className="w-full"
                  name="color"
                  value={createData.color}
                  onChange={(value) => {
                    setCreateData({ ...createData, color: value });
                    console.log(value);
                  }}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreate} disabled={createLoading}>
                {createLoading ? "Creating..." : "Create"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};
