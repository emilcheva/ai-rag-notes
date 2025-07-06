"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@ragnotes/ui/card";

import type { Note } from "~/app/lib/types";

export function NoteItem({ note }: { note: Note }) {
  return (
    <>
      <Card className="cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">
            {note.content}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
