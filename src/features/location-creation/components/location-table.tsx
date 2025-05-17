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
import { DeleteButton } from "@/features/delete-entity-button/components/delete-entity-button";

interface LocationTableProps {
  companyData: Company;
  userId: string;
  onRefresh?: () => void;
  onCreate?: () => void;
}

export const LocationTable = ({
  companyData,
  userId,
  onRefresh,
  onCreate,
}: LocationTableProps) => {
  const singularName = removePlural(
    companyData.preferences?.names?.location ?? ""
  );
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  const [createData, setCreateData] = useState<{
    name: string;
    address: string;
  }>({
    name: "",
    address: "",
  });

  const handleCreate = async () => {
    setCreateLoading(true);
    if (!createData.name || !createData.address) {
      toast.error("Please fill in all fields");
      return;
    }
    if (createData.name.length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }
    if (createData.address.length < 3) {
      toast.error("Address must be at least 3 characters");
      return;
    }
    try {
      const response = await fetch("/api/location/create", {
        method: "POST",
        body: JSON.stringify({
          name: createData.name,
          address: createData.address,
          userId: userId,
          companyId: companyData.id,
        }),
      });
      if (!response.ok) {
        toast.error("Failed to create location");
        throw new Error("Failed to create location");
      }
      const data = await response.json();
      console.log(data);
      toast.success("Location created successfully");
      setCreateData({
        name: "",
        address: "",
      });
      onCreate?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create location");
    } finally {
      setCreateLoading(false);
    }
  };

  const renderTableContent = () => {
    if (companyData.locations) {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>
                # of {companyData.preferences?.names?.team ?? ""}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companyData.locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell>{location.teams?.length ?? 0}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="default">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <DeleteButton
                    entity="location"
                    id={location.id}
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
          {renderTableContent()}
        </div>
      </TabsContent>
      <TabsContent value="create">
        <div className="flex w-full justify-center">
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
                <p className="font-bold">Address</p>
                <Input
                  placeholder={`Enter the ${singularName} address`}
                  value={createData.address}
                  onChange={(e) =>
                    setCreateData({ ...createData, address: e.target.value })
                  }
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
