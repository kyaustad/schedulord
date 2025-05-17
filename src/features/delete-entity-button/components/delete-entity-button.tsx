import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface DeleteButtonProps {
  entity: "location" | "team" | "employee" | "company";
  id: string | number;
  userId: string;
  companyId: number;
  onDelete?: () => void;
}
export const DeleteButton = ({
  entity,
  id,
  userId,
  companyId,
  onDelete,
}: DeleteButtonProps) => {
  const [open, setOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleDelete = async () => {
    setDeleteLoading(true);
    if (entity === "location") {
      try {
        const response = await fetch(`/api/location/delete`, {
          method: "DELETE",
          body: JSON.stringify({ locationId: id, userId, companyId }),
        });
        if (response.ok) {
          toast.success("Deleted successfully");
          onDelete?.();
        } else {
          toast.error(`Error deleting: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error deleting location:", error);
      } finally {
        setDeleteLoading(false);
        setOpen(false);
      }
    } else if (entity === "employee") {
      try {
        const response = await fetch(`/api/employee/delete`, {
          method: "DELETE",
          body: JSON.stringify({ deleteId: id, userId, companyId }),
        });
        if (response.ok) {
          toast.success("Deleted successfully");
          onDelete?.();
        } else {
          toast.error(`Error deleting: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
      } finally {
        setDeleteLoading(false);
        setOpen(false);
      }
    } else if (entity === "team") {
      try {
        const response = await fetch(`/api/team/delete`, {
          method: "DELETE",
          body: JSON.stringify({ teamId: id, userId, companyId }),
        });
        if (response.ok) {
          toast.success("Deleted successfully");
          onDelete?.();
        } else {
          toast.error(`Error deleting: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error deleting team:", error);
      } finally {
        setDeleteLoading(false);
        setOpen(false);
      }
    }
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone and is irreversible. Be sure you want
              to delete this as it will also remove any data that references or
              is associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        <Trash className="w-4 h-4" />
      </Button>
    </>
  );
};
