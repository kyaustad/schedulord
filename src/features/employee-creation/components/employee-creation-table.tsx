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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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
import { Employee } from "@/types/employee";
import { DeleteButton } from "@/features/delete-entity-button/components/delete-entity-button";

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
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<number>(-1);
  const [selectedLocationDataCreate, setSelectedLocationDataCreate] =
    useState<Location | null>(null);
  const [selectedLocationDataView, setSelectedLocationDataView] =
    useState<Location | null>(null);
  // const [selectedTeam, setSelectedTeam] = useState<number>(-1);
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

  useEffect(() => {
    setFilteredEmployees(employees || []);
  }, [employees]);

  useEffect(() => {
    if (selectedLocation === -1) {
      setFilteredEmployees(employees || []);
    } else {
      setFilteredEmployees(
        employees?.filter(
          (employee) => employee.locationId === selectedLocation
        ) || []
      );
    }
  }, [selectedLocation]);

  const handleCreate = async () => {
    setCreateLoading(true);
    if (
      !createData.email ||
      !createData.role ||
      !createData.first_name ||
      !createData.last_name ||
      !createData.locationId ||
      !createData.companyId ||
      !createData.password
    ) {
      toast.error("Please fill in all fields");
      setCreateLoading(false);
      return;
    }
    if (createData.email.length < 3) {
      toast.error("Email must be at least 3 characters");
      setCreateLoading(false);
      return;
    }
    if (createData.role.length < 4) {
      toast.error("Role must be at least 4 characters");
      setCreateLoading(false);
      return;
    }
    if (createData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      setCreateLoading(false);
      return;
    }
    if (createData.first_name.length < 3) {
      toast.error("First name must be at least 3 characters");
      setCreateLoading(false);
      return;
    }
    if (createData.last_name.length < 3) {
      toast.error("Last name must be at least 3 characters");
      setCreateLoading(false);
      return;
    }
    if (createData.teamId === "-1" && createData.role === "user") {
      toast.error("Please select a team");
      setCreateLoading(false);
      return;
    }
    if (createData.locationId === "-1") {
      toast.error("Please select a location");
      setCreateLoading(false);
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
          teamId:
            createData.teamId === "-1" ||
            createData.role === "manager" ||
            createData.role === "admin"
              ? "-1"
              : createData.teamId,
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

      await refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create employee");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleLocationFilter = (value: string) => {
    setSelectedLocation(parseInt(value));
    // setSelectedTeam(-1);
    setSelectedLocationDataView(
      companyData?.locations?.find(
        (location) => location.id === parseInt(value)
      ) || null
    );
    setFilteredEmployees(
      employees?.filter(
        (employee) => employee.locationId === parseInt(value)
      ) || []
    );
  };

  const handleTeamFilter = (value: string) => {
    console.log("value", value);
    if (value === "-1") {
      setFilteredEmployees(
        employees?.filter(
          (employee) => employee.locationId === selectedLocation
        ) || []
      );
    } else {
      setFilteredEmployees(
        employees?.filter(
          (employee) =>
            employee.teamId === parseInt(value) &&
            employee.locationId === selectedLocation
        ) || []
      );
    }
  };

  console.log("selectedLocationDataCreate", selectedLocationDataCreate);
  console.log("companyData", companyData);

  const renderTableContent = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            {companyData.locations && (
              <>
                <TableHead>
                  {removePlural(companyData?.preferences?.names?.team || "")}
                </TableHead>
                <TableHead>
                  {removePlural(
                    companyData?.preferences?.names?.location || ""
                  )}
                </TableHead>
              </>
            )}
            <TableHead>Company</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees?.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.first_name}</TableCell>
              <TableCell>{employee.last_name}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.role}</TableCell>
              {companyData.locations && (
                <>
                  <TableCell>
                    {companyData.locations
                      ?.filter(
                        (location) => location.id === employee.locationId
                      )[0]
                      ?.teams?.find((team) => team.id === employee.teamId)
                      ?.name || "-"}
                  </TableCell>
                  <TableCell>
                    {companyData.locations?.find(
                      (location) => location.id === employee.locationId
                    )?.name || "-"}
                  </TableCell>
                </>
              )}
              <TableCell>{companyData.name}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="default">
                  <Pencil className="w-4 h-4" />
                </Button>
                <DeleteButton
                  entity="employee"
                  id={employee.id}
                  userId={userId}
                  companyId={companyData.id}
                  onDelete={refetch}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableCaption className="w-full">
          {`Showing ${filteredEmployees.length} out of ${employees?.length}`}
        </TableCaption>
      </Table>
    );
  };

  return (
    <Tabs defaultValue="view">
      <TabsList>
        <TabsTrigger value="view">View</TabsTrigger>
        <TabsTrigger value="create">Create</TabsTrigger>
      </TabsList>
      <TabsContent value="view">
        <div className="flex flex-col gap-4 items-end">
          <Button
            variant="default"
            className="md:min-w-20"
            onClick={() => {
              refetch();
            }}
          >
            <RefreshCcw className="min-w-5 min-h-5" />
          </Button>
          <div className="flex flex-col items-center gap-1 w-full">
            <p className="font-bold text-2xl">
              Filter by{" "}
              {removePlural(companyData.preferences?.names?.location || "")}
            </p>
            <Select
              defaultValue={selectedLocation.toString()}
              onValueChange={handleLocationFilter}
            >
              <SelectTrigger className="md:min-w-md">
                <SelectValue
                  placeholder={`Select a ${removePlural(
                    companyData.preferences?.names?.location || ""
                  )}`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-1">All</SelectItem>
                {companyData.locations?.map((location) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-center gap-1 w-full">
            <p className="font-bold text-2xl">
              Filter by{" "}
              {removePlural(companyData.preferences?.names?.team || "")}
            </p>
            <Select
              disabled={selectedLocation === -1}
              defaultValue={"-1"}
              onValueChange={handleTeamFilter}
            >
              <SelectTrigger className="md:min-w-md">
                <SelectValue
                  placeholder={`Select a ${removePlural(
                    companyData.preferences?.names?.team || ""
                  )}`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-1">All</SelectItem>
                {selectedLocationDataView?.teams?.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name}
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
                setSelectedLocationDataCreate(
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
            <p className="font-bold text-2xl">Select a Role</p>
            <Select
              defaultValue={createData.role}
              onValueChange={(value) => {
                if (value === "user") {
                  setCreateData({
                    ...createData,
                    teamId: "-1",
                    role: value as "user" | "manager" | "admin",
                  });
                } else {
                  setCreateData({
                    ...createData,
                    role: value as "user" | "manager" | "admin",
                  });
                }
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
            {selectedLocationDataCreate && createData.role === "user" && (
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
                    {selectedLocationDataCreate?.teams?.map((team) => (
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
