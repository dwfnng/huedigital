import { pgPool, db } from "./db";
import {
  type Location, type User, type Discussion, type Comment, type Contribution, type Review,
  type InsertLocation, type InsertUser, type InsertDiscussion, type InsertComment,
  type InsertContribution, type InsertReview, type Resource, type Category, type InsertResource, type InsertCategory,
  type FavoriteRoute, type InsertFavoriteRoute, type Product, type InsertProduct
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { eq, desc, asc } from "drizzle-orm";
import connectPg from "connect-pg-simple";

const PostgresStore = connectPg(session);
const MemoryStore = createMemoryStore(session);

// Import schema tables
import { users, discussions, comments, contributions, reviews, pointTransactions, locations, resources, categories, favoriteRoutes, products } from '@shared/schema';

export interface IStorage {
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  updateUserPoints(userId: number, points: string): Promise<User>;

  // Discussions
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  getDiscussionById(id: number): Promise<Discussion | undefined>;
  getDiscussionsByCategory(category: string): Promise<Discussion[]>;
  getAllDiscussions(): Promise<Discussion[]>;
  incrementDiscussionViews(id: number): Promise<void>;
  deleteDiscussion(id: number): Promise<void>;

  // Comments
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByDiscussionId(discussionId: number): Promise<Comment[]>;
  deleteComment(id: number): Promise<void>;

  // Contributions
  createContribution(contribution: InsertContribution): Promise<Contribution>;
  getContributionsByUserId(userId: number): Promise<Contribution[]>;
  getContributionsByLocationId(locationId: number): Promise<Contribution[]>;
  getPendingContributions(): Promise<Contribution[]>;
  updateContributionStatus(id: number, status: string): Promise<Contribution>;
  getAllContributions(): Promise<Contribution[]>;
  getApprovedContributions(): Promise<Contribution[]>;

  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByLocationId(locationId: number): Promise<Review[]>;
  getReviewsByUserId(userId: number): Promise<Review[]>;

  // Point Transactions
  createPointTransaction(userId: number, points: string, type: string, referenceId: number): Promise<void>;
  getPointTransactionsByUserId(userId: number): Promise<any[]>;

  // Locations
  getAllLocations(): Promise<Location[]>;
  getLocationById(id: number): Promise<Location | undefined>;
  searchLocations(query: string): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;

  // Resources
  getAllResources(): Promise<Resource[]>;
  getResourceById(id: number): Promise<Resource | undefined>;
  getResourcesByType(type: string): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  searchResources(query: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Favorite Routes
  getFavoriteRoutes(userId: number): Promise<FavoriteRoute[]>;
  getFavoriteRouteById(id: number): Promise<FavoriteRoute | undefined>;
  createFavoriteRoute(route: InsertFavoriteRoute): Promise<FavoriteRoute>;
  deleteFavoriteRoute(id: number): Promise<void>;

  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    // Use PostgreSQL session store in production, fallback to memory store in development
    this.sessionStore = process.env.NODE_ENV === 'production'
      ? new PostgresStore({ pool: pgPool, createTableIfMissing: true })
      : new MemoryStore({
          checkPeriod: 86400000 // Clear expired entries every 24h
        });
  }

  // Discussions
  async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    const result = await db.insert(discussions).values({
      title: discussion.title,
      content: discussion.content,
      category: discussion.category,
      userId: discussion.userId,
      views: 0,
      createdAt: new Date()
    }).returning();
    return result[0];
  }

  async getDiscussionById(id: number): Promise<Discussion | undefined> {
    const result = await db.select().from(discussions).where(eq(discussions.id, id));
    return result[0];
  }

  async getDiscussionsByCategory(category: string): Promise<Discussion[]> {
    return await db.select().from(discussions).where(eq(discussions.category, category));
  }

  async getAllDiscussions(): Promise<Discussion[]> {
    return await db.select().from(discussions).orderBy(desc(discussions.createdAt));
  }

  async deleteDiscussion(id: number): Promise<void> {
    await db.delete(discussions).where(eq(discussions.id, id));
    await db.delete(comments).where(eq(comments.discussionId, id));
  }

  async incrementDiscussionViews(id: number): Promise<void> {
    await db.update(discussions)
      .set({ views: discussions.views + 1 })
      .where(eq(discussions.id, id));
  }

  // Comments
  async createComment(comment: InsertComment): Promise<Comment> {
    const result = await db.insert(comments).values({
      content: comment.content,
      userId: comment.userId,
      discussionId: comment.discussionId,
      createdAt: new Date()
    }).returning();
    return result[0];
  }

  async getCommentsByDiscussionId(discussionId: number): Promise<Comment[]> {
    return await db.select().from(comments)
      .where(eq(comments.discussionId, discussionId))
      .orderBy(asc(comments.createdAt));
  }

  async deleteComment(id: number): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }

  // Users
  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      username: user.username,
      password: user.password,
      email: user.email,
      role: user.role,
      points: user.points,
      createdAt: new Date()
    }).returning();
    return result[0];
  }

  async getUserById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async updateUserPoints(userId: number, points: string): Promise<User> {
    const result = await db.update(users).set({ points }).where(eq(users.id, userId)).returning();
    return result[0];
  }


  // Contributions
  async createContribution(contribution: InsertContribution): Promise<Contribution> {
    const result = await db.insert(contributions).values({
      ...contribution,
      createdAt: new Date(),
      status: 'pending'
    }).returning();
    return result[0];
  }

  async getContributionsByUserId(userId: number): Promise<Contribution[]> {
    return await db.select().from(contributions).where(eq(contributions.userId, userId));
  }

  async getContributionsByLocationId(locationId: number): Promise<Contribution[]> {
    return await db.select().from(contributions).where(eq(contributions.locationId, locationId));
  }

  async getPendingContributions(): Promise<Contribution[]> {
    return await db.select().from(contributions).where(eq(contributions.status, "pending"));
  }

  async updateContributionStatus(id: number, status: string): Promise<Contribution> {
    const result = await db.update(contributions).set({ status }).where(eq(contributions.id, id)).returning();
    return result[0];
  }

  async getAllContributions(): Promise<Contribution[]> {
    return await db.select().from(contributions);
  }

  async getApprovedContributions(): Promise<Contribution[]> {
    return await db.select().from(contributions).where(eq(contributions.status, 'approved'));
  }

  // Reviews
  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values({
      ...review,
    }).returning();
    return result[0];
  }

  async getReviewsByLocationId(locationId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.locationId, locationId));
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.userId, userId));
  }

  // Point Transactions
  async createPointTransaction(userId: number, points: string, type: string, referenceId: number): Promise<void> {
    await db.insert(pointTransactions).values({
      userId,
      points,
      type,
      referenceId,
      createdAt: new Date()
    });
  }

  async getPointTransactionsByUserId(userId: number): Promise<any[]> {
    return await db.select().from(pointTransactions).where(eq(pointTransactions.userId, userId));
  }

  // Locations
  async getAllLocations(): Promise<Location[]> {
    return await db.select().from(locations);
  }

  async getLocationById(id: number): Promise<Location | undefined> {
    const result = await db.select().from(locations).where(eq(locations.id, id));
    return result[0];
  }

  async searchLocations(query: string): Promise<Location[]> {
    const lowerQuery = query.toLowerCase();
    return await db.select().from(locations).where(
      (l) => l.name.toLowerCase().like(`%${lowerQuery}%`)
    )
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const result = await db.insert(locations).values(location).returning();
    return result[0];
  }

  // Resources
  async getAllResources(): Promise<Resource[]> {
    return await db.select().from(resources);
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    const result = await db.select().from(resources).where(eq(resources.id, id));
    return result[0];
  }

  async getResourcesByType(type: string): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.type, type));
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.category, category));
  }

  async searchResources(query: string): Promise<Resource[]> {
    const lowerQuery = query.toLowerCase();
    return await db.select().from(resources).where(
      (r) => r.title.toLowerCase().like(`%${lowerQuery}%`)
    );
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const result = await db.insert(resources).values(resource).returning();
    return result[0];
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  // Products
    async getAllProducts(): Promise<Product[]> {
      return await db.select().from(products);
    }
  
    async getProductById(id: number): Promise<Product | undefined> {
      const result = await db.select().from(products).where(eq(products.id, id));
      return result[0];
    }
  
    async createProduct(product: InsertProduct): Promise<Product> {
      const result = await db.insert(products).values(product).returning();
      return result[0];
    }

  // Favorite Routes
  async getFavoriteRoutes(userId: number): Promise<FavoriteRoute[]> {
    return await db.select().from(favoriteRoutes).where(eq(favoriteRoutes.userId, userId)).where(eq(favoriteRoutes.isActive, true));
  }

  async getFavoriteRouteById(id: number): Promise<FavoriteRoute | undefined> {
    const result = await db.select().from(favoriteRoutes).where(eq(favoriteRoutes.id, id)).where(eq(favoriteRoutes.isActive, true));
    return result[0];
  }

  async createFavoriteRoute(route: InsertFavoriteRoute): Promise<FavoriteRoute> {
    const result = await db.insert(favoriteRoutes).values({
      ...route,
      createdAt: new Date(),
      isActive: true
    }).returning();
    return result[0];
  }

  async deleteFavoriteRoute(id: number): Promise<void> {
    await db.update(favoriteRoutes).set({ isActive: false }).where(eq(favoriteRoutes.id, id));
  }
}

// Create and export storage instance
export const storage = new DatabaseStorage();