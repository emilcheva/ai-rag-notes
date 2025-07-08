"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import { Button } from "@ragnotes/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ragnotes/ui/dialog";
import { toast } from "@ragnotes/ui/toast";

import type { Note } from "~/app/lib/types";
import { useTRPC } from "~/trpc/react";

export function NotePreviewDialog({ note }: { note: Note }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isOpen = searchParams.get("noteId") === note.id;

  const deleteNote = useMutation(
    trpc.note.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.note.pathFilter());
      },
      onError: (err) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to delete note"
            : "Failed to delete note",
        );
      },
    }),
  );

  const [deletePending, setDeletePending] = useState(false);

  function handleDelete() {
    setDeletePending(true);

    // FIXME: smelly cast
    deleteNote.mutate(String(note.id), {
      onSuccess: () => {
        toast.success("Note deleted successfully!");
        handleClose();
      },
      onError: (error) => {
        console.error("Failed to delete note", error);
        toast.error("Failed to delete note. Please try again.");
      },
      onSettled: () => {
        setDeletePending(false);
      },
    });
  }

  const handleClose = () => {
    if (deletePending) return;

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("noteId");

    void router.replace(`?${currentParams.toString()}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 whitespace-pre-wrap">{note.content}</div>
        <DialogFooter className="mt-6">
          <Button
            variant="destructive"
            className="gap-2"
            onClick={handleDelete}
            disabled={deletePending}
          >
            <Trash2 size={16} />
            {deletePending ? "Deleting..." : "Delete Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
