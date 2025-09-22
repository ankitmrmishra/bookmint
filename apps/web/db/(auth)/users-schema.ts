// import { integer } from "drizzle-orm/gel-core";
import { pgTable, varchar, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  wallet: varchar({ length: 64 }).notNull().unique(),
  name: varchar({ length: 255 }),
  username: varchar({ length: 20 }).notNull().unique(),
});
