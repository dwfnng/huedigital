import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { log } from "./vite";

// Create SQLite database connection
const sqlite = new Database("sqlite.db", { verbose: log });

// Create a DrizzleClient instance
export const db = drizzle(sqlite);

// Export the sqlite instance for use with session store
export const sqliteDb = sqlite;

// Helper function to test database connection
export async function testDatabaseConnection() {
  try {
    // Simple test query
    sqlite.prepare("SELECT 1").get();
    log("Successfully connected to SQLite database");
    return true;
  } catch (err) {
    console.error("Error connecting to SQLite database:", err);
    return false;
  }
}