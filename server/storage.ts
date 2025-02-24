import { users, workoutPrograms, type User, type InsertUser, type WorkoutProgram } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(userId: number, height: number, weight: number): Promise<User>;
  getAllPrograms(): Promise<WorkoutProgram[]>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserStats(userId: number, height: number, weight: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ height, weight })
      .where(eq(users.id, userId))
      .returning();

    if (!user) throw new Error("User not found");
    return user;
  }

  async getAllPrograms(): Promise<WorkoutProgram[]> {
    return await db.select().from(workoutPrograms);
  }
}

export const storage = new DatabaseStorage();