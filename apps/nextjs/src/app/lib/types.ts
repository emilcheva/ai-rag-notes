import type { InsertNote, SelectNote } from "@ragnotes/db/schema";

export type NoteType = SelectNote;
export type NoteInputType = InsertNote;

export type Note = Pick<NoteType, "id" | "title" | "content">;
