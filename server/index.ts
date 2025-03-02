import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add detailed startup logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    log("Starting server initialization...");
    log(`Environment: ${process.env.NODE_ENV}, FAST_START: ${process.env.FAST_START}`);

    // Kill any existing process on port 5000
    try {
      const { execSync } = require('child_process');
      execSync('fuser -k 5000/tcp');
      log("Cleared port 5000");
    } catch (e) {
      // Ignore errors if no process was using the port
    }

    log("Registering routes...");
    const server = await registerRoutes(app);
    log("Routes registered successfully");

    // Error handling middleware
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      const status = 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error("Server error:", err);
    });

    // Setup Vite or static serving based on environment and FAST_START flag
    const fastStart = process.env.FAST_START === "true";
    if (app.get("env") === "development" && !fastStart) {
      log("Setting up Vite development server...");
      await setupVite(app, server);
      log("Vite setup complete");
    } else {
      log("Setting up static file serving...");
      serveStatic(app);
      log("Static serving setup complete");
    }

    // Always listen on port 5000
    const port = process.env.PORT || 5000;
    log(`Attempting to start server on port ${port}...`);

    // Add a timeout for server startup
    const startupTimeout = setTimeout(() => {
      log("Server startup timed out after 10 seconds");
      process.exit(1);
    }, 10000);

    server.listen({
      port,
      host: "0.0.0.0",
    }, () => {
      clearTimeout(startupTimeout);
      log(`Server started successfully on port ${port}`);
    }).on('error', (err: NodeJS.ErrnoException) => {
      clearTimeout(startupTimeout);
      if (err.code === 'EADDRINUSE') {
        log(`Port ${port} is already in use. Please free up the port and try again.`);
        process.exit(1);
      } else {
        log(`Failed to start server: ${err.message}`);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error("Fatal error during server startup:", error);
    process.exit(1);
  }
})();