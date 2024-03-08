import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "1234",
    database: "postgres",
  },
});
