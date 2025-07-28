import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

import { NoteItem } from "~/app/_components/notes/note-item";
import { ErrorState } from "~/app/_components/ui-states/error-state";
import { LoadingState } from "~/app/_components/ui-states/loading-state";
import { auth } from "~/auth/server";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

interface Props {
  params: Promise<{
    noteId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { noteId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  // Try to prefetch the note, but don't crash if it doesn't exist
  // The TRPCError will be handled by the client-side useSuspenseQuery error boundary
  try {
    prefetch(trpc.note.byId.queryOptions({ id: noteId }));
  } catch (error) {
    console.warn(`Failed to prefetch note ${noteId}:`, error);
  }

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={
          <ErrorState
            title="Note not found"
            description="The note you're looking for doesn't exist or has been deleted."
          />
        }
      >
        <Suspense
          fallback={
            <LoadingState title="Loading Note" description="Please wait..." />
          }
        >
          <NoteItem noteId={noteId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
