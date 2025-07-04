"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";
import { NoteItem } from "./note-item";

export function NotesList() {
  const trpc = useTRPC();
  const { data: notes } = useSuspenseQuery(trpc.note.all.queryOptions());

  if (notes.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">
          No notes yet. Create your first note!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <div className="flex w-full flex-col gap-4">
        {notes.map((note) => {
          return <NoteItem key={note.id} />;
        })}
      </div>
    </div>
  );
}
