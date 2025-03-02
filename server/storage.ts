import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import {
  locations, users, discussions, comments, contributions, reviews, pointTransactions, resources, categories,
  type Location, type User, type Discussion, type Comment, type Contribution, type Review,
  type InsertLocation, type InsertUser, type InsertDiscussion, type InsertComment,
  type InsertContribution, type InsertReview, type Resource, type Category, type InsertResource, type InsertCategory
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

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async updateUserPoints(userId: number, points: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ points })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Discussions
  async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    const [newDiscussion] = await db.insert(discussions).values(discussion).returning();
    return newDiscussion;
  }

  async getDiscussionById(id: number): Promise<Discussion | undefined> {
    const [discussion] = await db.select().from(discussions).where(eq(discussions.id, id));
    return discussion;
  }

  async getDiscussionsByCategory(category: string): Promise<Discussion[]> {
    return db.select().from(discussions).where(eq(discussions.category, category));
  }

  async getAllDiscussions(): Promise<Discussion[]> {
    return db.select().from(discussions);
  }

  async incrementDiscussionViews(id: number): Promise<void> {
    await db
      .update(discussions)
      .set({ 
        views: sql`${discussions.views}::numeric + 1` 
      })
      .where(eq(discussions.id, id));
  }

  // Comments
  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async getCommentsByDiscussionId(discussionId: number): Promise<Comment[]> {
    return db.select().from(comments).where(eq(comments.discussionId, discussionId));
  }

  // Contributions
  async createContribution(contribution: InsertContribution): Promise<Contribution> {
    const [newContribution] = await db.insert(contributions).values(contribution).returning();
    return newContribution;
  }

  async getContributionsByUserId(userId: number): Promise<Contribution[]> {
    return db.select().from(contributions).where(eq(contributions.userId, userId));
  }

  async getContributionsByLocationId(locationId: number): Promise<Contribution[]> {
    return db.select().from(contributions).where(eq(contributions.locationId, locationId));
  }

  async getPendingContributions(): Promise<Contribution[]> {
    return db.select().from(contributions).where(eq(contributions.status, "pending"));
  }

  async updateContributionStatus(id: number, status: string): Promise<Contribution> {
    const [contribution] = await db
      .update(contributions)
      .set({ status })
      .where(eq(contributions.id, id))
      .returning();
    return contribution;
  }

  // Reviews
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async getReviewsByLocationId(locationId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.locationId, locationId));
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.userId, userId));
  }

  // Point Transactions
  async createPointTransaction(
    userId: number,
    points: string,
    type: string,
    referenceId: number
  ): Promise<void> {
    await db.insert(pointTransactions).values({
      userId,
      points,
      type,
      referenceId
    });
  }

  async getPointTransactionsByUserId(userId: number): Promise<any[]> {
    return db.select().from(pointTransactions).where(eq(pointTransactions.userId, userId));
  }

  // Locations
  async getAllLocations(): Promise<Location[]> {
    return db.select().from(locations);
  }

  async getLocationById(id: number): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location;
  }

  async searchLocations(query: string): Promise<Location[]> {
    return db.select().from(locations).where(
      sql`lower(${locations.name}) like ${`%${query.toLowerCase()}%`}`
    );
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const [newLocation] = await db.insert(locations).values(location).returning();
    return newLocation;
  }

  // Resources
  async getAllResources(): Promise<Resource[]> {
    return db.select().from(resources);
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async getResourcesByType(type: string): Promise<Resource[]> {
    return db.select().from(resources).where(eq(resources.type, type));
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return db.select().from(resources).where(eq(resources.category, category));
  }

  async searchResources(query: string): Promise<Resource[]> {
    return db.select().from(resources).where(
      sql`lower(${resources.title}) like ${`%${query.toLowerCase()}%`}`
    );
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }
}

export const storage = new DatabaseStorage();