import {
  type Location, type User, type Discussion, type Comment, type Contribution, type Review,
  type InsertLocation, type InsertUser, type InsertDiscussion, type InsertComment,
  type InsertContribution, type InsertReview, type Resource, type Category, type InsertResource, type InsertCategory,
  type Product, type InsertProduct
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

  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private discussions: Discussion[] = [];
  private comments: Comment[] = [];
  private contributions: Contribution[] = [];
  private reviews: Review[] = [];
  private pointTransactions: any[] = [];
  private locations: Location[] = [];
  private resources: Resource[] = [];
  private categories: Category[] = [];
  private products: Product[] = [];
  private nextId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize locations with proper structure
    this.locations = [
      {
        id: this.getNextId(),
        name: "Đại Nội Huế",
        nameEn: "Hue Imperial City",
        description: "Quần thể di tích cung đình triều Nguyễn",
        descriptionEn: "Imperial palace complex of the Nguyen Dynasty",
        type: "heritage_site",
        latitude: "16.4698",
        longitude: "107.5796",
        imageUrl: "/attached_assets/pexels-vinhb-29790971.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Chùa Thiên Mụ",
        nameEn: "Thien Mu Pagoda",
        description: "Ngôi chùa cổ kính nhất tại Huế",
        descriptionEn: "The oldest pagoda in Hue",
        type: "temple",
        latitude: "16.4539",
        longitude: "107.5537",
        imageUrl: "/attached_assets/pexels-th-vinh-flute-822138648-21011475.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Điện Thái Hòa",
        nameEn: "Thai Hoa Palace",
        description: "Cung điện chính của Hoàng thành Huế",
        descriptionEn: "Main palace of Hue Imperial City",
        type: "palace",
        latitude: "16.4700",
        longitude: "107.5792",
        imageUrl: "/attached_assets/pexels-qhung999-28772283.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Cổng Ngọ Môn",
        nameEn: "Ngo Mon Gate",
        description: "Cổng chính vào Hoàng thành Huế",
        descriptionEn: "Main gate of Hue Imperial City",
        type: "monument",
        latitude: "16.4716",
        longitude: "107.5827",
        imageUrl: "/attached_assets/pexels-vietnam-photographer-27418892.jpg",
        isActive: true
      }
    ];

    // Initialize resources with proper content types and URLs
    this.resources = [
      {
        id: this.getNextId(),
        title: "Kiến trúc cung đình Huế",
        titleEn: "Hue Royal Architecture",
        description: "Hình ảnh về kiến trúc cung đình Huế",
        descriptionEn: "Images of Hue royal architecture",
        type: "image",
        category: "architecture",
        contentUrl: "https://hueworldheritage.org.vn/kien-truc-cung-dinh.html",
        thumbnailUrl: "/attached_assets/pexels-qhung999-28772283.jpg",
        metadata: {
          format: "jpg",
          resolution: "4K",
          year: "2024"
        }
      },
      {
        id: this.getNextId(),
        title: "Chùa Thiên Mụ qua các thời kỳ",
        titleEn: "Thien Mu Pagoda Through Ages",
        description: "Tư liệu lịch sử về chùa Thiên Mụ",
        descriptionEn: "Historical documents about Thien Mu Pagoda",
        type: "image",
        category: "religion",
        contentUrl: "https://hueworldheritage.org.vn/chua-thien-mu.html",
        thumbnailUrl: "/attached_assets/pexels-th-vinh-flute-822138648-21011475.jpg",
        metadata: {
          format: "jpg",
          resolution: "HD",
          year: "2024"
        }
      },
      {
        id: this.getNextId(),
        title: "Hoàng thành Huế",
        titleEn: "Hue Imperial City",
        description: "Tổng quan về quần thể di tích Hoàng thành Huế",
        descriptionEn: "Overview of Hue Imperial City heritage complex",
        type: "image",
        category: "heritage",
        contentUrl: "https://hueworldheritage.org.vn/hoang-thanh.html",
        thumbnailUrl: "/attached_assets/pexels-vinhb-29790971.jpg",
        metadata: {
          format: "jpg",
          resolution: "4K",
          year: "2024"
        }
      }
    ];

    // Initialize products with proper image URLs
    this.products = [
      {
        id: this.getNextId(),
        name: "Nón lá Huế thêu hoa",
        description: "Nón lá truyền thống với hoa văn thêu tay",
        price: "120000",
        imageUrl: "/attached_assets/pexels-karen-w-lim-415441-1089318.jpg",
        category: "traditional",
        stock: "50"
      },
      {
        id: this.getNextId(),
        name: "Tranh thủy mặc Huế",
        description: "Tranh thủy mặc vẽ cảnh Huế",
        price: "250000",
        imageUrl: "/attached_assets/pexels-uyen-bui-205258074-11937353.jpg",
        category: "art",
        stock: "20"
      },
      {
        id: this.getNextId(),
        name: "Áo dài truyền thống",
        description: "Áo dài may thủ công với chất liệu lụa Huế",
        price: "850000",
        imageUrl: "/attached_assets/pexels-th-vinh-flute-822138648-21011475.jpg",
        category: "clothing",
        stock: "15"
      },
      {
        id: this.getNextId(),
        name: "Tượng rồng đá Huế",
        description: "Tượng rồng đá điêu khắc thủ công",
        price: "450000",
        imageUrl: "/attached_assets/pexels-vinhb-29790971.jpg",
        category: "sculpture",
        stock: "10"
      },
      {
        id: this.getNextId(),
        name: "Trầm hương Huế",
        description: "Trầm hương nguyên chất từ Huế",
        price: "180000",
        imageUrl: "/attached_assets/pexels-vietnam-photographer-27418892.jpg",
        category: "traditional",
        stock: "30"
      }
    ];

    // Initialize categories
    this.categories = [
      {
        id: this.getNextId(),
        name: "Di sản",
        nameEn: "Heritage",
        description: "Các di sản văn hóa Huế",
        descriptionEn: "Hue cultural heritage",
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        name: "Văn hóa",
        nameEn: "Culture",
        description: "Văn hóa và phong tục Huế",
        descriptionEn: "Hue culture and customs",
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        name: "Nghệ thuật",
        nameEn: "Art",
        description: "Nghệ thuật truyền thống Huế",
        descriptionEn: "Hue traditional arts",
        createdAt: new Date()
      }
    ];

    // Add a default user for testing
    this.users = [
      {
        id: 1,
        username: "admin",
        password: "admin123",
        email: "admin@example.com",
        role: "admin",
        points: "0",
        createdAt: new Date()
      }
    ];
  }

  private getNextId(): number {
    return this.nextId++;
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct = { ...product, id: this.getNextId() } as Product;
    this.products.push(newProduct);
    return newProduct;
  }

  // Users
  async createUser(user: InsertUser): Promise<User> {
    const newUser = { ...user, id: this.getNextId() } as User;
    this.users.push(newUser);
    return newUser;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async updateUserPoints(userId: number, points: string): Promise<User> {
    const user = await this.getUserById(userId);
    if (!user) throw new Error('User not found');
    user.points = points;
    return user;
  }

  // Discussions
  async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    const newDiscussion = { ...discussion, id: this.getNextId(), views: 0 } as Discussion;
    this.discussions.push(newDiscussion);
    return newDiscussion;
  }

  async getDiscussionById(id: number): Promise<Discussion | undefined> {
    return this.discussions.find(d => d.id === id);
  }

  async getDiscussionsByCategory(category: string): Promise<Discussion[]> {
    return this.discussions.filter(d => d.category === category);
  }

  async getAllDiscussions(): Promise<Discussion[]> {
    return this.discussions;
  }

  async incrementDiscussionViews(id: number): Promise<void> {
    const discussion = await this.getDiscussionById(id);
    if (discussion) {
      discussion.views++;
    }
  }

  // Comments
  async createComment(comment: InsertComment): Promise<Comment> {
    const newComment = { ...comment, id: this.getNextId() } as Comment;
    this.comments.push(newComment);
    return newComment;
  }

  async getCommentsByDiscussionId(discussionId: number): Promise<Comment[]> {
    return this.comments.filter(c => c.discussionId === discussionId);
  }

  // Contributions
  async createContribution(contribution: InsertContribution): Promise<Contribution> {
    const newContribution = { ...contribution, id: this.getNextId() } as Contribution;
    this.contributions.push(newContribution);
    return newContribution;
  }

  async getContributionsByUserId(userId: number): Promise<Contribution[]> {
    return this.contributions.filter(c => c.userId === userId);
  }

  async getContributionsByLocationId(locationId: number): Promise<Contribution[]> {
    return this.contributions.filter(c => c.locationId === locationId);
  }

  async getPendingContributions(): Promise<Contribution[]> {
    return this.contributions.filter(c => c.status === "pending");
  }

  async updateContributionStatus(id: number, status: string): Promise<Contribution> {
    const contribution = this.contributions.find(c => c.id === id);
    if (!contribution) throw new Error('Contribution not found');
    contribution.status = status;
    return contribution;
  }

  // Reviews
  async createReview(review: InsertReview): Promise<Review> {
    const newReview = { ...review, id: this.getNextId() } as Review;
    this.reviews.push(newReview);
    return newReview;
  }

  async getReviewsByLocationId(locationId: number): Promise<Review[]> {
    return this.reviews.filter(r => r.locationId === locationId);
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return this.reviews.filter(r => r.userId === userId);
  }

  // Point Transactions
  async createPointTransaction(
    userId: number,
    points: string,
    type: string,
    referenceId: number
  ): Promise<void> {
    this.pointTransactions.push({
      id: this.getNextId(),
      userId,
      points,
      type,
      referenceId,
      createdAt: new Date()
    });
  }

  async getPointTransactionsByUserId(userId: number): Promise<any[]> {
    return this.pointTransactions.filter(t => t.userId === userId);
  }

  // Locations
  async getAllLocations(): Promise<Location[]> {
    return this.locations;
  }

  async getLocationById(id: number): Promise<Location | undefined> {
    return this.locations.find(l => l.id === id);
  }

  async searchLocations(query: string): Promise<Location[]> {
    const lowerQuery = query.toLowerCase();
    return this.locations.filter(l =>
      l.name.toLowerCase().includes(lowerQuery)
    );
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const newLocation = { ...location, id: this.getNextId() } as Location;
    this.locations.push(newLocation);
    return newLocation;
  }

  // Resources
  async getAllResources(): Promise<Resource[]> {
    return this.resources;
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    return this.resources.find(r => r.id === id);
  }

  async getResourcesByType(type: string): Promise<Resource[]> {
    return this.resources.filter(r => r.type === type);
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return this.resources.filter(r => r.category === category);
  }

  async searchResources(query: string): Promise<Resource[]> {
    const lowerQuery = query.toLowerCase();
    return this.resources.filter(r =>
      r.title.toLowerCase().includes(lowerQuery)
    );
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const newResource = { ...resource, id: this.getNextId() } as Resource;
    this.resources.push(newResource);
    return newResource;
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return this.categories;
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.find(c => c.id === id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory = { ...category, id: this.getNextId() } as Category;
    this.categories.push(newCategory);
    return newCategory;
  }
}

export const storage = new MemStorage();