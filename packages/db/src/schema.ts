import { sql } from "drizzle-orm";
import { pgTable, vector } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { user } from "./auth-schema";

export const Note = pgTable("note", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 256 }).notNull(),
  content: t.text().notNull(),
  ownerId: t
    .text()
    .notNull()
    .references(() => user.id),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  embedding: vector("embedding", { dimensions: 768 }).notNull(),
}));

export const CreateNoteSchema = createInsertSchema(Note, {
  title: z.string().max(256),
  content: z.string(),
}).omit({
  id: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
  embedding: true,
});

export type SelectNote = typeof Note.$inferSelect;
export type InsertNote = typeof Note.$inferInsert;

export * from "./auth-schema";
