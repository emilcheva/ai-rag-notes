"use client";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@ragnotes/ui/card";

import type { Note } from "~/app/lib/types";

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
        <div className="line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">
          {note.content}
        </div>
      </CardContent>
    </Card>
  );
}
