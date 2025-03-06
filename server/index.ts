import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { testDatabaseConnection } from "./db";
import helmet from "helmet";
import path from "path";

const app = express();

// Basic middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure Helmet with relaxed CSP for development
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "ws:", "wss:"],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Test endpoint
app.get("/api/test", (_req, res) => {
  res.json({ message: "Server is working" });
});

// Simple logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
});

// Basic error handling
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

async function startServer() {
  try {
    log("Starting server initialization...");

    // Test database connection first
    log("Testing database connection...");
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }

    // Create HTTP server without route registration first
    const server = express().listen(5000, "0.0.0.0", () => {
      log("Basic server started on port 5000");
    });

    // Setup static file serving
    try {
      if (app.get("env") === "development" && process.env.FAST_START !== "true") {
        log("Setting up Vite development server...");
        await setupVite(app, server);
      } else {
        log("Setting up static file serving...");
        serveStatic(app);
      }
    } catch (error) {
      console.error("Error during static file setup:", error);
      // Continue server startup even if static serving fails
    }

    // Register routes after ensuring database connection
    log("Registering routes...");
    await registerRoutes(app);
    log("Routes registered successfully");

    // Always serve index.html for non-API routes to support client-side routing
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        next();
      } else {
        if (app.get("env") === "development") {
          // In development, Vite handles this
          next();
        } else {
          // In production, serve the built index.html
          res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        }
      }
    });

  } catch (error) {
    console.error("Fatal startup error:", error);
    process.exit(1);
  }
}

startServer();