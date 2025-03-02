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
        nameEn: "Hue Imperial City",
        description: "Quần thể di tích cung đình triều Nguyễn",
        descriptionEn: "Imperial palace complex of the Nguyen Dynasty",
        type: "heritage",
        latitude: "16.4698",
        longitude: "107.5796",
        imageUrl: "/images/locations/dai-noi-hue.jpg",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        name: "Kỳ Đài",
        nameEn: "Ky Dai Flag Tower",
        description: "Tháp cờ lịch sử của Huế, xây dựng năm 1807",
        descriptionEn: "Historic flag tower of Hue, built in 1807",
        type: "heritage",
        latitude: "16.4716",
        longitude: "107.5827",
        imageUrl: "/images/locations/ky-dai.jpg",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        name: "Trường Quốc Tử Giám",
        nameEn: "Quoc Tu Giam School",
        description: "Trường học hoàng gia thời Nguyễn",
        descriptionEn: "Royal school during Nguyen Dynasty",
        type: "heritage",
        latitude: "16.4703",
        longitude: "107.5789",
        imageUrl: "/images/locations/truong-quoc-tu-giam.jpg",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        name: "Điện Long An",
        nameEn: "Long An Palace",
        description: "Cung điện hoàng gia, nay là Bảo tàng Mỹ thuật Cung đình Huế",
        descriptionEn: "Royal palace, now Hue Royal Fine Arts Museum",
        type: "heritage",
        latitude: "16.4701",
        longitude: "107.5793",
        imageUrl: "/images/locations/dien-long-an.jpg",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        name: "Điện Thái Hòa",
        nameEn: "Thai Hoa Palace",
        description: "Cung điện chính của Hoàng thành Huế",
        descriptionEn: "Main palace of Hue Imperial City",
        type: "heritage",
        latitude: "16.4700",
        longitude: "107.5792",
        imageUrl: "/images/locations/dien-thai-hoa.jpg",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        name: "Hồ Tịnh Tâm",
        nameEn: "Tinh Tam Lake",
        description: "Hồ cảnh quan trong Hoàng thành Huế",
        descriptionEn: "Scenic lake within Hue Imperial City",
        type: "landscape",
        latitude: "16.4705",
        longitude: "107.5783",
        imageUrl: "/images/locations/ho-tinh-tam.jpg",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        name: "Lăng Gia Long",
        nameEn: "Gia Long Tomb",
        description: "Lăng mộ của vua Gia Long",
        descriptionEn: "Tomb of Emperor Gia Long",
        type: "heritage",
        latitude: "16.4198",
        longitude: "107.5438",
        imageUrl: "/images/locations/lang-gia-long.jpg",
        isActive: true,
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        name: "Lăng Minh Mạng",
        nameEn: "Minh Mang Tomb",
        description: "Lăng mộ của vua Minh Mạng",
        descriptionEn: "Tomb of Emperor Minh Mang",
        type: "heritage",
        latitude: "16.4135",
        longitude: "107.5392",
        imageUrl: "/images/locations/lang-minh-mang.jpg",
        isActive: true,
        createdAt: new Date()
      }
    ];

    // Initialize resources (Digital Library)
    this.resources = [
      {
        id: this.getNextId(),
        title: "Lịch sử Triều Nguyễn",
        titleEn: "Nguyen Dynasty History",
        description: "Tài liệu về lịch sử triều đại nhà Nguyễn",
        descriptionEn: "Documents about Nguyen Dynasty history",
        type: "document",
        category: "history",
        contentUrl: "/documents/trieu-nguyen-history.pdf",
        thumbnailUrl: "/images/resources/trieu-nguyen.jpg",
        metadata: {
          format: "pdf",
          pages: 50,
          language: "vi"
        },
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Âm nhạc cung đình Huế",
        titleEn: "Hue Royal Music",
        description: "Bản thu âm nhạc cung đình Huế truyền thống",
        descriptionEn: "Traditional Hue royal music recordings",
        type: "audio",
        category: "music",
        contentUrl: "/audio/nhac-cung-dinh.mp3",
        thumbnailUrl: "/images/resources/nhac-cung-dinh.jpg",
        metadata: {
          format: "mp3",
          duration: "45:00",
          quality: "320kbps"
        },
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Kiến trúc Kỳ Đài",
        titleEn: "Ky Dai Architecture",
        description: "Hình ảnh và thông tin về Kỳ Đài Huế",
        descriptionEn: "Images and information about Ky Dai Flag Tower",
        type: "image",
        category: "architecture",
        contentUrl: "/images/resources/ky-dai-detail.jpg",
        thumbnailUrl: "/images/resources/ky-dai-thumb.jpg",
        metadata: {
          format: "jpg",
          resolution: "4K",
          year: "2024"
        },
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Trường Quốc Tử Giám qua các thời kỳ",
        titleEn: "Quoc Tu Giam School Through History",
        description: "Tư liệu về trường học hoàng gia xưa",
        descriptionEn: "Documents about the historic royal school",
        type: "document",
        category: "education",
        contentUrl: "/documents/truong-quoc-tu-giam.pdf",
        thumbnailUrl: "/images/resources/quoc-tu-giam.jpg",
        metadata: {
          format: "pdf",
          pages: 30,
          language: "vi"
        },
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Điện Long An - Bảo tàng Mỹ thuật",
        titleEn: "Long An Palace - Fine Arts Museum",
        description: "Video giới thiệu về Bảo tàng Mỹ thuật Cung đình Huế",
        descriptionEn: "Video introduction to Hue Royal Fine Arts Museum",
        type: "video",
        category: "art",
        contentUrl: "/videos/dien-long-an.mp4",
        thumbnailUrl: "/images/resources/dien-long-an-thumb.jpg",
        metadata: {
          format: "mp4",
          duration: "20:00",
          resolution: "4K"
        },
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Điện Thái Hòa và nghi lễ triều đình",
        titleEn: "Thai Hoa Palace and Court Ceremonies",
        description: "Tư liệu về nghi lễ triều đình tại Điện Thái Hòa",
        descriptionEn: "Documents about court ceremonies at Thai Hoa Palace",
        type: "document",
        category: "culture",
        contentUrl: "/documents/dien-thai-hoa.pdf",
        thumbnailUrl: "/images/resources/thai-hoa.jpg",
        metadata: {
          format: "pdf",
          pages: 40,
          language: "vi"
        },
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Hồ Tịnh Tâm và vườn ngự uyển",
        titleEn: "Tinh Tam Lake and Royal Gardens",
        description: "Hình ảnh về Hồ Tịnh Tâm và khu vườn hoàng gia",
        descriptionEn: "Images of Tinh Tam Lake and royal gardens",
        type: "image",
        category: "landscape",
        contentUrl: "/images/resources/ho-tinh-tam-full.jpg",
        thumbnailUrl: "/images/resources/ho-tinh-tam-thumb.jpg",
        metadata: {
          format: "jpg",
          resolution: "4K",
          year: "2024"
        },
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Lăng tẩm triều Nguyễn",
        titleEn: "Nguyen Dynasty Royal Tombs",
        description: "Phim tài liệu về các lăng tẩm vua chúa triều Nguyễn",
        descriptionEn: "Documentary about Nguyen Dynasty royal tombs",
        type: "video",
        category: "heritage",
        contentUrl: "/videos/lang-tam.mp4",
        thumbnailUrl: "/images/resources/lang-tam-thumb.jpg",
        metadata: {
          format: "mp4",
          duration: "45:00",
          resolution: "4K"
        },
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Âm nhạc tại Điện Hòn Chén",
        titleEn: "Music at Hon Chen Temple",
        description: "Bản thu âm nhạc lễ hội tại Điện Hòn Chén",
        descriptionEn: "Music recordings from Hon Chen Temple festivals",
        type: "audio",
        category: "music",
        contentUrl: "/audio/dien-hon-chen.mp3",
        thumbnailUrl: "/images/resources/hon-chen.jpg",
        metadata: {
          format: "mp3",
          duration: "30:00",
          quality: "320kbps"
        },
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Chùa Thiên Mụ qua các thời kỳ",
        titleEn: "Thien Mu Pagoda Through Ages",
        description: "Tư liệu lịch sử về chùa Thiên Mụ",
        descriptionEn: "Historical documents about Thien Mu Pagoda",
        type: "document",
        category: "religion",
        contentUrl: "/documents/chua-thien-mu.pdf",
        thumbnailUrl: "/images/resources/thien-mu.jpg",
        metadata: {
          format: "pdf",
          pages: 35,
          language: "vi"
        },
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