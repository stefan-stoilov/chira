import { relations } from "drizzle-orm";
import {
  pgTable,
  primaryKey,
  uuid,
  varchar,
  text,
  timestamp,
  bigint,
  pgEnum,
  char,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  githubId: bigint("github_id", { mode: "number" }).unique(),
  email: varchar("email", { length: 255 }).unique(),
  password: text("password"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  workspaceMembers: many(workspacesMembers),
  workspacesRequests: many(workspacesRequests),
  refreshTokens: many(refreshTokens),
}));

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  hashedToken: text("hashed_token").notNull(),
  expiresAt: timestamp("expires", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  inviteCode: char("invite_code", { length: 6 }),
});

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  workspaceRequests: many(workspacesRequests),
}));

export enum WorkspaceRoles {
  user = "user",
  admin = "admin",
  owner = "owner",
}

export const workspaceRolesEnum = pgEnum("role", [
  WorkspaceRoles.user,
  WorkspaceRoles.admin,
  WorkspaceRoles.owner,
]);

export const workspacesMembers = pgTable(
  "workspaces_members",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    role: workspaceRolesEnum("role").notNull().default(WorkspaceRoles.user),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },

  (table) => [
    primaryKey({
      name: "workspaces_members_pk",
      columns: [table.userId, table.workspaceId],
    }),
  ],
);

export const workspacesMembersRelations = relations(
  workspacesMembers,
  ({ one }) => ({
    user: one(users, {
      fields: [workspacesMembers.userId],
      references: [users.id],
    }),
    workspace: one(workspaces, {
      fields: [workspacesMembers.workspaceId],
      references: [workspaces.id],
    }),
  }),
);

export const workspacesRequests = pgTable(
  "workspaces_requests",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },

  (table) => [
    primaryKey({
      name: "workspaces_requests_pk",
      columns: [table.userId, table.workspaceId],
    }),
  ],
);

export const workspacesRequestsRelations = relations(
  workspacesRequests,
  ({ one }) => ({
    user: one(users, {
      fields: [workspacesRequests.userId],
      references: [users.id],
    }),
    workspace: one(workspaces, {
      fields: [workspacesRequests.workspaceId],
      references: [workspaces.id],
    }),
  }),
);
