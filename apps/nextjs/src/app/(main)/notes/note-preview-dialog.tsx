"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@ragnotes/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ragnotes/ui/dialog";

export function NotePreviewDialog() {
  return (
    <Dialog>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Note Title</DialogTitle>
        </DialogHeader>
        <div className="mt-4 whitespace-pre-wrap">Note Body</div>
        <DialogFooter className="mt-6">
          <Button variant="destructive" className="gap-2">
            <Trash2 size={16} />
            Delete Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
