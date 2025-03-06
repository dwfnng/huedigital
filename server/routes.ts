import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { log } from "./vite";
import { setupAuth } from "./auth";
import forumRouter from "./routes/forum";
import contributionsRouter from "./routes/contributions";
import liveDataRouter from "./routes/live-data";
import adminRouter from "./routes/admin";

export async function registerRoutes(app: Express) {
  log("Starting route registration...");

  try {
    // Setup authentication first
    setupAuth(app);
    log("Authentication setup complete");

    // Register modular routers
    app.use(forumRouter);
    app.use(contributionsRouter);
    app.use(liveDataRouter);
    app.use(adminRouter);
    log("Successfully registered modular routers");

    // Register essential API routes
    app.get("/api/locations", async (_req, res) => {
      try {
        const locations = await storage.getAllLocations();
        res.json(locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/api/locations/:id", async (req, res) => {
      try {
        const location = await storage.getLocationById(Number(req.params.id));
        if (!location) {
          res.status(404).json({ message: "Location not found" });
          return;
        }
        res.json(location);
      } catch (error) {
        console.error("Error fetching location by ID:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    log("Successfully registered all routes");

    const httpServer = createServer(app);
    return httpServer;
  } catch (error) {
    log("Error during route registration: " + error);
    throw error;
  }
}