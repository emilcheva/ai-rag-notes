import { authRouter } from "./router/auth";
import { embeddingsRouter } from "./router/embeddings";
import { noteRouter } from "./router/note";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  note: noteRouter,
  embeddings: embeddingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
