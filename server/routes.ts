import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { log } from "./vite";
import forumRouter from "./routes/forum";
import contributionsRouter from "./routes/contributions";
import liveDataRouter from "./routes/live-data";
import adminRouter from "./routes/admin";

export async function registerRoutes(app: Express) {
  log("Starting route registration...");

  try {
    // Register modular routers
    app.use(forumRouter);
    app.use(contributionsRouter);
    app.use(liveDataRouter);
    app.use(adminRouter);
    log("Successfully registered modular routers");

    // Main location routes
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

    app.get("/api/locations/search/:query", async (req, res) => {
      try {
        const locations = await storage.searchLocations(req.params.query);
        res.json(locations);
      } catch (error) {
        console.error("Error searching locations:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.post("/api/locations", async (req, res) => {
      try {
        const parseResult = insertLocationSchema.safeParse(req.body);
        if (!parseResult.success) {
          res.status(400).json({ message: "Invalid location data" });
          return;
        }
        const location = await storage.createLocation(parseResult.data);
        res.status(201).json(location);
      } catch (error) {
        console.error("Error creating location:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Resource routes
    app.get("/api/resources", async (_req, res) => {
      try {
        const resources = await storage.getAllResources();
        res.json(resources);
      } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/api/resources/:id", async (req, res) => {
      try {
        const resource = await storage.getResourceById(Number(req.params.id));
        if (!resource) {
          res.status(404).json({ message: "Resource not found" });
          return;
        }
        res.json(resource);
      } catch (error) {
        console.error("Error fetching resource by ID:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/api/resources/type/:type", async (req, res) => {
      try {
        const resources = await storage.getResourcesByType(req.params.type);
        res.json(resources);
      } catch (error) {
        console.error("Error fetching resources by type:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/api/resources/category/:category", async (req, res) => {
      try {
        const resources = await storage.getResourcesByCategory(req.params.category);
        res.json(resources);
      } catch (error) {
        console.error("Error fetching resources by category:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/api/resources/search/:query", async (req, res) => {
      try {
        const resources = await storage.searchResources(req.params.query);
        res.json(resources);
      } catch (error) {
        console.error("Error searching resources:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.post("/api/resources", async (req, res) => {
      try {
        const parseResult = insertResourceSchema.safeParse(req.body);
        if (!parseResult.success) {
          res.status(400).json({ message: "Invalid resource data" });
          return;
        }
        const resource = await storage.createResource(parseResult.data);
        res.status(201).json(resource);
      } catch (error) {
        console.error("Error creating resource:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Category routes
    app.get("/api/categories", async (_req, res) => {
      try {
        const categories = await storage.getAllCategories();
        res.json(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/api/categories/:id", async (req, res) => {
      try {
        const category = await storage.getCategoryById(Number(req.params.id));
        if (!category) {
          res.status(404).json({ message: "Category not found" });
          return;
        }
        res.json(category);
      } catch (error) {
        console.error("Error fetching category by ID:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.post("/api/categories", async (req, res) => {
      try {
        const parseResult = insertCategorySchema.safeParse(req.body);
        if (!parseResult.success) {
          res.status(400).json({ message: "Invalid category data" });
          return;
        }
        const category = await storage.createCategory(parseResult.data);
        res.status(201).json(category);
      } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Chat routes
    app.post("/api/chat", async (req, res) => {
      try {
        const { message } = req.body;
        if (!message) {
          res.status(400).json({ message: "Message is required" });
          return;
        }

        const response = await getChatResponse([{ role: "user", content: message }]);

        res.json({ response });
      } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ message: "Failed to get chat response" });
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