import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/attached_assets", express.static("attached_assets"));

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

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function clearPort(port: number) {
  try {
    await execAsync(`fuser -k ${port}/tcp`);
    log(`Cleared port ${port}`);
  } catch (e) {
    // Ignore errors if no process was using the port
  }
}

async function startServer(retryCount = 0) {
  try {
    log("Starting server initialization...");
    log(`Environment: ${process.env.NODE_ENV}, FAST_START: ${process.env.FAST_START}`);

    // Kill any existing process on port 5000
    await clearPort(5000);

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

    // Try to start on preferred port first
    const preferredPort = parseInt(process.env.PORT || "5000", 10);
    const portRange = [preferredPort, 5001, 5002, 5003]; // Fallback ports
    let port = preferredPort;
    let started = false;

    for (const tryPort of portRange) {
      try {
        log(`Attempting to start server on port ${tryPort}...`);

        await new Promise((resolve, reject) => {
          const startupTimeout = setTimeout(() => {
            reject(new Error("Server startup timed out after 10 seconds"));
          }, 10000);

          server.listen({
            port: tryPort,
            host: "0.0.0.0",
          }, () => {
            clearTimeout(startupTimeout);
            port = tryPort;
            started = true;
            log(`Server started successfully on port ${port}`);
            resolve(true);
          }).on('error', (err: NodeJS.ErrnoException) => {
            clearTimeout(startupTimeout);
            if (err.code === 'EADDRINUSE') {
              log(`Port ${tryPort} is already in use, trying next port...`);
              resolve(false);
            } else {
              reject(err);
            }
          });
        });

        if (started) break;
      } catch (err) {
        log(`Failed to start on port ${tryPort}: ${err}`);
      }
    }

    if (!started) {
      throw new Error("Failed to start server on any available port");
    }

  } catch (error) {
    console.error("Fatal error during server startup:", error);
    if (retryCount < MAX_RETRIES) {
      log(`Retrying server startup in ${RETRY_DELAY}ms (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
      setTimeout(() => startServer(retryCount + 1), RETRY_DELAY);
    } else {
      log("Maximum retry attempts reached. Server startup failed.");
      process.exit(1);
    }
  }
}

startServer();