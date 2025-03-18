import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

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
      log(logLine);
    }
  });

  next();
});

async function checkPort(port: number): Promise<boolean> {
  try {
    const { execSync } = require('child_process');
    const result = execSync(`lsof -i :${port} || echo "Port is free"`).toString();
    log(`Port ${port} check result: ${result}`);
    return result.includes("Port is free");
  } catch (error) {
    log(`Error checking port ${port}: ${error}`);
    return false;
  }
}

async function clearPort(port: number) {
  try {
    const { execSync } = require('child_process');
    log(`Attempting to clear port ${port}...`);
    execSync(`fuser -k ${port}/tcp || true`);
    log(`Successfully cleared port ${port}`);
  } catch (error) {
    log(`Error clearing port ${port}: ${error}`);
  }
}

async function startServer() {
  try {
    log("Starting server initialization...");
    log(`Environment: ${process.env.NODE_ENV}, FAST_START: ${process.env.FAST_START}`);

    // Check and clear port 5000 if needed
    const port = 5000;
    const isPortFree = await checkPort(port);
    if (!isPortFree) {
      log(`Port ${port} is in use, attempting to clear...`);
      await clearPort(port);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for port to clear
    }

    log("Registering routes...");
    try {
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

      log(`Attempting to start server on port ${port}...`);

      await new Promise((resolve, reject) => {
        const startupTimeout = setTimeout(() => {
          reject(new Error("Server startup timed out after 10 seconds"));
        }, 10000);

        server.listen({
          port: port,
          host: "0.0.0.0",
        }, () => {
          clearTimeout(startupTimeout);
          log(`Server started successfully on port ${port}`);
          resolve(true);
        }).on('error', (err: NodeJS.ErrnoException) => {
          clearTimeout(startupTimeout);
          log(`Server startup error: ${err.message}\n${err.stack}`);
          reject(err);
        });
      });

    } catch (routeError) {
      log(`Error during route registration: ${routeError}`);
      throw routeError;
    }

  } catch (error) {
    console.error("Fatal error during server startup:", error);
    process.exit(1);
  }
}

startServer();