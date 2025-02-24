import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  height: integer("height"),
  weight: integer("weight"),
});

export const workoutPrograms = pgTable("workout_programs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull(),
  exercises: json("exercises").$type<Exercise[]>().notNull(),
  imageUrl: text("image_url").notNull(),
});

export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  restTime: string;
};

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWorkoutProgramSchema = createInsertSchema(workoutPrograms);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type WorkoutProgram = typeof workoutPrograms.$inferSelect;
