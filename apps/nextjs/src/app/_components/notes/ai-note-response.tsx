import Link from "next/link";
import { FileText } from "lucide-react";

export interface NoteData {
  id: string;
  title: string;
  content: string;
  similarity: number;
}

export interface NoteLinkProps {
  noteId: string;
}

export function NoteResponseLink({ noteId }: NoteLinkProps) {
  return (
    <Link
      key={`note-${noteId}`}
      href={`/${noteId}`}
      className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20"
    >
      <FileText size={12} />
      View Note {noteId.substring(0, 6)}
    </Link>
  );
}

interface NoteCardProps {
  note: NoteData;
}

export function NoteResponseCard({ note }: NoteCardProps) {
  return (
    <div
      key={note.id}
      className="rounded-md border border-border/50 bg-card p-3 shadow-sm"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <Link
          target="_blank"
          href={`/${note.id}`}
          className="inline-flex max-w-[180px] items-center gap-2 rounded bg-primary/10 px-2 py-1 text-sm font-medium text-primary hover:bg-primary/20"
        >
          <FileText className="size-4 flex-shrink-0" />
          <span className="truncate">{note.title || "Untitled Note"}</span>
        </Link>
        <span className="flex-shrink-0 text-xs text-muted-foreground">
          Relevance: {Math.round(note.similarity * 100)}%
        </span>
      </div>
    </div>
  );
}

interface NotesListProps {
  notes: NoteData[];
  message?: string;
}

export function NotesResponseList({ notes, message }: NotesListProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">
        {message ?? "Found relevant notes:"}
      </p>
      {notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <NoteResponseCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Be more specific or ask me something else
        </p>
      )}
    </div>
  );
}
