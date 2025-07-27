import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { count, desc, eq } from "@ragnotes/db";
import { CreateNoteSchema, Note } from "@ragnotes/db/schema";

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

  create: protectedProcedure
    .input(CreateNoteSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Note).values({
        ...input,
        ownerId: ctx.session.user.id,
      });
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Note).where(eq(Note.id, input));
  }),
} satisfies TRPCRouterRecord;
