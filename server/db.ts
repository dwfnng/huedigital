import { drizzle } from "drizzle-orm/node-postgres";
import pkg from 'pg';
const { Pool } = pkg;

// Create a PostgreSQL connection pool with optimized settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
});

// Add error handling for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Create a DrizzleClient instance
export const db = drizzle(pool);

// Export the pool for use with session store
export const pgPool = pool;

// Helper function to test database connection
export async function testDatabaseConnection() {
  let client;
  try {
    client = await pool.connect();
    console.log('Successfully connected to database');
    return true;
  } catch (err) {
    console.error('Error connecting to the database:', err);
    return false;
  } finally {
    if (client) client.release();
  }
}