import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/programs", async (_req, res) => {
    const programs = await storage.getAllPrograms();
    res.json(programs);
  });

  app.patch("/api/user/stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const { height, weight } = req.body;
    const updatedUser = await storage.updateUserStats(req.user!.id, height, weight);
    res.json(updatedUser);
  });

  const httpServer = createServer(app);
  return httpServer;
}
