import { Suspense } from "react";

import { Skeleton } from "@ragnotes/ui/skeleton";

import { AIChatButton } from "~/app/_components/notes/ai-chat-button";
import { CreateNoteButton } from "~/app/_components/notes/create-note-button";
import { NotesList } from "~/app/_components/notes/notes-list";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

const Page = () => {
  // FIXME: use ErrorBoundary for TRPCError({ code: "UNAUTHORIZED" }) that will be thrown if the user is not logged in
  prefetch(trpc.note.all.queryOptions());

  return (
    <HydrateClient>
      <div className="container mx-auto xl:max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Notes</h1>
          <div className="flex gap-2">
            <AIChatButton />
            <CreateNoteButton />
          </div>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <NotesList />
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export default Page;

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
