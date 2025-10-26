import type { TRPCRouterRecord } from "@trpc/server";
import { and, cosineDistance, desc, eq, gt, isNotNull, sql } from "drizzle-orm";
import { z } from "zod/v4";

import { db } from "@ragnotes/db/client";
import { Note } from "@ragnotes/db/schema";

import { generateEmbedding } from "../lib/embeddings";
import { protectedProcedure } from "../trpc";

export const embeddingsRouter = {
  findRelevantContent: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        // Generate embedding for the user query
        const userQueryEmbedded = await generateEmbedding(input.query);

        // Calculate cosine similarity between query and note embeddings
        const similarity = sql<number>`1 - (${cosineDistance(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          Note.embedding,
          userQueryEmbedded,
        )})`;

        // Find similar notes
        const similarNotesRaw = await db
          .select({
            id: Note.id,
            title: Note.title,
            content: Note.content,
            similarity,
          })
          .from(Note)
          .where(
            and(
              eq(Note.ownerId, userId),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              isNotNull(Note.embedding),
              gt(similarity, 0.5),
            ),
          )
          .orderBy((t) => desc(t.similarity))
          .limit(5);

        return similarNotesRaw.map((note) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          similarity: Number(note.similarity),
        }));
      } catch (error) {
        console.error("Error in findRelevantContent:", error);
        throw error; // Re-throw to let tRPC handle the error formatting
      }
    }),
} satisfies TRPCRouterRecord;
