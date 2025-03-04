import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { 
  insertLocationSchema, insertResourceSchema, insertCategorySchema,
  insertTicketSchema
} from "@shared/schema";
import { getChatResponse } from "./services/openai";
import forumRouter from "./routes/forum";
import contributionsRouter from "./routes/contributions";
import liveDataRouter from "./routes/live-data";

export async function registerRoutes(app: Express) {
  // Đăng ký các router mới
  app.use(forumRouter);
  app.use(contributionsRouter);
  app.use(liveDataRouter);

  app.get("/api/locations", async (_req, res) => {
    const locations = await storage.getAllLocations();
    res.json(locations);
  });

  app.get("/api/locations/:id", async (req, res) => {
    const location = await storage.getLocationById(Number(req.params.id));
    if (!location) {
      res.status(404).json({ message: "Location not found" });
      return;
    }
    res.json(location);
  });

  app.get("/api/locations/search/:query", async (req, res) => {
    const locations = await storage.searchLocations(req.params.query);
    res.json(locations);
  });

  app.post("/api/locations", async (req, res) => {
    const parseResult = insertLocationSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: "Invalid location data" });
      return;
    }
    const location = await storage.createLocation(parseResult.data);
    res.status(201).json(location);
  });

  // Resource routes
  app.get("/api/resources", async (_req, res) => {
    const resources = await storage.getAllResources();
    res.json(resources);
  });

  app.get("/api/resources/:id", async (req, res) => {
    const resource = await storage.getResourceById(Number(req.params.id));
    if (!resource) {
      res.status(404).json({ message: "Resource not found" });
      return;
    }
    res.json(resource);
  });

  app.get("/api/resources/type/:type", async (req, res) => {
    const resources = await storage.getResourcesByType(req.params.type);
    res.json(resources);
  });

  app.get("/api/resources/category/:category", async (req, res) => {
    const resources = await storage.getResourcesByCategory(req.params.category);
    res.json(resources);
  });

  app.get("/api/resources/search/:query", async (req, res) => {
    const resources = await storage.searchResources(req.params.query);
    res.json(resources);
  });

  app.post("/api/resources", async (req, res) => {
    const parseResult = insertResourceSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: "Invalid resource data" });
      return;
    }
    const resource = await storage.createResource(parseResult.data);
    res.status(201).json(resource);
  });

  // Category routes
  app.get("/api/categories", async (_req, res) => {
    const categories = await storage.getAllCategories();
    res.json(categories);
  });

  app.get("/api/categories/:id", async (req, res) => {
    const category = await storage.getCategoryById(Number(req.params.id));
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json(category);
  });

  app.post("/api/categories", async (req, res) => {
    const parseResult = insertCategorySchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: "Invalid category data" });
      return;
    }
    const category = await storage.createCategory(parseResult.data);
    res.status(201).json(category);
  });

  // Chat routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        res.status(400).json({ message: "Message is required" });
        return;
      }

      const response = await getChatResponse([
        { role: "user", content: message }
      ]);

      res.json({ response });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to get chat response" });
    }
  });

  // Ticket routes
  app.post("/api/tickets", async (req, res) => {
    const parseResult = insertTicketSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: "Invalid ticket data" });
      return;
    }
    const ticket = await storage.createTicket(parseResult.data);
    res.status(201).json(ticket);
  });

  app.get("/api/tickets/user/:userId", async (req, res) => {
    const tickets = await storage.getTicketsByUserId(Number(req.params.userId));
    res.json(tickets);
  });

  app.get("/api/tickets/location/:locationId", async (req, res) => {
    const tickets = await storage.getTicketsByLocationId(Number(req.params.locationId));
    res.json(tickets);
  });

  app.patch("/api/tickets/:id/status", async (req, res) => {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ message: "Status is required" });
      return;
    }
    try {
      const ticket = await storage.updateTicketStatus(Number(req.params.id), status);
      res.json(ticket);
    } catch (error) {
      res.status(404).json({ message: "Ticket not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}