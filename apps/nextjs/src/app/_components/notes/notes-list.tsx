"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { Skeleton } from "@ragnotes/ui/skeleton";

import { useNotesFilters } from "~/app/hooks/use-notes-filters";
import { useTRPC } from "~/trpc/react";
import { DataPagination } from "../pagination/data-pagination";
import { NoteItem } from "./note-item";

export function NotesList() {
  const trpc = useTRPC();
  const [filters, setFilters] = useNotesFilters();
  const { data: notesData, isRefetching } = useSuspenseQuery(
    trpc.note.all.queryOptions({
      ...filters,
    }),
  );

  if (isRefetching) {
    return <LoadingSkeleton />;
  }

  if (filters.page > notesData.totalPages) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">
          No notes found for page {filters.page}
        </p>
      </div>
    );
  }

  if (notesData.notes.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">
          No notes yet. Create your first note!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {notesData.notes.map((note) => {
          return <NoteItem key={note.id} note={note} />;
        })}
      </div>
      <DataPagination
        page={filters.page}
        totalPages={notesData.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
    </div>
  );
}

export const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
};
