import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { desc, eq } from "@ragnotes/db";
import { CreateNoteSchema, Note } from "@ragnotes/db/schema";

import { protectedProcedure } from "../trpc";

export const noteRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.Note.findMany({
      orderBy: desc(Note.id),
    });
  }),

  create: protectedProcedure
    .input(CreateNoteSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Note).values(input);
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Note).where(eq(Note.id, input));
  }),
} satisfies TRPCRouterRecord;
