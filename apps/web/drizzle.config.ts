import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: [
    "./db/users.schema.ts",
    "./db/booking.schema.ts",
    "./db/cdn.schema.ts",
    "./db/event.schema.ts",
    "./db/creator.schema.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
