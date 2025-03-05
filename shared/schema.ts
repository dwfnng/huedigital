import { pgTable, text, serial, timestamp, jsonb, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enhanced Resources schema for cultural content
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  description: text("description"),
  descriptionEn: text("description_en"),
  type: text("type").notNull(),
  category: text("category").notNull(),
  contentUrl: text("content_url"),
  thumbnailUrl: text("thumbnail_url"),
  imageUrls: text("image_urls").array(),
  textContent: text("text_content"),
  format: text("format"),
  author: text("author"),
  source: text("source"),
  tags: text("tags").array(),

  // Cultural context
  culturalPeriod: text("cultural_period"),
  historicalPeriod: text("historical_period"),
  geographicalContext: text("geographical_context"),
  culturalSignificance: text("cultural_significance"),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUpdated: timestamp("last_updated"),
  status: text("status").default("published"),
  viewCount: numeric("view_count").default("0"),

  // For community contributions
  contributorId: serial("contributor_id"),
  reviewStatus: text("review_status").default("pending"),
  reviewedBy: serial("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  comments: jsonb("comments").default([]),
});

// Insert schemas
export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
  viewCount: true,
  comments: true,
});

// Types
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

// Enums for resource types and categories
export enum ResourceType {
  DOCUMENT = "document",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  INTERACTIVE = "interactive",
  MODEL_3D = "3d_model",
  ARTICLE = "article",
  RESEARCH_PAPER = "research_paper",
  HISTORICAL_RECORD = "historical_record",
  CULTURAL_ARTIFACT = "cultural_artifact"
}

export enum ResourceCategory {
  HERITAGE_SITES = "heritage_sites",
  TRADITIONAL_CRAFTS = "traditional_crafts", 
  PERFORMING_ARTS = "performing_arts",
  CULINARY_HERITAGE = "culinary_heritage",
  FESTIVALS_RITUALS = "festivals_and_rituals",
  HISTORICAL_DOCUMENTS = "historical_documents",
  ORAL_TRADITIONS = "oral_traditions",
  ARCHITECTURE = "architecture",
  ROYAL_ARTIFACTS = "royal_artifacts",
  CULTURAL_PRACTICES = "cultural_practices"
}

export enum ResourceStatus {
  DRAFT = "draft",
  PENDING_REVIEW = "pending_review",
  PUBLISHED = "published", 
  ARCHIVED = "archived"
}

// Schema for user contributions and discussions
export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: serial("user_id").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUpdated: timestamp("last_updated"),
  status: text("status").default("published"),
  views: numeric("views").default("0"),
  likes: numeric("likes").default("0"),
  resourceId: serial("resource_id"), 
});

// Schema for comments
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: serial("user_id").notNull(),
  discussionId: serial("discussion_id"),
  resourceId: serial("resource_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  status: text("status").default("published"),
});

// Insert schemas
export const insertDiscussionSchema = createInsertSchema(discussions).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
  views: true,
  likes: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Discussion = typeof discussions.$inferSelect;
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;


// Add contribution schema after the resources schema
export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  url: text("url"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: serial("reviewed_by"),
  locationId: serial("location_id"),
});

// Add contribution schema after other insert schemas
export const insertContributionSchema = createInsertSchema(contributions).omit({
  id: true,
  createdAt: true,
  reviewedAt: true,
  reviewedBy: true,
});

// Add contribution types after other types
export type Contribution = typeof contributions.$inferSelect;
export type InsertContribution = z.infer<typeof insertContributionSchema>;

// Categories schema with enhanced cultural focus
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  description: text("description"),
  descriptionEn: text("description_en"),
  parentId: serial("parent_id"),
  iconUrl: text("icon_url"),
});

// Rest of the tables
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(), 
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  type: text("type").notNull(),
  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull(), 
  password: text("password").notNull(),
  role: text("role").notNull(),
  points: numeric("points").default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pointTransactions = pgTable("point_transactions", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull(),
  points: numeric("points").notNull(),
  type: text("type").notNull(),
  referenceId: serial("reference_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favoriteRoutes = pgTable("favorite_routes", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull(),
  name: text("name").notNull(),
  startLocationId: serial("start_location_id").notNull(),
  endLocationId: serial("end_location_id").notNull(),
  description: text("description"),
  routeData: jsonb("route_data").notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertLocationSchema = createInsertSchema(locations).omit({ 
  id: true,
  isActive: true 
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  points: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertFavoriteRouteSchema = createInsertSchema(favoriteRoutes).omit({
  id: true,
  createdAt: true,
  isActive: true
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Type definitions for favorite routes
export type FavoriteRoute = typeof favoriteRoutes.$inferSelect;
export type InsertFavoriteRoute = z.infer<typeof insertFavoriteRouteSchema>;

// Types
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Enums
export type LocationType = 
  | "historical_site" 
  | "monument"
  | "palace"
  | "temple"
  | "communal_house"
  | "tomb"
  | "ritual"
  | "library"
  | "education"
  | "government"
  | "military"
  | "museum"
  | "landscape";

export type UserRole =
  | "student"
  | "teacher"
  | "researcher"
  | "visitor";

export type DiscussionCategory =
  | "heritage"
  | "research"
  | "experience"
  | "preservation";

export type PointTransactionType =
  | "contribution"
  | "discussion"
  | "review";

export type ChatRole = "user" | "assistant";