import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

dotenv.config({ path: "../.env" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.log("🚀 ~ process.env:", process.env);
  throw new Error("DATABASE_URL is not set");
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client);

// Helper type for database instance
export type Database = typeof db;