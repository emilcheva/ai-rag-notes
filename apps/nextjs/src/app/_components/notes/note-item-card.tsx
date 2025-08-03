"use client";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@ragnotes/ui/card";

import type { Note } from "~/app/lib/types";
import { NoteContentPreview } from "./note-content-preview";

export function NoteItemCard({ note }: { note: Note }) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => {
        router.push(`/${note.id}`);
      }}
    >
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="line-clamp-3 text-sm text-muted-foreground">
          <NoteContentPreview content={note.content} />
        </div>
      </CardContent>
    </Card>
  );
}
