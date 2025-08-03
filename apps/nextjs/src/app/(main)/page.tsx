import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createLoader, parseAsInteger } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";

import { AIChatButton } from "~/app/_components/notes/ai-chat-button";
import { CreateNoteButton } from "~/app/_components/notes/create-note-button";
import { NotesList } from "~/app/_components/notes/notes-list";
import { auth } from "~/auth/server";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { ErrorState } from "../_components/ui-states/error-state";
import { LoadingState } from "../_components/ui-states/loading-state";

interface Props {
  searchParams: Promise<SearchParams>;
}

const searchParamsCache = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(9),
};

const loadSearchParams = createLoader(searchParamsCache);

const Page = async ({ searchParams }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const { page, pageSize } = await loadSearchParams(searchParams);

  prefetch(trpc.note.all.queryOptions({ page, pageSize }));

  return (
    <HydrateClient>
      <div className="lg:max-w-8xl container mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Notes</h1>
          <div className="flex gap-2">
            <AIChatButton />
            <CreateNoteButton />
          </div>
        </div>

        <Suspense
          fallback={
            <LoadingState title="Loading Notes" description="Please wait..." />
          }
        >
          <ErrorBoundary
            fallback={
              <ErrorState
                title="Error"
                description="Something went wrong loading notes"
              />
            }
          >
            <NotesList />
          </ErrorBoundary>
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export default Page;
