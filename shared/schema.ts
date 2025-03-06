import { pgTable, text, serial, timestamp, jsonb, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: serial("user_id").notNull(),
  category: text("category").notNull(),
  views: numeric("views").default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: serial("user_id").notNull(),
  discussionId: serial("discussion_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  userId: serial("user_id").notNull(),
  locationId: serial("location_id"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  rating: numeric("rating").notNull(),
  userId: serial("user_id").notNull(),
  locationId: serial("location_id").notNull(),
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

// Resources schema with enhanced multimedia support
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  description: text("description"),
  descriptionEn: text("description_en"),
  type: text("type").notNull(),
  category: text("category").notNull(),
  contentUrl: text("content_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  metadata: jsonb("metadata").default({}).notNull(),
  culturalPeriod: text("cultural_period"),
  historicalContext: text("historical_context"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  relatedLocationId: serial("related_location_id"),
  tags: text("tags").array(),
  authorInfo: text("author_info"),
  sourceInfo: text("source_info"),
  languages: text("languages").array(),
  format: text("format"), 
  duration: text("duration"), 
  fileSize: text("file_size"),
  dimensions: text("dimensions"), 
  transcription: text("transcription"), 
  modelFormat: text("model_format"), 
  textureUrls: text("texture_urls").array(), 
  previewUrls: text("preview_urls").array(), 
  license: text("license"), 
  quality: text("quality"), 
  interactiveData: jsonb("interactive_data"), 
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// New table for favorite routes
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

// Schemas
export const insertLocationSchema = createInsertSchema(locations).omit({ 
  id: true,
  isActive: true 
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  points: true,
  createdAt: true,
});

export const insertDiscussionSchema = createInsertSchema(discussions).omit({
  id: true,
  views: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertContributionSchema = createInsertSchema(contributions).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

// Schema for inserting favorite routes
export const insertFavoriteRouteSchema = createInsertSchema(favoriteRoutes).omit({
  id: true,
  createdAt: true,
  isActive: true
});

// Enhanced metadata schema for different resource types
export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
}).extend({
  metadata: z.object({
    // Common metadata
    format: z.string().optional(),
    resolution: z.string().optional(),
    duration: z.string().optional(),
    size: z.string().optional(),

    // Cultural metadata
    technique: z.string().optional(),
    materials: z.array(z.string()).optional(),
    conservation: z.string().optional(),
    culturalSignificance: z.string().optional(),
    historicalEvents: z.array(z.string()).optional(),
    ritualUse: z.string().optional(),
    seasonalContext: z.string().optional(),
    traditionalPractices: z.string().optional(),

    // Technical metadata for different types
    video: z.object({
      codec: z.string(),
      bitrate: z.string(),
      frameRate: z.string(),
      aspectRatio: z.string(),
    }).optional(),

    audio: z.object({
      codec: z.string(),
      bitrate: z.string(),
      sampleRate: z.string(),
      channels: z.string(),
    }).optional(),

    model3d: z.object({
      polygonCount: z.string(),
      textureResolution: z.string(),
      fileFormat: z.string(),
      renderEngine: z.string(),
    }).optional(),
  }).optional(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Resource Categories for Digital Library
export const digitalLibraryCategories = pgTable("digital_library_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  description: text("description"),
  descriptionEn: text("description_en"),
  parentId: serial("parent_id"),
  iconUrl: text("icon_url"),
  type: text("type").notNull(), 
  sortOrder: numeric("sort_order").default("0"),
});

// Digital Library Resources
export const digitalLibraryResources = pgTable("digital_library_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  description: text("description"),
  descriptionEn: text("description_en"),
  type: text("type").notNull(), 
  category: text("category").notNull(),
  contentUrl: text("content_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  author: text("author"),
  source: text("source"),
  yearCreated: text("year_created"),
  location: text("location"), 
  dynasty: text("dynasty"),
  period: text("period"),
  keywords: text("keywords").array(),
  languages: text("languages").array(),

  // Specialized metadata
  metadata: jsonb("metadata").default({}).notNull(),

  // For documents
  pageCount: numeric("page_count"),
  fileFormat: text("file_format"), 
  fileSize: numeric("file_size"),

  // For images
  resolution: text("resolution"),
  dimensions: text("dimensions"),

  // For audio/video
  duration: numeric("duration"),
  quality: text("quality"),

  // For 3D models
  modelFormat: text("model_format"),
  textureUrls: text("texture_urls").array(),

  // Common fields
  viewCount: numeric("view_count").default("0"),
  downloadCount: numeric("download_count").default("0"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Create insert schemas
export const insertDigitalLibraryCategorySchema = createInsertSchema(digitalLibraryCategories).omit({
  id: true,
  sortOrder: true
});

export const insertDigitalLibraryResourceSchema = createInsertSchema(digitalLibraryResources).omit({
  id: true,
  viewCount: true,
  downloadCount: true,
  featured: true,
  createdAt: true,
  updatedAt: true
});

// Export types
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Discussion = typeof discussions.$inferSelect;
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Contribution = typeof contributions.$inferSelect;
export type InsertContribution = z.infer<typeof insertContributionSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
// Type definitions for favorite routes
export type FavoriteRoute = typeof favoriteRoutes.$inferSelect;
export type InsertFavoriteRoute = z.infer<typeof insertFavoriteRouteSchema>;
export type DigitalLibraryCategory = typeof digitalLibraryCategories.$inferSelect;
export type InsertDigitalLibraryCategory = z.infer<typeof insertDigitalLibraryCategorySchema>;
export type DigitalLibraryResource = typeof digitalLibraryResources.$inferSelect;
export type InsertDigitalLibraryResource = z.infer<typeof insertDigitalLibraryResourceSchema>;

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

export type ContributionType =
  | "image"
  | "video"
  | "document"
  | "audio"
  | "3d_model";

export type ContributionStatus =
  | "pending"
  | "approved"
  | "rejected";

export type PointTransactionType =
  | "contribution"
  | "discussion"
  | "review";

export type ResourceType = 
  | "image" 
  | "video"
  | "audio"
  | "3d_model"
  | "document"
  | "manuscript"
  | "artifact"
  | "ritual_description"
  | "folk_song"
  | "traditional_music"
  | "dance_performance"
  | "craft_technique"
  | "oral_history"
  | "architecture"
  | "historical_map";

export type ResourceCategory =
  | "imperial_artifacts"
  | "royal_ceremonies"
  | "traditional_crafts"
  | "folk_customs"
  | "religious_practices"
  | "historical_documents"
  | "architectural_heritage"
  | "performing_arts"
  | "culinary_heritage"
  | "traditional_medicine"
  | "local_festivals"
  | "oral_traditions"
  | "decorative_arts"
  | "cultural_landscapes";

export type ChatRole = "user" | "assistant";

// Resource type enums
export type DigitalResourceType = 
  | "document" 
  | "book" 
  | "manuscript" 
  | "image" 
  | "architectural_drawing" 
  | "video" 
  | "audio" 
  | "3d_model" 
  | "research_paper" 
  | "dataset" 
  | "map" 
  | "artifact" 
  | "ritual_description" 
  | "oral_history";