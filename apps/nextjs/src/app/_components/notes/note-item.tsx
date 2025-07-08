"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@ragnotes/ui/card";

import type { Note } from "~/app/lib/types";
import { NotePreviewDialog } from "./note-preview-dialog";

export function NoteItem({ note }: { note: Note }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-md"
        onClick={() => {
          const currentParams = new URLSearchParams(searchParams);
          // FIXME: this cast kinda stinks
          currentParams.set("noteId", String(note.id));
          void router.replace(`?${currentParams.toString()}`);
        }}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">
            {note.content}
          </div>
        </CardContent>
      </Card>
      <NotePreviewDialog note={note} />
    </>
  );
}
