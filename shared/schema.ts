import { pgTable, text, serial, timestamp, jsonb, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  type: text("type").notNull(), // historical_site, restaurant, hotel, etc.
  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertLocationSchema = createInsertSchema(locations).omit({ 
  id: true,
  isActive: true 
});

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

export type LocationType = 
  | "historical_site" 
  | "restaurant" 
  | "hotel" 
  | "restroom" 
  | "parking";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  description: text("description"),
  descriptionEn: text("description_en"),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  description: text("description"),
  descriptionEn: text("description_en"),
  type: text("type").notNull(), // document, image, video, audio, research
  category: text("category").notNull(), // historical_site, architecture, royal_document, etc.
  contentUrl: text("content_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  metadata: jsonb("metadata"), // For additional data like duration, size, format
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type ResourceType = 
  | "document"    // For books, manuscripts, royal decrees
  | "image"       // For photos, architectural drawings
  | "video"       // For documentaries, historical films
  | "audio"       // For royal music, voice recordings
  | "research"    // For academic papers, research works
  | "3d_model";   // For 3D models of monuments

export type CategoryType =
  | "historical_site"
  | "architecture"
  | "royal_document"
  | "artwork"
  | "music"
  | "academic";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(), // user or assistant
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type ChatRole = "user" | "assistant";