import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { and, count, desc, eq } from "@ragnotes/db";
import { CreateNoteSchema, Note } from "@ragnotes/db/schema";

import { generateEmbedding } from "../lib/embeddings";
import { protectedProcedure } from "../trpc";

const DEFAULT_PAGE_SIZE = 9;
const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 9;

export const noteRouter = {
  all: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [total] = await ctx.db
        .select({
          count: count(),
        })
        .from(Note)
        .where(eq(Note.ownerId, ctx.session.user.id));

      const notes = await ctx.db
        .select({
          id: Note.id,
          title: Note.title,
          content: Note.content,
        })
        .from(Note)
        .where(eq(Note.ownerId, ctx.session.user.id))
        .orderBy(desc(Note.createdAt))
        .limit(input.pageSize)
        .offset((input.page - 1) * input.pageSize);

      return {
        notes,
        totalPages: Math.ceil((total?.count ?? 0) / input.pageSize),
      };
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [note] = await ctx.db
        .select({
          id: Note.id,
          title: Note.title,
          content: Note.content,
          createdAt: Note.createdAt,
        })
        .from(Note)
        .where(
          and(eq(Note.id, input.id), eq(Note.ownerId, ctx.session.user.id)),
        );
      if (!note) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Note not found`,
        });
      }
      return note;
    }),

  create: protectedProcedure
    .input(CreateNoteSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Generate embedding for the note
        const noteText = `${input.title}\n\n${input.content}`;
        const embedding = await generateEmbedding(noteText);

        // Create the note with embedding
        const result = await ctx.db.insert(Note).values({
          ...input,
          ownerId: ctx.session.user.id,
          embedding: embedding,
        });

        return result;
      } catch (error) {
        console.error("Error creating note with embedding:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create note",
        });
      }
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(Note)
      .where(and(eq(Note.id, input), eq(Note.ownerId, ctx.session.user.id)));
  }),
} satisfies TRPCRouterRecord;
