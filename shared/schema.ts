import { pgTable, text, serial, timestamp, jsonb, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Locations schema with enhanced heritage site information
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(), 
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  type: text("type").notNull(),
  historicalPeriod: text("historical_period"),
  buildYear: text("build_year"),
  architect: text("architect"),
  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),
  imageUrl: text("image_url").notNull(),
  galleryUrls: text("gallery_urls").array(),
  openingHours: text("opening_hours"),
  admissionFee: numeric("admission_fee"),
  isActive: boolean("is_active").default(true).notNull(),
});

// Tickets schema (without user authentication)
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  visitorName: text("visitor_name").notNull(),
  visitorEmail: text("visitor_email").notNull(),
  visitorPhone: text("visitor_phone").notNull(),
  locationId: serial("location_id").notNull(),
  visitDate: timestamp("visit_date").notNull(),
  quantity: numeric("quantity").notNull(),
  status: text("status").notNull(), // pending, confirmed, used, cancelled
  bookingCode: text("booking_code").notNull(),
  price: numeric("price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Resources schema with enhanced cultural metadata
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
});

// Contributions schema (without user authentication)
export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  contributorName: text("contributor_name").notNull(),
  contributorEmail: text("contributor_email").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  locationId: serial("location_id"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  description: text("description"),
  descriptionEn: text("description_en"),
  parentId: serial("parent_id"),
  iconUrl: text("icon_url"),
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

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema definitions
export const insertLocationSchema = createInsertSchema(locations).omit({ 
  id: true,
  isActive: true 
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  bookingCode: true,
  createdAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
}).extend({
  metadata: z.object({
    format: z.string().optional(),
    resolution: z.string().optional(),
    duration: z.string().optional(),
    size: z.string().optional(),
    technique: z.string().optional(),
    materials: z.array(z.string()).optional(),
    conservation: z.string().optional(),
    culturalSignificance: z.string().optional(),
    historicalEvents: z.array(z.string()).optional(),
    ritualUse: z.string().optional(),
    seasonalContext: z.string().optional(),
    traditionalPractices: z.string().optional(),
  }).optional(),
});

export const insertContributionSchema = createInsertSchema(contributions).omit({
  id: true,
  status: true,
  createdAt: true,
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

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Types
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Contribution = typeof contributions.$inferSelect;
export type InsertContribution = z.infer<typeof insertContributionSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Discussion = typeof discussions.$inferSelect;
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;


// Enums
export type LocationType = 
  | "palace" // điện
  | "temple" // chùa
  | "tomb" // lăng
  | "gate" // cửa
  | "museum" // bảo tàng
  | "pavilion" // đình
  | "tower" // tháp
  | "bridge" // cầu
  | "lake" // hồ
  | "shrine" // miếu
  | "citadel" // thành
  | "library" // thư viện
  | "monument" // đài
  | "historical_site"; // di tích khác

export type ResourceType = 
  | "document"
  | "image"
  | "video"
  | "audio"
  | "research"
  | "3d_model"
  | "manuscript"
  | "artifact"
  | "ritual_description"
  | "folk_song"
  | "traditional_music"
  | "dance_performance"
  | "craft_technique"
  | "oral_history"
  | "architecture"
  | "royal_decree"
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

export type ContributionType =
  | "image"
  | "video"
  | "document"
  | "oral_history"
  | "artifact";

export type ContributionStatus =
  | "pending"
  | "approved"
  | "rejected";

export type TicketStatus = 
  | "pending"
  | "confirmed" 
  | "used"
  | "cancelled";

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