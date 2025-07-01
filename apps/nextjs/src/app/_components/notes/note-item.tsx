"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@ragnotes/ui/card";

export function NoteItem() {
  return (
    <>
      <Card className="cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>Note Title</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">
            Note Body
          </div>
        </CardContent>
      </Card>
    </>
  );
}
