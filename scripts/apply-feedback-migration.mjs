import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const envPath = path.join(process.cwd(), ".env");
const envText = fs.readFileSync(envPath, "utf8");
const env = Object.fromEntries(
  envText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1)];
    })
);

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env");
}

const sql = neon(env.DATABASE_URL);
const migrationPath = path.join(
  process.cwd(),
  "db/migrations/2026-06-03-add-clutch-feedback-segregation.sql"
);
const migrationSql = fs.readFileSync(migrationPath, "utf8");

const statements = migrationSql
  .split(/;\s*\n/g)
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(`${statement};`);
}

console.log("Applied feedback segregation migration.");
