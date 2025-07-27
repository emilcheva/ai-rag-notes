"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@ragnotes/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ragnotes/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ragnotes/ui/form";
import { Input } from "@ragnotes/ui/input";
import { Textarea } from "@ragnotes/ui/textarea";
import { toast } from "@ragnotes/ui/toast";

import { useTRPC } from "~/trpc/react";

const noteFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title cannot be empty.",
  }),
  content: z.string().min(1, {
    message: "Content cannot be empty.",
  }),
});

export function CreateNoteButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>
        <Plus />
        <span className="ml-2">Create Note</span>
      </Button>
      <CreateNoteDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}

interface CreateNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateNoteDialog({ open, onOpenChange }: CreateNoteDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const form = useForm<z.infer<typeof noteFormSchema>>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const createNote = useMutation(trpc.note.create.mutationOptions());

  function onSubmit(values: z.infer<typeof noteFormSchema>) {
    createNote.mutate(
      {
        title: values.title,
        content: values.content,
      },
      {
        onSuccess: () => {
          toast.success("Note created successfully!");
          form.reset();
          onOpenChange(false);
          router.push("/");
          void queryClient.invalidateQueries(trpc.note.all.pathFilter());
        },
        onError: (error) => {
          console.error("Error creating note:", error);
          toast.error(
            error.data?.code === "UNAUTHORIZED"
              ? "You must be logged in to create note"
              : "Failed to create note. Please try again.",
          );
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Fill in the details for your new note. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
