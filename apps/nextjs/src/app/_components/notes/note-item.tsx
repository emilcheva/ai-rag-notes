"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ArrowLeft, Trash2 } from "lucide-react";

import { Button } from "@ragnotes/ui/button";
import { toast } from "@ragnotes/ui/toast";

import { useTRPC } from "~/trpc/react";
import { NoteContentPreview } from "./note-content-preview";

export function NoteItem({ noteId }: { noteId: string }) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deletePending, setDeletePending] = useState(false);

  const { data: note } = useSuspenseQuery(
    trpc.note.byId.queryOptions({
      id: noteId,
    }),
  );

  const deleteNote = useMutation(trpc.note.delete.mutationOptions());

  const handleDelete = () => {
    setDeletePending(true);

    deleteNote.mutate(noteId, {
      onSuccess: () => {
        toast.success("Note deleted successfully!");
        router.replace("/");
        void queryClient.invalidateQueries(trpc.note.all.pathFilter());
      },
      onError: (error) => {
        console.error("Failed to delete note", error);
        toast.error(
          error.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to delete note"
            : "Failed to delete note. Please try again.",
        );
      },
      onSettled: () => {
        setDeletePending(false);
      },
    });
  };

  return (
    <div className="mx-auto py-8 md:container lg:max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Notes
        </Button>

        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deletePending}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {deletePending ? "Deleting..." : "Delete Note"}
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{note.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Created: {new Date(note.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-base leading-relaxed">
            <NoteContentPreview content={note.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
