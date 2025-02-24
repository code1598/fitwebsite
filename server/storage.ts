import { User, InsertUser, WorkoutProgram } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(userId: number, height: number, weight: number): Promise<User>;
  getAllPrograms(): Promise<WorkoutProgram[]>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workoutPrograms: WorkoutProgram[];
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({ checkPeriod: 86400000 });
    this.workoutPrograms = [
      {
        id: 1,
        name: "Beginner Full Body",
        description: "Perfect for those just starting their fitness journey",
        level: "beginner",
        exercises: [
          { name: "Bodyweight Squats", sets: 3, reps: "12-15", restTime: "60s" },
          { name: "Push-ups", sets: 3, reps: "8-12", restTime: "60s" },
          { name: "Walking Lunges", sets: 3, reps: "10 each leg", restTime: "60s" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a"
      },
      {
        id: 2,
        name: "Intermediate Strength",
        description: "Build strength and muscle with this comprehensive program",
        level: "intermediate",
        exercises: [
          { name: "Barbell Squats", sets: 4, reps: "8-10", restTime: "90s" },
          { name: "Bench Press", sets: 4, reps: "8-10", restTime: "90s" },
          { name: "Bent Over Rows", sets: 4, reps: "8-10", restTime: "90s" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5"
      },
      {
        id: 3,
        name: "Advanced HIIT",
        description: "High-intensity interval training for maximum results",
        level: "advanced",
        exercises: [
          { name: "Burpees", sets: 4, reps: "20", restTime: "30s" },
          { name: "Mountain Climbers", sets: 4, reps: "30s", restTime: "30s" },
          { name: "Box Jumps", sets: 4, reps: "15", restTime: "30s" }
        ],
        imageUrl: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4"
      }
    ];
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, height: null, weight: null };
    this.users.set(id, user);
    return user;
  }

  async updateUserStats(userId: number, height: number, weight: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, height, weight };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getAllPrograms(): Promise<WorkoutProgram[]> {
    return this.workoutPrograms;
  }
}

export const storage = new MemStorage();
