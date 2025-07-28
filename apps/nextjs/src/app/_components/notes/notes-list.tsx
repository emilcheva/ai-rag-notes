"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useNotesFilters } from "~/app/hooks/use-notes-filters";
import { useTRPC } from "~/trpc/react";
import { DataPagination } from "../pagination/data-pagination";
import { EmptyState } from "../ui-states/empty-state";
import { LoadingState } from "../ui-states/loading-state";
import { NoteItemCard } from "./note-item-card";

export function NotesList() {
  const trpc = useTRPC();
  const [filters, setFilters] = useNotesFilters();
  const { data: notesData, isRefetching } = useSuspenseQuery(
    trpc.note.all.queryOptions({
      ...filters,
    }),
  );

  if (isRefetching) {
    return <LoadingState title="Loading Notes" description="Please wait..." />;
  }

  if (notesData.notes.length === 0) {
    return (
      <EmptyState
        title="No Notes Found"
        description="No notes yet. Create your first note!"
      />
    );
  }

  if (filters.page > notesData.totalPages) {
    return (
      <EmptyState
        title="No Notes Found"
        description={`No notes found for page ${filters.page}`}
      />
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {notesData.notes.map((note) => {
          return <NoteItemCard key={note.id} note={note} />;
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
