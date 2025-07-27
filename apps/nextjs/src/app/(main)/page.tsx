import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createLoader, parseAsInteger } from "nuqs/server";

import { AIChatButton } from "~/app/_components/notes/ai-chat-button";
import { CreateNoteButton } from "~/app/_components/notes/create-note-button";
import { LoadingSkeleton, NotesList } from "~/app/_components/notes/notes-list";
import { auth } from "~/auth/server";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

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
