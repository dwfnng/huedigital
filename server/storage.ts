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
    // Initialize locations (Digital Map)
    this.locations = [
      {
        id: this.getNextId(),
        name: "Đại Nội Huế",
        description: "Quần thể di tích cung đình triều Nguyễn",
        latitude: "16.4698",
        longitude: "107.5796",
        imageUrl: "/images/locations/dai-noi-hue.jpg",
        category: "heritage",
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        name: "Chùa Thiên Mụ",
        description: "Ngôi chùa cổ nhất Huế",
        latitude: "16.4539",
        longitude: "107.5537",
        imageUrl: "/images/locations/chua-thien-mu.jpg",
        category: "religious",
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        name: "Lăng Tự Đức",
        description: "Lăng tẩm của vua Tự Đức triều Nguyễn",
        latitude: "16.4577",
        longitude: "107.5514",
        imageUrl: "/images/locations/lang-tu-duc.jpg",
        category: "heritage",
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        name: "Cầu Tràng Tiền",
        description: "Cây cầu lịch sử bắc qua sông Hương",
        latitude: "16.4712",
        longitude: "107.5846",
        imageUrl: "/images/locations/cau-trang-tien.jpg",
        category: "landmark",
        createdAt: new Date()
      }
    ];

    // Initialize resources (Digital Library)
    this.resources = [
      {
        id: this.getNextId(),
        title: "Lịch sử Triều Nguyễn",
        description: "Tài liệu về lịch sử triều đại nhà Nguyễn",
        type: "document",
        category: "history",
        contentUrl: "/documents/trieu-nguyen-history.pdf",
        thumbnailUrl: "/images/resources/trieu-nguyen.jpg",
        titleEn: "Nguyen Dynasty History",
        descriptionEn: "Documents about the history of Nguyen Dynasty",
        metadata: {},
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Nghệ thuật cung đình Huế",
        description: "Giới thiệu về nghệ thuật cung đình thời Nguyễn",
        type: "video",
        category: "art",
        contentUrl: "/videos/nghe-thuat-cung-dinh.mp4",
        thumbnailUrl: "/images/resources/nghe-thuat.jpg",
        titleEn: "Hue Royal Art",
        descriptionEn: "Introduction to Nguyen Dynasty royal arts",
        metadata: {},
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Trang phục triều Nguyễn",
        description: "Tài liệu về trang phục cung đình và dân gian",
        type: "document",
        category: "culture",
        contentUrl: "/documents/trang-phuc.pdf",
        thumbnailUrl: "/images/resources/trang-phuc.jpg",
        titleEn: "Nguyen Dynasty Costumes",
        descriptionEn: "Documents about royal and folk costumes",
        metadata: {},
        createdAt: new Date()
      }
    ];

    // Initialize products (Souvenirs)
    this.products = [
      {
        id: this.getNextId(),
        name: "Nón lá Huế thêu hoa",
        description: "Nón lá truyền thống với hoa văn thêu tay",
        price: "120000",
        imageUrl: "/images/products/non-la-hue.jpg",
        category: "traditional",
        stock: "50",
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        name: "Tranh thủy mặc Huế",
        description: "Tranh thủy mặc vẽ cảnh Huế",
        price: "250000",
        imageUrl: "/images/products/tranh-thuy-mac.jpg",
        category: "art",
        stock: "20",
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        name: "Áo dài truyền thống",
        description: "Áo dài may thủ công với chất liệu lụa Huế",
        price: "850000",
        imageUrl: "/images/products/ao-dai.jpg",
        category: "clothing",
        stock: "15",
        createdAt: new Date()
      }
    ];

    // Initialize discussions (Forum)
    this.discussions = [
      {
        id: this.getNextId(),
        title: "Ẩm thực cung đình Huế",
        content: "Thảo luận về văn hóa ẩm thực cung đình Huế",
        category: "culture",
        userId: 1,
        views: "0",
        imageUrl: "/images/discussions/am-thuc.jpg",
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Di sản Huế trong đời sống hiện đại",
        content: "Bảo tồn và phát huy giá trị di sản Huế",
        category: "heritage",
        userId: 1,
        views: "0",
        imageUrl: "/images/discussions/di-san.jpg",
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Nghệ thuật điêu khắc Huế",
        content: "Khám phá nghệ thuật điêu khắc truyền thống",
        category: "art",
        userId: 1,
        views: "0",
        imageUrl: "/images/discussions/dieu-khac.jpg",
        createdAt: new Date()
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