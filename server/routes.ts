
import express, { Express } from "express";
import { Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const server = require('http').createServer(app);

  // Define API routes
  app.get('/api/status', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Add more routes as needed
  
  return server;
}
