// // This is your drizzle schema file.

// import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   name: text("name").default("not_provided"),
//   email: text("email").notNull(),
// });

// export const schema = {
//   users,
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").default("not_provided"),
  email: text("email").notNull(),
});

export const jobStands = sqliteTable("job_stands", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  standNumber: integer("stand_number").notNull(),
  companyName: text("company_name").notNull(),
  positionType: text("position_type").notNull(), // 'junior' or 'senior'
  viable: text("viable").notNull(), // 'yes' or 'no'
});

export const ratings = sqliteTable("ratings", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  jobStandId: integer("job_stand_id").references(() => jobStands.id),
  score: integer("score").default(0).notNull(),
});

export const schema = {
  users,
  jobStands,
  ratings,
};
