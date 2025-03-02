import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Add error handling and connection pooling
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  max: 20,
  idleTimeoutMillis: 30000,
  keepAlive: true
});

// Add connection error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const db = drizzle({ client: pool, schema });

// Test the connection
pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database', err);
    process.exit(-1);
  }
  client.query('SELECT NOW()', (err, result) => {
    done();
    if (err) {
      console.error('Error executing test query', err);
      process.exit(-1);
    }
    console.log('Database connection test successful at:', result.rows[0].now);
  });
});