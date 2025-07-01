/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Skeleton } from "@ragnotes/ui/skeleton";

import { AIChatButton } from "~/app/_components/notes/ai-chat-button";
import { CreateNoteButton } from "~/app/_components/notes/create-note-button";
import { auth } from "~/auth/server";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const notes: [] | undefined = [];

  return (
    <div className="container mx-auto xl:max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <div className="flex gap-2">
          <AIChatButton />
          <CreateNoteButton />
        </div>
      </div>

      {notes === undefined ? (
        <LoadingSkeleton />
      ) : notes.length === 0 ? (
        <EmptyView />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {/* TODO: Render user's notes here */}
        </div>
      )}
    </div>
  );
};

export default Page;

function EmptyView() {
  return (
    <div className="py-10 text-center">
      <p className="text-muted-foreground">
        No notes yet. Create your first note!
      </p>
    </div>
  );
}
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}
