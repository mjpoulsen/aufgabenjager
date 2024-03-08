import { serial, text, pgTable, date, boolean } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  due_date: date("due_date"),
  completed: boolean("completed").notNull().default(false),
});

export type Task = typeof tasks.$inferSelect; // return type when queried
export type NewTask = typeof tasks.$inferInsert; // input type when inserting
