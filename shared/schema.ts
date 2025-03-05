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
  textContent: text("text_content"), // Nội dung chính từ file Word
  format: text("format"), // docx, pdf, etc.
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
  resourceId: serial("resource_id"), // Liên kết với tài liệu gốc nếu có
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
export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
  viewCount: true,
  comments: true,
});

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
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Discussion = typeof discussions.$inferSelect;
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

// Enums
export type ResourceType =
  | "article"
  | "document"
  | "image_gallery"
  | "video"
  | "audio";

export type ResourceCategory =
  | "historical_site"
  | "architecture"
  | "traditional_craft"
  | "performing_art"
  | "festival_ritual"
  | "cultural_practice"
  | "culinary_heritage";

export type ResourceStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "archived";

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
  routeData: jsonb("route_data").notNull(), // Store route coordinates and waypoints
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

export type ResourceType = 
  | "document"
  | "image"
  | "video"
  | "audio"
  | "interactive"
  | "3d_model"
  | "article"
  | "research_paper"
  | "historical_record"
  | "cultural_artifact";


export type ResourceCategory =
  | "heritage_sites"
  | "traditional_crafts"
  | "performing_arts"
  | "culinary_heritage"
  | "festivals_and_rituals"
  | "historical_documents"
  | "oral_traditions"
  | "architecture"
  | "royal_artifacts"
  | "cultural_practices";

export type ChatRole = "user" | "assistant";