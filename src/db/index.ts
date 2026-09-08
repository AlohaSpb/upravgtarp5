import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured. Connect Neon Postgres in Vercel first.");
  }

  return drizzle(neon(databaseUrl), { schema });
}

let database: ReturnType<typeof createDb> | undefined;

// Lazy creation keeps `next build` working before the Vercel integration adds DATABASE_URL.
export function getDb() {
  database ??= createDb();
  return database;
}
