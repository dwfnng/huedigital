import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Create PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create drizzle database instance
export const db = drizzle(pool);