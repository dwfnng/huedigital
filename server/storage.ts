import {
  type Location, type User, type Discussion, type Comment, type Contribution,
  type InsertLocation, type InsertUser, type InsertDiscussion, type InsertComment,
  type InsertContribution, type Resource, type Category, type InsertResource, 
  type InsertCategory, type FavoriteRoute, type InsertFavoriteRoute
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  resources, discussions, comments, contributions,
  locations, categories, favoriteRoutes, users
} from "@shared/schema";

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

  // Comments  
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByDiscussionId(discussionId: number): Promise<Comment[]>;

  // Contributions
  createContribution(contribution: InsertContribution): Promise<Contribution>;
  getContributionsByUserId(userId: number): Promise<Contribution[]>;
  getContributionsByLocationId(locationId: number): Promise<Contribution[]>;
  getPendingContributions(): Promise<Contribution[]>;
  updateContributionStatus(id: number, status: string): Promise<Contribution>;

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
  updateResourceViews(id: number): Promise<void>;

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
}

export class DatabaseStorage implements IStorage {
  // Users
  async createUser(user: InsertUser): Promise<User> {
    throw new Error("Method not implemented.");
  }
  async getUserById(id: number): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  async updateUserPoints(userId: number, points: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  // Discussions
  async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    const [newDiscussion] = await db
      .insert(discussions)
      .values(discussion)
      .returning();
    return newDiscussion;
  }
  async getDiscussionById(id: number): Promise<Discussion | undefined> {
    const [discussion] = await db
      .select()
      .from(discussions)
      .where(eq(discussions.id, id));
    return discussion;
  }
  async getDiscussionsByCategory(category: string): Promise<Discussion[]> {
    return await db
      .select()
      .from(discussions)
      .where(eq(discussions.category, category));
  }
  async getAllDiscussions(): Promise<Discussion[]> {
    return await db.select().from(discussions);
  }
  async incrementDiscussionViews(id: number): Promise<void> {
    const discussion = await this.getDiscussionById(id);
    if (discussion) {
      await db
        .update(discussions)
        .set({ views: (Number(discussion.views) + 1).toString() })
        .where(eq(discussions.id, id));
    }
  }

  // Comments
  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values(comment)
      .returning();
    return newComment;
  }
  async getCommentsByDiscussionId(discussionId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.discussionId, discussionId));
  }


  // Contributions
  async createContribution(contribution: InsertContribution): Promise<Contribution> {
    const [newContribution] = await db
      .insert(contributions)
      .values(contribution)
      .returning();
    return newContribution;
  }

  async getContributionsByUserId(userId: number): Promise<Contribution[]> {
    return await db
      .select()
      .from(contributions)
      .where(eq(contributions.userId, userId));
  }

  async getContributionsByLocationId(locationId: number): Promise<Contribution[]> {
    return await db
      .select()
      .from(contributions)
      .where(eq(contributions.locationId, locationId));
  }

  async getPendingContributions(): Promise<Contribution[]> {
    return await db
      .select()
      .from(contributions)
      .where(eq(contributions.status, "pending"));
  }

  async updateContributionStatus(id: number, status: string): Promise<Contribution> {
    const [updatedContribution] = await db
      .update(contributions)
      .set({ status, reviewedAt: new Date() })
      .where(eq(contributions.id, id))
      .returning();
    return updatedContribution;
  }

  // Reviews
  async createReview(review: InsertReview): Promise<Review> {
    throw new Error("Method not implemented.");
  }
  async getReviewsByLocationId(locationId: number): Promise<Review[]> {
    throw new Error("Method not implemented.");
  }
  async getReviewsByUserId(userId: number): Promise<Review[]> {
    throw new Error("Method not implemented.");
  }

  // Point Transactions
  async createPointTransaction(userId: number, points: string, type: string, referenceId: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async getPointTransactionsByUserId(userId: number): Promise<any[]> {
    throw new Error("Method not implemented.");
  }

  // Locations
  async getAllLocations(): Promise<Location[]> {
    throw new Error("Method not implemented.");
  }
  async getLocationById(id: number): Promise<Location | undefined> {
    throw new Error("Method not implemented.");
  }
  async searchLocations(query: string): Promise<Location[]> {
    throw new Error("Method not implemented.");
  }
  async createLocation(location: InsertLocation): Promise<Location> {
    throw new Error("Method not implemented.");
  }

  // Resources
  async getAllResources(): Promise<Resource[]> {
    return await db.select().from(resources);
  }
  async getResourceById(id: number): Promise<Resource | undefined> {
    const [resource] = await db
      .select()
      .from(resources)
      .where(eq(resources.id, id));
    return resource;
  }
  async getResourcesByType(type: string): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(eq(resources.type, type));
  }
  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(eq(resources.category, category));
  }
  async searchResources(query: string): Promise<Resource[]> {
    // Basic search implementation - can be enhanced with full-text search later
    return await db
      .select()
      .from(resources)
      .where(eq(resources.status, "published"));
  }
  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db
      .insert(resources)
      .values(resource)
      .returning();
    return newResource;
  }
  async updateResourceViews(id: number): Promise<void> {
    const resource = await this.getResourceById(id);
    if (resource) {
      await db
        .update(resources)
        .set({ viewCount: (Number(resource.viewCount) + 1).toString() })
        .where(eq(resources.id, id));
    }
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    throw new Error("Method not implemented.");
  }
  async getCategoryById(id: number): Promise<Category | undefined> {
    throw new Error("Method not implemented.");
  }
  async createCategory(category: InsertCategory): Promise<Category> {
    throw new Error("Method not implemented.");
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
  async getProductById(id: number): Promise<Product | undefined> {
    throw new Error("Method not implemented.");
  }
  async createProduct(product: InsertProduct): Promise<Product> {
    throw new Error("Method not implemented.");
  }

  // Favorite Routes
  async getFavoriteRoutes(userId: number): Promise<FavoriteRoute[]> {
    throw new Error("Method not implemented.");
  }
  async getFavoriteRouteById(id: number): Promise<FavoriteRoute | undefined> {
    throw new Error("Method not implemented.");
  }
  async createFavoriteRoute(route: InsertFavoriteRoute): Promise<FavoriteRoute> {
    throw new Error("Method not implemented.");
  }
  async deleteFavoriteRoute(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export const storage = new DatabaseStorage();