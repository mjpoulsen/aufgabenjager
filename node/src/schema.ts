import { serial, text, pgTable, date, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  due_date: date("due_date"),
  completed: boolean("completed").notNull().default(false),
  list_id: text("list_id"),
});

export const lists = pgTable("lists", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  board_id: text("board_id"),
});

export const boards = pgTable("boards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
});

export const listsToTasksRelations = relations(lists, ({ many }) => ({
  tasks: many(tasks),
}));

export const boardsToListsRelations = relations(boards, ({ many }) => ({
  lists: many(lists),
}));

export const tasksToListsRelations = relations(tasks, ({ one }) => ({
  list: one(lists, {
    fields: [tasks.list_id],
    references: [lists.id],
  }),
}));

export const listsToBoardsRelations = relations(lists, ({ one }) => ({
  board: one(boards, {
    fields: [lists.board_id],
    references: [boards.id],
  }),
}));

export type Task = typeof tasks.$inferSelect; // return type when queried
export type NewTask = typeof tasks.$inferInsert; // input type when inserting
export type List = typeof lists.$inferSelect; // return type when queried
export type NewList = typeof lists.$inferInsert; // input type when inserting
export type Board = typeof boards.$inferSelect; // return type when queried
export type NewBoard = typeof boards.$inferInsert; // input type when inserting
