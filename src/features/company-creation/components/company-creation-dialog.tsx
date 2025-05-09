"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CreateCompanyFormSchema,
  companyFormSchema,
} from "../utils/company-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function CompanyCreationDialog({
  userId,
  onSave,
}: {
  userId: string;
  onSave: () => void;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateCompanyFormSchema>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = async (data: CreateCompanyFormSchema) => {
    console.log(data);
    const response = await fetch("/api/company/create", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        userId: userId,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      form.reset();
      await authClient.updateUser({
        companyId: data.company.id,
      });
      onSave();
      setOpen(false);
      toast.success("Company created successfully");
    } else {
      console.error("Failed to create company");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Your Company</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Company</DialogTitle>
          <DialogDescription>
            Create a new company to get started.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Company Name"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
