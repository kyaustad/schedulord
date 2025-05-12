import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Company } from "@/types/company";
import { Location } from "@/types/location";
import { removePlural } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, RefreshCcw, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployeesData } from "@/hooks/use-employees-data";

interface EmployeeCreationTableProps {
  companyData: Company;
  userId: string;
  scope: "admin" | "manager";
  onRefresh?: () => void;
  onCreate?: () => void;
}

export const EmployeeCreationTable = ({
  companyData,
  userId,
  scope,
  onRefresh,
  onCreate,
}: EmployeeCreationTableProps) => {
  const { employees, error, isLoading, refetch } = useEmployeesData(
    userId,
    scope
  );
  console.log("employees", employees);
  const [selectedLocation, setSelectedLocation] = useState<number>(-1);
  const [selectedLocationData, setSelectedLocationData] =
    useState<Location | null>(null);
  const [createData, setCreateData] = useState<{
    email: string;
    role: "user" | "manager" | "admin";
    first_name: string;
    last_name: string;
    locationId: string;
    teamId: string;
    companyId: string;
    password: string;
  }>({
    email: "",
    role: "user",
    first_name: "",
    last_name: "",
    locationId: "-1",
    teamId: "-1",
    companyId: "-1",
    password: "",
  });

  const handleCreate = async () => {
    console.log(createData);
    if (
      !createData.email ||
      !createData.role ||
      !createData.first_name ||
      !createData.last_name ||
      !createData.locationId ||
      !createData.teamId ||
      !createData.companyId ||
      !createData.password
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    if (createData.email.length < 3) {
      toast.error("Email must be at least 3 characters");
      return;
    }
    if (createData.role.length < 4) {
      toast.error("Role must be at least 4 characters");
      return;
    }
    if (createData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (createData.first_name.length < 3) {
      toast.error("First name must be at least 3 characters");
      return;
    }
    if (createData.last_name.length < 3) {
      toast.error("Last name must be at least 3 characters");
      return;
    }
    if (createData.teamId === "-1") {
      toast.error("Please select a team");
      return;
    }
    if (createData.locationId === "-1") {
      toast.error("Please select a location");
      return;
    }
    try {
      const response = await fetch("/api/employee/create", {
        method: "POST",
        body: JSON.stringify({
          email: createData.email,
          role: createData.role,
          first_name: createData.first_name,
          last_name: createData.last_name,
          locationId: createData.locationId,
          teamId: createData.teamId,
          companyId: companyData.id,
          password: createData.password,
          userId: userId,
        }),
      });
      if (!response.ok) {
        toast.error("Failed to create employee");
        throw new Error("Failed to create employee");
      }
      const data = await response.json();
      console.log(data);
      toast.success("Employee created successfully");
      setCreateData({
        ...createData,
        email: "",
        first_name: "",
        last_name: "",
        password: "",
      });

      onCreate?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create employee");
    }
  };
  console.log("selectedLocationData", selectedLocationData);
  console.log("companyData", companyData);

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
              view Employees
            </p>
          </div>
        );
      }

      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>
                {removePlural(companyData?.preferences?.names?.team || "")}
              </TableHead>
              <TableHead>
                {removePlural(companyData?.preferences?.names?.location || "")}
              </TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees?.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.first_name}</TableCell>
                <TableCell>{employee.last_name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  {
                    selectedLocationData.teams?.find(
                      (team) => team.id === employee.teamId
                    )?.name
                  }
                </TableCell>
                <TableCell>{selectedLocationData.name}</TableCell>
                <TableCell>{employee.companyId}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="default">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive">
                    <Trash className="w-4 h-4" />
                  </Button>
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
              Select a{" "}
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
              Select a{" "}
              {removePlural(companyData.preferences?.names?.location || "")}
            </p>
            <Select
              defaultValue={createData.locationId}
              onValueChange={(value) => {
                setCreateData({ ...createData, locationId: value });
                setSelectedLocationData(
                  companyData.locations?.find(
                    (location) => location.id === parseInt(value)
                  ) || null
                );
              }}
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
            {selectedLocationData && (
              <>
                <p className="font-bold text-2xl">
                  Select a{" "}
                  {removePlural(companyData.preferences?.names?.team || "")}
                </p>
                <Select
                  defaultValue={createData.teamId}
                  onValueChange={(value) =>
                    setCreateData({ ...createData, teamId: value })
                  }
                >
                  <SelectTrigger className="md:min-w-md">
                    <SelectValue
                      placeholder={`Select a ${removePlural(
                        companyData.preferences?.names?.team || ""
                      )}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedLocationData?.teams?.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
          <Card className="md:min-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {`Create Employee`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 max-w-md">
                <p className="font-bold">First Name</p>
                <Input
                  placeholder={`Enter First Name`}
                  value={createData.first_name}
                  onChange={(e) =>
                    setCreateData({ ...createData, first_name: e.target.value })
                  }
                />
                <p className="font-bold">Last Name</p>
                <Input
                  placeholder={`Enter Last Name`}
                  value={createData.last_name}
                  onChange={(e) => {
                    setCreateData({ ...createData, last_name: e.target.value });
                    console.log(e.target.value);
                  }}
                />
                <p className="font-bold">Email</p>
                <Input
                  placeholder={`Enter Email`}
                  value={createData.email}
                  onChange={(e) => {
                    setCreateData({ ...createData, email: e.target.value });
                  }}
                />
                <p className="font-bold">Password</p>
                <Input
                  placeholder={`Enter Password`}
                  value={createData.password}
                  type="password"
                  onChange={(e) => {
                    setCreateData({ ...createData, password: e.target.value });
                  }}
                />
                <p className="font-bold">Role</p>
                <Select
                  defaultValue={"user"}
                  onValueChange={(value) => {
                    setCreateData({
                      ...createData,
                      role: value as "user" | "manager" | "admin",
                    });
                  }}
                >
                  <SelectTrigger className="md:min-w-md">
                    <SelectValue placeholder={`Select a Role`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Employee</SelectItem>
                    {scope === "admin" && (
                      <>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreate}>Create</Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};
