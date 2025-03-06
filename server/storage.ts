import {
  type Location, type User, type Discussion, type Comment, type Contribution, type Review,
  type InsertLocation, type InsertUser, type InsertDiscussion, type InsertComment,
  type InsertContribution, type InsertReview, type Resource, type Category, type InsertResource, type InsertCategory,
  type FavoriteRoute, type InsertFavoriteRoute
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Product types (these were missing and causing LSP errors)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  stock: string;
}

export interface InsertProduct {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  stock: string;
}

export interface DigitalLibraryResource {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  type: string;
  category: string;
  contentUrl: string;
  thumbnailUrl: string;
  author: string;
  source: string;
  yearCreated: string;
  location: string;
  dynasty: string;
  period: string;
  keywords: string[];
  languages: string[];
  metadata: Record<string, any>;
  latitude?: string;
  longitude?: string;
  pageCount?: string;
  fileFormat?: string;
  fileSize?: string;
  viewCount: number;
  downloadCount: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  duration?: string;
  quality?: string;
}


export interface DigitalLibraryCategory {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  parentId: number | null;
  iconUrl: string | null;
  type: string;
  sortOrder: string;
}

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
  getPointTransactionsByUserId(userId: number): Promise<Record<string, any>[]>;

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
  getResourcesByLocationId(locationId: number): Promise<Resource[]>;
  searchResources(query: string): Promise<Resource[]>;
  createResource(resource: InsertResource & { createdAt: Date }): Promise<Resource>;

  // Categories 
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory & { description: string | null, descriptionEn: string | null }): Promise<Category>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Favorite Routes
  getFavoriteRoutes(userId: number): Promise<FavoriteRoute[]>;
  getFavoriteRouteById(id: number): Promise<FavoriteRoute | undefined>;
  createFavoriteRoute(route: InsertFavoriteRoute & { createdAt: Date, isActive: boolean }): Promise<FavoriteRoute>;
  deleteFavoriteRoute(id: number): Promise<void>;

  // Digital Library methods
  getAllDigitalLibraryResources(): Promise<DigitalLibraryResource[]>;
  getAllDigitalLibraryCategories(): Promise<DigitalLibraryCategory[]>;

  // Session store
  sessionStore: session.Store;
}

export interface PointTransaction {
  userId: number;
  points: string;
  type: string;
  referenceId: number;
  createdAt: Date;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private discussions: Discussion[] = [];
  private comments: Comment[] = [];
  private contributions: Contribution[] = [];
  private reviews: Review[] = [];
  private pointTransactions: Record<string, any>[] = [];
  private locations: Location[] = [];
  private resources: Resource[] = [];
  private categories: Category[] = [];
  private favoriteRoutes: FavoriteRoute[] = [];
  private products: Product[] = [];
  private digitalLibraryResources: DigitalLibraryResource[] = [];
  private digitalLibraryCategories: DigitalLibraryCategory[] = [];
  private nextId = 1;
  public sessionStore: session.Store;

  // Users
  public async createUser(user: InsertUser): Promise<User> {
    const newUser = { 
      id: this.getNextId(), 
      ...user,
      points: "0",
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  public async getUserById(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  public async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  public async updateUserPoints(userId: number, points: string): Promise<User> {
    const user = await this.getUserById(userId);
    if (!user) throw new Error('User not found');
    user.points = points;
    return user;
  }

  // Discussions
  public async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    const newDiscussion = { 
      id: this.getNextId(), 
      ...discussion,
      createdAt: new Date(),
      views: "0"
    };
    this.discussions.push(newDiscussion);
    return newDiscussion;
  }

  public async getDiscussionById(id: number): Promise<Discussion | undefined> {
    return this.discussions.find(d => d.id === id);
  }

  public async getDiscussionsByCategory(category: string): Promise<Discussion[]> {
    return this.discussions.filter(d => d.category === category);
  }

  public async getAllDiscussions(): Promise<Discussion[]> {
    return this.discussions;
  }

  public async incrementDiscussionViews(id: number): Promise<void> {
    const discussion = await this.getDiscussionById(id);
    if (discussion) {
      discussion.views = String(parseInt(discussion.views) + 1);
    }
  }

  // Comments
  public async createComment(comment: InsertComment): Promise<Comment> {
    const newComment = { 
      id: this.getNextId(),
      userId: comment.userId || 0, 
      discussionId: comment.discussionId || 0,
      content: comment.content,
      createdAt: new Date()
    };
    this.comments.push(newComment);
    return newComment;
  }

  public async getCommentsByDiscussionId(discussionId: number): Promise<Comment[]> {
    return this.comments.filter(c => c.discussionId === discussionId);
  }

  // Contributions
  public async createContribution(contribution: InsertContribution): Promise<Contribution> {
    const newContribution = { 
      id: this.getNextId(),
      userId: contribution.userId || 0,
      locationId: contribution.locationId || 0,
      type: contribution.type,
      title: contribution.title,
      description: contribution.description,
      url: contribution.url,
      createdAt: new Date(),
      status: "pending"
    };
    this.contributions.push(newContribution);
    return newContribution;
  }

  public async getContributionsByUserId(userId: number): Promise<Contribution[]> {
    return this.contributions.filter(c => c.userId === userId);
  }

  public async getContributionsByLocationId(locationId: number): Promise<Contribution[]> {
    return this.contributions.filter(c => c.locationId === locationId);
  }

  public async getPendingContributions(): Promise<Contribution[]> {
    return this.contributions.filter(c => c.status === 'pending');
  }

  public async updateContributionStatus(id: number, status: string): Promise<Contribution> {
    const contribution = this.contributions.find(c => c.id === id);
    if (!contribution) throw new Error('Contribution not found');
    contribution.status = status;
    return contribution;
  }

  // Reviews
  public async createReview(review: InsertReview): Promise<Review> {
    const newReview = { 
      id: this.getNextId(),
      userId: review.userId || 0,
      locationId: review.locationId || 0,
      content: review.content,
      rating: review.rating,
      createdAt: new Date()
    };
    this.reviews.push(newReview);
    return newReview;
  }

  public async getReviewsByLocationId(locationId: number): Promise<Review[]> {
    return this.reviews.filter(r => r.locationId === locationId);
  }

  public async getReviewsByUserId(userId: number): Promise<Review[]> {
    return this.reviews.filter(r => r.userId === userId);
  }

  // Point Transactions
  public async createPointTransaction(userId: number, points: string, type: string, referenceId: number): Promise<void> {
    this.pointTransactions.push({ userId, points, type, referenceId, createdAt: new Date() });
  }

  public async getPointTransactionsByUserId(userId: number): Promise<Record<string, any>[]> {
    return this.pointTransactions.filter(t => t.userId === userId);
  }

  // Locations
  public async getAllLocations(): Promise<Location[]> {
    return this.locations;
  }

  public async getLocationById(id: number): Promise<Location | undefined> {
    return this.locations.find(l => l.id === id);
  }

  public async searchLocations(query: string): Promise<Location[]> {
    const lowerQuery = query.toLowerCase();
    return this.locations.filter(l => 
      l.name.toLowerCase().includes(lowerQuery) || 
      l.nameEn.toLowerCase().includes(lowerQuery) ||
      l.description.toLowerCase().includes(lowerQuery) ||
      l.descriptionEn.toLowerCase().includes(lowerQuery)
    );
  }

  public async createLocation(location: InsertLocation): Promise<Location> {
    const newLocation = { 
      id: this.getNextId(),
      ...location,
      isActive: true 
    };
    this.locations.push(newLocation);
    return newLocation;
  }

  // Resources
  public async getAllResources(): Promise<Resource[]> {
    return this.resources;
  }

  public async getResourceById(id: number): Promise<Resource | undefined> {
    return this.resources.find(r => r.id === id);
  }

  public async getResourcesByType(type: string): Promise<Resource[]> {
    return this.resources.filter(r => r.type === type);
  }

  public async getResourcesByCategory(category: string): Promise<Resource[]> {
    return this.resources.filter(r => r.category === category);
  }

  public async getResourcesByLocationId(locationId: number): Promise<Resource[]> {
    return this.resources.filter(r => r.relatedLocationId === locationId);
  }

  public async searchResources(query: string): Promise<Resource[]> {
    const lowerQuery = query.toLowerCase();
    return this.resources.filter(r => 
      r.title.toLowerCase().includes(lowerQuery) || 
      (r.titleEn?.toLowerCase() || '').includes(lowerQuery) ||
      (r.description?.toLowerCase() || '').includes(lowerQuery) ||
      (r.descriptionEn?.toLowerCase() || '').includes(lowerQuery)
    );
  }

  public async createResource(resource: InsertResource): Promise<Resource> {
    const newResource = { 
      id: this.getNextId(), 
      ...resource,
      createdAt: new Date() 
    };
    this.resources.push(newResource);
    return newResource;
  }

  // Categories
  public async getAllCategories(): Promise<Category[]> {
    return this.categories;
  }

  public async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.find(c => c.id === id);
  }

  public async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory = { 
      id: this.getNextId(),
      ...category,
      description: category.description || null,
      descriptionEn: category.descriptionEn || null,
      parentId: category.parentId || null,
      iconUrl: category.iconUrl || null
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  // Products
  public async getAllProducts(): Promise<Product[]> {
    return this.products;
  }

  public async getProductById(id: number): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  public async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct = { id: this.getNextId(), ...product };
    this.products.push(newProduct);
    return newProduct;
  }

  // Favorite Routes
  public async getFavoriteRoutes(userId: number): Promise<FavoriteRoute[]> {
    return this.favoriteRoutes.filter(r => r.userId === userId);
  }

  public async getFavoriteRouteById(id: number): Promise<FavoriteRoute | undefined> {
    return this.favoriteRoutes.find(r => r.id === id);
  }

  public async createFavoriteRoute(route: InsertFavoriteRoute): Promise<FavoriteRoute> {
    const newRoute = { 
      id: this.getNextId(),
      ...route,
      description: route.description || null,
      createdAt: new Date(),
      isActive: true
    };
    this.favoriteRoutes.push(newRoute);
    return newRoute;
  }

  public async deleteFavoriteRoute(id: number): Promise<void> {
    const index = this.favoriteRoutes.findIndex(r => r.id === id);
    if (index > -1) this.favoriteRoutes.splice(index, 1);
  }

  // Digital Library methods
  public async getAllDigitalLibraryResources(): Promise<DigitalLibraryResource[]> {
    return this.digitalLibraryResources;
  }
  
  public async getAllDigitalLibraryCategories(): Promise<DigitalLibraryCategory[]> {
    return this.digitalLibraryCategories;
  }

  private getNextId(): number {
    return this.nextId++;
  }

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Clear expired entries every 24h
    });
    this.initializeData();
  }

  private initializeData() {
    // Initialize locations first 
    this.locations = [
      {
        id: this.getNextId(),
        name: "Đại Nội Huế",
        nameEn: "Hue Imperial City",
        description: "Quần thể di tích cung đình rộng hơn 500 hecta, nơi hoàng đế triều Nguyễn sinh sống và làm việc.",
        descriptionEn: "A 500-hectare complex where Nguyen Dynasty emperors lived and worked.",
        type: "heritage_site",
        latitude: "16.4698",
        longitude: "107.5796", 
        imageUrl: "/attached_assets/image_1741283084416.png",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Chùa Thiên Mụ",
        nameEn: "Thien Mu Pagoda", 
        description: "Ngôi chùa cổ nhất Huế, được xây dựng năm 1601.",
        descriptionEn: "The oldest pagoda in Hue, built in 1601.",
        type: "temple",
        latitude: "16.4539",
        longitude: "107.5537",
        imageUrl: "/attached_assets/image_1741283181295.png",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Điện Hòn Chén",
        nameEn: "Hon Chen Palace",
        description: "Điện Hòn Chén là quần thể kiến trúc tôn giáo độc đáo bên bờ sông Hương.",
        descriptionEn: "Hon Chen Palace is a unique religious architectural complex by the Perfume River.",
        type: "temple",
        latitude: "16.4180",
        longitude: "107.5350",
        imageUrl: "/attached_assets/image_1741283078951.png",
        isActive: true
      }
    ];

    // Initialize digital library resources
    this.digitalLibraryResources = [
    this.locations = [
      {
        id: this.getNextId(),
        name: "Đại Nội Huế",
        nameEn: "Hue Imperial City",
        description: "Quần thể di tích cung đình rộng hơn 500 hecta, nơi hoàng đế triều Nguyễn sinh sống và làm việc.",
        descriptionEn: "A 500-hectare complex where Nguyen Dynasty emperors lived and worked.",
        type: "heritage_site",
        latitude: "16.4698",
        longitude: "107.5796", 
        imageUrl: "/attached_assets/image_1741283084416.png",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Chùa Thiên Mụ",
        nameEn: "Thien Mu Pagoda", 
        description: "Ngôi chùa cổ nhất Huế, được xây dựng năm 1601.",
        descriptionEn: "The oldest pagoda in Hue, built in 1601.",
        type: "temple",
        latitude: "16.4539",
        longitude: "107.5537",
        imageUrl: "/attached_assets/image_1741283181295.png",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Điện Hòn Chén",
        nameEn: "Hon Chen Palace",
        description: "Điện Hòn Chén là quần thể kiến trúc tôn giáo độc đáo bên bờ sông Hương.",
        descriptionEn: "Hon Chen Palace is a unique religious architectural complex by the Perfume River.",
        type: "temple",
        latitude: "16.4180",
        longitude: "107.5350",
        imageUrl: "/attached_assets/image_1741283078951.png",
        isActive: true
      }
    ];

    // Initialize digital library resources
    this.digitalLibraryResources = [
      {
        id: this.getNextId(),
        title: "Hoàng thành Huế - Kiệt tác kiến trúc cung đình nhà Nguyễn",
        titleEn: "Hue Imperial City - Masterpiece of Nguyen Dynasty Palace Architecture",
        description: "Hoàng thành Huế là quần thể di tích cung đình rộng hơn 500 hecta, nơi hoàng đế triều Nguyễn sinh sống và làm việc.",
        descriptionEn: "A 500-hectare complex where Nguyen Dynasty emperors lived and worked.",
        type: "document",
        category: "historical_sites",
        contentUrl: "/attached_assets/HOÀNG THÀNH HUẾ – KIỆT TÁC KIẾN TRÚC CUNG ĐÌNH NHÀ NGUYỄN.docx",
        thumbnailUrl: "/attached_assets/image_1741283084416.png",
        author: "Heritage Research Team",
        source: "Hue Monuments Conservation Center",
        yearCreated: "2023",
        location: "Hue",
        dynasty: "Nguyen",
        period: "1802-1945",
        keywords: ["palace", "architecture", "imperial", "Nguyen Dynasty"],
        languages: ["vi", "en"],
        metadata: {},
        viewCount: 0,
        downloadCount: 0, 
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Chùa Thiên Mụ - Biểu tượng linh thiêng của cố đô Huế",
        titleEn: "Thien Mu Pagoda - Sacred Symbol of Ancient Hue Capital",
        description: "Ngôi chùa cổ nhất Huế, được xây dựng năm 1601.",
        descriptionEn: "The oldest pagoda in Hue, built in 1601.",
        type: "document",
        category: "historical_sites", 
        contentUrl: "/attached_assets/CHÙA THIÊN MỤ – BIỂU TƯỢNG LINH THIÊNG CỦA CỐ ĐÔ HUẾ.docx",
        thumbnailUrl: "/attached_assets/image_1741283181295.png",
        author: "Buddhist Culture Research Team",
        source: "Hue Buddhist Association",
        yearCreated: "2023",
        location: "Hue",
        dynasty: "Nguyen",
        period: "1601-present",
        keywords: ["pagoda", "buddhist", "temple", "heritage"],
        languages: ["vi", "en"],
        metadata: {},
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    this.locations = [
      {
        id: this.getNextId(),
        name: "Đại Nội Huế",
        nameEn: "Hue Imperial City",
        description: "Complex of imperial monuments spanning over 500 hectares.",
        descriptionEn: "A 500-hectare complex of royal monuments.", 
        type: "heritage_site",
        latitude: "16.4698",
        longitude: "107.5796",
        imageUrl: "/attached_assets/hoang-thanh.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Chùa Thiên Mụ",
        nameEn: "Thien Mu Pagoda",
        description: "Chùa cổ thờ Phật, được xây dựng năm 1601.",
        descriptionEn: "Ancient Buddhist temple built in 1601.", 
        type: "temple",
        latitude: "16.4539",
        longitude: "107.5537",
        imageUrl: "/attached_assets/thien-mu.jpg",
        isActive: true
      },

      {
        id: this.getNextId(),
        name: "Kỳ Đài",
        nameEn: "Ky Dai Flagpole",
        description: "Kỳ Đài Huế là công trình kiến trúc nằm trong quần thể di tích Cố đô Huế, được xây dựng năm 1807 dưới thời vua Gia Long. Đây là nơi thường trực treo cờ triều Nguyễn, với chiều cao 37m, gồm 3 tầng hình bát giác thu nhỏ dần về phía trên.",
        descriptionEn: "Ky Dai Flagpole is an architectural work within the Hue Ancient Capital complex, built in 1807 under Emperor Gia Long. It was used to fly the Nguyen Dynasty flag, standing 37m tall with 3 octagonal tiers that gradually narrow towards the top.",
        type: "monument",
        latitude: "16.4715",
        longitude: "107.5828",
        imageUrl: "/attached_assets/ky-dai.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Trường Quốc Tử Giám",
        nameEn: "National Academy",
        description: "Trường Quốc Tử Giám là trường đại học đầu tiên của triều Nguyễn, được xây dựng năm 1821 dưới thời vua Minh Mạng. Nơi đây đào tạo quan lại và trí thức cho triều đình, với hệ thống giáo dục theo mô hình Nho giáo truyền thống.",
        descriptionEn: "The National Academy was the first university of the Nguyen Dynasty, built in 1821 under Emperor Minh Mang. It trained officials and scholars for the court, following traditional Confucian educational system.",
        type: "education",
        latitude: "16.4680",
        longitude: "107.5790",
        imageUrl: "/attached_assets/quoc-tu-giam.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Điện Long An",
        nameEn: "Long An Palace",
        description: "Điện Long An được xây dựng năm 1845 dưới thời vua Thiệu Trị, là nơi thờ các vị hoàng đế triều Nguyễn. Hiện nay công trình được sử dụng làm Bảo tàng Mỹ thuật Cung đình Huế, trưng bày nhiều hiện vật quý về nghệ thuật cung đình.",
        descriptionEn: "Long An Palace was built in 1845 under Emperor Thieu Tri, serving as a temple for Nguyen Dynasty emperors. Today it houses the Museum of Royal Fine Arts, displaying precious royal art artifacts.",
        type: "museum",
        latitude: "16.4695",
        longitude: "107.5793",
        imageUrl: "/attached_assets/long-an.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Sông Hương & Cầu Tràng Tiền",
        nameEn: "Perfume River & Trang Tien Bridge",
        description: "Sông Hương là biểu tượng của vẻ đẹp thơ mộng xứ Huế, uốn lượn như dải lụa xanh giữa lòng thành phố. Cầu Tràng Tiền sáu vòm được xây dựng năm 1899, là công trình kiến trúc độc đáo kết hợp phong cách Đông - Tây.",
        descriptionEn: "The Perfume River is a symbol of Hue's poetic beauty, winding like a silk ribbon through the city. The six-arch Trang Tien Bridge, built in 1899, is a unique architectural work blending Eastern and Western styles.",
        type: "landscape",
        latitude: "16.4690",
        longitude: "107.5880",
        imageUrl: "/attached_assets/song-huong.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Núi Ngự Bình",
        nameEn: "Ngu Binh Mountain",
        description: "Núi Ngự Bình cao 103m, được ví như bức bình phong của kinh thành Huế. Theo quan niệm phong thủy, ngọn núi này cùng với dòng Sông Hương tạo nên địa thế đẹp cho Kinh thành.",
        descriptionEn: "Standing 103m tall, Ngu Binh Mountain is likened to a screen protecting Hue Citadel. In feng shui principles, this mountain together with the Perfume River creates an auspicious setting for the Imperial City.",
        type: "landscape",
        latitude: "16.4472",
        longitude: "107.5651",
        imageUrl: "/attached_assets/ngu-binh.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Đồi Vọng Cảnh",
        nameEn: "Vong Canh Hill",
        description: "Đồi Vọng Cảnh là điểm cao đắc địa để ngắm toàn cảnh sông Hương và cố đô Huế. Nơi đây từng là địa điểm các vua triều Nguyễn chọn làm nơi thưởng ngoạn cảnh đẹp.",
        descriptionEn: "Vong Canh Hill offers a strategic viewpoint overlooking the Perfume River and ancient Hue. It was a favorite spot for Nguyen Dynasty emperors to admire the scenery.",
        type: "landscape",
        latitude: "16.4178",
        longitude: "107.5514",
        imageUrl: "/attached_assets/vong-canh.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Đàn Nam Giao",
        nameEn: "Nam Giao Esplanade",
        description: "Đàn Nam Giao là công trình kiến trúc tôn giáo quy mô lớn, nơi vua triều Nguyễn thực hiện tế lễ Giao hàng năm. Quần thể gồm ba cấp đàn hình vuông, tròn và bát giác tượng trưng cho Thiên - Địa - Nhân.",
        descriptionEn: "Nam Giao Esplanade is a large religious architectural complex where Nguyen emperors performed annual Heaven and Earth worship ceremonies. The three-tiered altar includes square, round, and octagonal levels symbolizing Heaven, Earth, and Human.",
        type: "ritual",
        latitude: "16.4510",
        longitude: "107.5670",
        imageUrl: "/attached_assets/dan-nam-giao.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Thiền viện Trúc Lâm Bạch Mã",
        nameEn: "Truc Lam Bach Ma Zen Monastery",
        description: "Thiền viện Trúc Lâm Bạch Mã là trung tâm tu học Phật giáo lớn tại Huế, tọa lạc trên núi Bạch Mã. Công trình thể hiện sự kết hợp hài hòa giữa kiến trúc Phật giáo và cảnh quan thiên nhiên.",
        descriptionEn: "Truc Lam Bach Ma Zen Monastery is a major Buddhist meditation center in Hue, located on Bach Ma Mountain. The complex demonstrates a harmonious blend of Buddhist architecture and natural landscape.",
        type: "temple",
        latitude: "16.1851",
        longitude: "107.8501",
        imageUrl: "/attached_assets/truc-lam.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Làng Hương Thủy Xuân",
        nameEn: "Thuy Xuan Incense Village",
        description: "Làng nghề làm hương Thủy Xuân nổi tiếng với nghề làm nhang truyền thống. Du khách có thể tham quan quy trình làm hương thủ công và tìm hiểu về văn hóa tâm linh địa phương.",
        descriptionEn: "Thuy Xuan Incense Village is famous for its traditional incense making craft. Visitors can observe the handmade incense production process and learn about local spiritual culture.",
        type: "craft_village",
        latitude: "16.4167",
        longitude: "107.5500",
        imageUrl: "/attached_assets/thuy-xuan.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Chợ Đông Ba",
        nameEn: "Dong Ba Market",
        description: "Chợ Đông Ba là khu chợ truyền thống lớn nhất Huế, nơi tập trung các mặt hàng đặc sản và thủ công mỹ nghệ địa phương. Khu chợ có lịch sử hơn 100 năm, là điểm tham quan không thể bỏ qua khi đến Huế.",
        descriptionEn: "Dong Ba Market is Hue's largest traditional market, featuring local specialties and handicrafts. With over 100 years of history, it's a must-visit destination in Hue.",
        type: "market",
        latitude: "16.4717",
        longitude: "107.5828",
        imageUrl: "/attached_assets/dong-ba.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Điện Thái Hòa",
        nameEn: "Thai Hoa Palace",
        description: "Công trình quan trọng nhất trong Hoàng thành Huế, nơi diễn ra các đại lễ và thiết triều của vua. Điện được xây năm 1805, thiết kế theo phong cách cung đình truyền thống với 80 cột gỗ quý sơn son thếp vàng và hoa văn tinh xảo.",
        descriptionEn: "The most important building in Hue Citadel, where emperors held grand ceremonies and court meetings. Built in 1805, designed in traditional palace style with 80 precious wooden columns lacquered and gilded with intricate patterns.",
        type: "palace",
        latitude: "16.4700",
        longitude: "107.5792",
        imageUrl: "/attached_assets/thai-hoa.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Hồ Tịnh Tâm",
        nameEn: "Tinh Tam Lake",
        description: "Hồ Tịnh Tâm được xây dựng năm 1833 dưới thời vua Minh Mạng, là một trong những cảnh quan đẹp nhất trong Hoàng thành. Hồ có diện tích khoảng 5 hecta, nổi tiếng với hoa sen và các công trình kiến trúc xung quanh như đình Tịnh Tâm.",
        descriptionEn: "Tinh Tam Lake was built in 1833 under Emperor Minh Mang, one of the most beautiful landscapes in the Citadel. The 5-hectare lake is famous for its lotus flowers and surrounding architecture like Tinh Tam Pavilion.",
        type: "landscape",
        latitude: "16.4705",
        longitude: "107.5785",
        imageUrl: "/attached_assets/tinh-tam.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Cửu Vị Thần Công",
        nameEn: "Nine Sacred Cannons",
        description: "Cửu Vị Thần Công là 9 khẩu đại bác được đúc năm 1804 dưới thời vua Gia Long, mỗi khẩu tượng trưng cho một vị thần và bốn mùa. Có trọng lượng từ 1,900 đến 2,900 kg, là biểu tượng của quyền lực và sức mạnh quân sự triều Nguyễn.",
        descriptionEn: "The Nine Sacred Cannons were cast in 1804 under Emperor Gia Long, each representing a deity and the four seasons. Weighing between 1,900 and 2,900 kg, they symbolize the Nguyen Dynasty's military power and authority.",
        type: "artifact",
        latitude: "16.4697",
        longitude: "107.5799",
        imageUrl: "/attached_assets/cuu-vi-than-cong.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Lăng Gia Long",
        nameEn: "Gia Long Tomb",
        description: "Lăng Gia Long là lăng mộ của vua Gia Long và Hoàng hậu Thừa Thiên Cao, được xây dựng từ 1814-1820. Quần thể rộng khoảng 11,700 hecta với kiến trúc hài hòa giữa nhân tạo và thiên nhiên, nằm trong thung lũng Thiên Thọ.",
        descriptionEn: "Gia Long Tomb is the mausoleum of Emperor Gia Long and Empress Thua Thien Cao, built from 1814-1820. The 11,700-hectare complex features architecture harmoniously blending with nature in Thien Tho Valley.",
        type: "tomb",
        latitude: "16.4198",
        longitude: "107.5438",
        imageUrl: "/attached_assets/lang-gia-long.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Lăng Minh Mạng",
        nameEn: "Minh Mang Tomb",
        description: "Lăng Minh Mạng được xây dựng từ 1840-1843, là công trình kiến trúc hoàn hảo nhất trong các lăng tẩm triều Nguyễn. Quần thể gồm 40 công trình kiến trúc được bố trí đối xứng qua trục chính Bắc-Nam, thể hiện quan niệm về vũ trụ và âm dương.",
        descriptionEn: "Minh Mang Tomb was built from 1840-1843, considered the most architecturally perfect among Nguyen Dynasty mausoleums. The complex includes 40 structures arranged symmetrically along the North-South axis, reflecting cosmic and yin-yang concepts.",
        type: "tomb",
        latitude: "16.4470",
        longitude: "107.5530",
        imageUrl: "/attached_assets/lang-minh-mang.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Lăng Thiệu Trị",
        nameEn: "Thieu Tri Tomb",
        description: "Lăng Thiệu Trị được xây dựng năm 1848, là lăng mộ đơn giản nhất trong các lăng vua triều Nguyễn. Điểm đặc biệt là lăng được xây dựng theo di chúc của vua, chú trọng sự giản dị và tiết kiệm.",
        descriptionEn: "Thieu Tri Tomb was built in 1848, the simplest among Nguyen Dynasty royal tombs. Notably, it was built according to the emperor's will, emphasizing simplicity and frugality.",
        type: "tomb",
        latitude: "16.4530",
        longitude: "107.5570",
        imageUrl: "/attached_assets/lang-thieu-tri.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Lăng Khải Định",
        nameEn: "Khai Dinh Tomb",
        description: "Lăng Khải Định được xây dựng từ 1920-1931, là lăng mộ cuối cùng của triều Nguyễn. Kiến trúc độc đáo kết hợp phong cách Đông-Tây, với các họa tiết trang trí tinh xảo bằng mảnh sứ và thủy tinh.",
        descriptionEn: "Khai Dinh Tomb was built from 1920-1931, the last tomb of the Nguyen Dynasty. Its unique architecture combines Eastern and Western styles, featuring intricate decorations made from ceramic and glass pieces.",
        type: "tomb",
        latitude: "16.4200",
        longitude: "107.5780",
        imageUrl: "/attached_assets/lang-khai-dinh.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Lăng Tự Đức",
        nameEn: "Tu Duc Tomb",
        description: "Quần thể lăng mộ rộng 12 ha được xây dựng từ 1864-1867, là nơi nghỉ ngơi và làm việc của vua Tự Đức sinh thời. Kiến trúc tinh tế với hồ Lưu Khiêm, điện Luân Khiêm và vườn thơ Xung Khiêm thể hiện tính cách văn nhân của vị vua thi sĩ.",
        descriptionEn: "A 12-hectare tomb complex built from 1864-1867, served as Emperor Tu Duc's retreat and workplace. Features elegant architecture with Luu Khiem Lake, Luan Khiem Palace and Xung Khiem Poetry Garden reflecting the poet-emperor's scholarly nature.",
        type: "tomb",
        latitude: "16.4570",
        longitude: "107.5530",
        imageUrl: "/attached_assets/lang-tu-duc.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Đình Phú Xuân",
        nameEn: "Phu Xuan Communal House",
        description: "Đình Phú Xuân là công trình kiến trúc cổ được xây dựng từ thời Nguyễn, là nơi thờ thành hoàng và tổ chức các nghi lễ quan trọng của làng. Kiến trúc đình thể hiện nghệ thuật chạm khắc gỗ tinh xảo thời Nguyễn.",
        descriptionEn: "Phu Xuan Communal House is an ancient architectural work built during the Nguyen Dynasty, used for village deity worship and important ceremonies. Its architecture showcases exquisite Nguyen Dynasty woodcarving art.",
        type: "communal_house",
        latitude: "16.4720",
        longitude: "107.5840",
        imageUrl: "/attached_assets/dinh-phu-xuan.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Viện Cơ Mật",
        nameEn: "Co Mat Institute",
        description: "Viện Cơ Mật là cơ quan tham mưu cao nhất của triều Nguyễn, được thành lập năm 1834 dưới thời vua Minh Mạng. Nơi đây từng là trung tâm hoạch định chính sách và điều hành đất nước.",
        descriptionEn: "Co Mat Institute was the highest advisory body of the Nguyen Dynasty, established in 1834 under Emperor Minh Mang. It served as the center for policy planning and national administration.",
        type: "government",
        latitude: "16.4690",
        longitude: "107.5795",
        imageUrl: "/attached_assets/vien-co-mat.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Văn Miếu",
        nameEn: "Temple of Literature",
        description: "Văn Miếu Huế được xây dựng năm 1808 thời vua Gia Long, thờ Khổng Tử và các bậc hiền triết. Nơi đây là biểu tượng của nền giáo dục Nho học và tổ chức các kỳ thi Hương của triều Nguyễn.",
        descriptionEn: "Hue Temple of Literature was built in 1808 under Emperor Gia Long, dedicated to Confucius and other sages. It symbolizes Confucian education and hosted the regional examinations of the Nguyen Dynasty.",
        type: "temple",
        latitude: "16.4630",
        longitude: "107.5780",
        imageUrl: "/attached_assets/van-mieu.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Đàn Nam Giao",
        nameEn: "Nam Giao Esplanade",
        description: "Đàn Nam Giao là công trình kiến trúc tôn giáo quy mô lớn, nơi vua triều Nguyễn thực hiện tế lễ Giao hàng năm. Quần thể gồm ba cấp đàn hình vuông, tròn và bát giác tượng trưng cho Thiên - Địa - Nhân.",
        descriptionEn: "Nam Giao Esplanade is a large religious architectural complex where Nguyen emperors performed annual Heaven and Earth worship ceremonies. The three-tiered altar includes square, round, and octagonal levels symbolizing Heaven, Earth, and Human.",
        type: "ritual",
        latitude: "16.4510",
        longitude: "107.5670",
        imageUrl: "/attached_assets/dan-nam-giao.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Điện Hòn Chén",
        nameEn: "Hon Chen Temple",
        description: "Điện Hòn Chén là quần thể kiến trúc tôn giáo nằm bên bờ sông Hương, thờ Thiên Y A Na - nữ thần của người Chăm. Nơi đây là điểm giao thoa văn hóa Việt-Chăm độc đáo.",
        descriptionEn: "Hon Chen Temple is a religious architectural complex on the Perfume River bank, dedicated to Thien Y A Na - a Cham goddess. It represents a unique intersection of Vietnamese and Cham cultures.",
        type: "temple",
        latitude: "16.4180",
        longitude: "107.5350",
        imageUrl: "/attached_assets/dien-hon-chen.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Chùa Thiên Mụ",
        nameEn: "Thien Mu Pagoda",
        description: "Ngôi chùa cổ nhất Huế, được xây dựng năm 1601. Tháp Phước Duyên 7 tầng cao 21m là biểu tượng của Huế. Chùa còn lưu giữ nhiều cổ vật quý như chuông đồng đúc năm 1710 và bia đá khắc thơ của các vua triều Nguyễn.",
        descriptionEn: "The oldest pagoda in Hue, built in 1601. The 21-meter, 7-story Phuoc Duyen tower is Hue's iconic symbol. The pagoda preserves many precious artifacts including a bronze bell cast in 1710 and stone steles with poems by Nguyen Dynasty emperors.",
        type: "temple",
        latitude: "16.4539",
        longitude: "107.5537",
        imageUrl: "/attached_assets/thien-mu.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Phá Tam Giang",
        nameEn: "Tam Giang Lagoon",
        description: "Phá Tam Giang là đầm phá nước lợ lớn nhất Đông Nam Á, dài 68km với diện tích 22.000ha. Nơi đây nổi tiếng với nghề đánh bắt thủy sản truyền thống và cảnh quan thiên nhiên tuyệt đẹp.",
        descriptionEn: "Tam Giang Lagoon is Southeast Asia's largest brackish water lagoon, stretching 68km with an area of 22,000ha. Famous for traditional fishing and beautiful natural landscapes.",
        type: "landscape",
        latitude: "16.5833",
        longitude: "107.4500",
        imageUrl: "/attached_assets/tam-giang.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Bãi biển Lăng Cô",
        nameEn: "Lang Co Beach",
        description: "Bãi biển Lăng Cô được mệnh danh là một trong những vịnh đẹp nhất thế giới, nằm ở phía Bắc đèo Hải Vân. Bãi biển dài 13km với cát trắng mịn, nước trong xanh và khung cảnh núi non hùng vĩ.",
        descriptionEn: "Lang Co Beach is known as one of the world's most beautiful bays, located north of Hai Van Pass. The 13km beach features fine white sand, crystal-clear water, and majestic mountain scenery.",
        type: "landscape",
        latitude: "16.2300",
        longitude: "108.0800",
        imageUrl: "/attached_assets/lang-co.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Núi Bạch Mã",
        nameEn: "Bach Ma Mountain",
        description: "Núi Bạch Mã cao 1450m, là một phần của Vườn Quốc gia Bạch Mã. Nơi đây nổi tiếng với đa dạng sinh học phong phú, các thác nước và di tích kiến trúc thời Pháp thuộc.",
        descriptionEn: "Bach Ma Mountain rises 1450m, part of Bach Ma National Park. Famous for rich biodiversity, waterfalls, and French colonial architectural remnants.",
        type: "landscape",
        latitude: "16.1833",
        longitude: "107.8500",
        imageUrl: "/attached_assets/bach-ma.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Nhà thờ Phủ Cam",
        nameEn: "Phu Cam Cathedral",
        description: "Nhà thờ Phủ Cam được xây dựng năm 1963 theo kiến trúc hiện đại, là một trong những nhà thờ Công giáo lớn nhất miền Trung. Công trình nổi bật với tháp chuông cao 42m và thiết kế độc đáo.",
        descriptionEn: "Phu Cam Cathedral was built in 1963 in modern architectural style, one of Central Vietnam's largest Catholic churches. Notable for its 42m bell tower and unique design.",
        type: "religious",
        latitude: "16.4583",
        longitude: "107.5917",
        imageUrl: "/attached_assets/phu-cam.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Làng hoa giấy Thanh Tiên",
        nameEn: "Thanh Tien Paper Flower Village",
        description: "Làng Thanh Tiên nổi tiếng với nghề làm hoa giấy truyền thống hơn 300 năm tuổi. Các sản phẩm hoa giấy tinh xảo được sử dụng trong trang trí và nghi lễ truyền thống.",
        descriptionEn: "Thanh Tien Village is famous for its 300-year-old traditional paper flower craft. The delicate paper flowers are used in decoration and traditional ceremonies.",
        type: "craft_village",
        latitude: "16.4833",
        longitude: "107.5667",
        imageUrl: "/attached_assets/thanh-tien.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Làng gốm Phước Tích",
        nameEn: "Phuoc Tich Pottery Village",
        description: "Làng gốm Phước Tích có lịch sử hơn 500 năm, nổi tiếng với nghề làm gốm truyền thống. Làng vẫn giữ được nhiều nhà cổ và lò gốm truyền thống, là điểm đến hấp dẫn du khách.",
        descriptionEn: "Phuoc Tich Pottery Village has a 500-year history of traditional pottery making. The village preserves many ancient houses and traditional kilns, attracting tourists.",
        type: "craft_village",
        latitude: "16.5500",
        longitude: "107.6167",
        imageUrl: "/attached_assets/phuoc-tich.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Chùa Từ Hiếu",
        nameEn: "Tu Hieu Pagoda",
        description: "Chùa Từ Hiếu được xây dựng năm 1843, nổi tiếng với kiến trúc truyền thống và khuôn viên yên tĩnh. Chùa còn là nơi tu học của nhiều thiền sư nổi tiếng và là trung tâm Phật giáo quan trọng của Huế.",
        descriptionEn: "Tu Hieu Pagoda was built in 1843, famous for its traditional architecture and peaceful grounds. The pagoda has been home to many renowned Zen masters and is an important Buddhist center in Hue.",
        type: "temple",
        latitude: "16.4417",
        longitude: "107.5583",
        imageUrl: "/attached_assets/tu-hieu.jpg",
        isActive: true
      }
    ];

    // Update resources initialization to match schema
    this.resources = [
      {
        id: this.getNextId(),
        title: "Kiến trúc cung đình Huế",
        titleEn: "Hue Royal Architecture",
        description: "Bộ sưu tập hình ảnh chi tiết về kiến trúc cung đình Huế, từ tổng thể đến các chi tiết trang trí. Kèm theo các bản vẽ kỹ thuật và thông tin về kỹ thuật xây dựng thời Nguyễn.",
        descriptionEn: "Detailed photo collection of Hue royal architecture, from overall views to decorative details. Includes technical drawings and information about Nguyen Dynasty construction techniques.",
        type: "image",
        category: "architecture",
        contentUrl: "https://vietnam.vnanet.vn/vietnamese/kien-truc-co-do-hue-tinh-hoa-nghe-thuat-xay-dung-co-truyen-viet-nam-59451.html",
        thumbnailUrl: "/attached_assets/kien-truc.jpg",
        metadata: {
          format: "images",
          dimensions: "4000x3000",
          year: "2024"
        },
        culturalPeriod: "Nguyen Dynasty",
        historicalContext: "19th Century",
        relatedLocationId: 1,
        tags: ["architecture", "heritage", "nguyen-dynasty"],
        authorInfo: "Heritage Conservation Center",
        sourceInfo: "National Archives",
        languages: ["vi", "en"],
        format: "jpg",
        duration: null,
        fileSize: "10MB",
        dimensions: "4000x3000",
        transcription: null,
        modelFormat: null,
        textureUrls: [],
        previewUrls: [],
        license: "CC BY-NC-SA",
        quality: "4K",
        interactiveData: null,
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Nghệ thuật trang trí cung đình Huế",
        titleEn: "Hue Royal Decorative Arts",
        description: "Tư liệu về nghệ thuật trang trí trong cung đình Huế: các họa tiết hoa văn, chạm khắc gỗ, sơn son thếp vàng. Phân tích ý nghĩa biểu tượng và kỹ thuật thực hiện.",
        descriptionEn: "Documentation of decorative arts in Hue royal palace: patterns, woodcarvings, lacquer and gilding. Analysis of symbolic meanings and execution techniques.",
        type: "document",
        category: "art",
        contentUrl: "https://baotanglichsu.vn/vi/Articles/3087/14967/nghe-thuat-trang-tri-cung-dinh-hue.html",
        thumbnailUrl: "/attached_assets/nghe-thuat.jpg",
        metadata: {
          format: "pdf",
          pages: "120",
          language: "Vietnamese, English",
          author: "PGS.TS. Phan Thanh Hải"
        },
        culturalPeriod: "Nguyen Dynasty",
        historicalContext: "19th Century",
        relatedLocationId: 1,
        tags: ["art", "decoration", "nguyen-dynasty"],
        authorInfo: "PGS.TS. Phan Thanh Hải",
        sourceInfo: "Bao Tang Lich Su",
        languages: ["vi", "en"],
        format: "pdf",
        duration: null,
        fileSize: "5MB",
        dimensions: null,
        transcription: null,
        modelFormat: null,
        textureUrls: [],
        previewUrls: [],
        license: "CC BY-NC-SA",
        quality: null,
        interactiveData: null,
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Nhã nhạc cung đình Huế",
        titleEn: "Hue Royal Court Music",
        description: "Bộ sưu tập âm thanh và video về nhã nhạc cung đình Huế - di sản văn hóa phi vật thể của UNESCO. Bao gồm các bản thu âm truyền thống và biểu diễn hiện đại.",
        descriptionEn: "Audio and video collection of Hue royal court music - UNESCO intangible cultural heritage. Includes traditional recordings and modern performances.",
        type: "audio",
        category: "music",
        contentUrl: "https://nhanhaccungdinhvietnam.com/",
        thumbnailUrl: "/attached_assets/nha-nhac.jpg",
        metadata: {
          format: "mp3, mp4",
          duration: "6 hours",
          quality: "Studio",
          performers: "Nhóm Nhã nhạc Cung đình Huế"
        },
        culturalPeriod: "Nguyen Dynasty",
        historicalContext: "19th-20th Century",
        relatedLocationId: 1,
        tags: ["music", "culture", "unesco"],
        authorInfo: "Nhom Nha Nhac Cung Dinh Hue",
        sourceInfo: "UNESCO",
        languages: ["vi"],
        format: "mp3, mp4",
        duration: "21600",
        fileSize: "500MB",
        dimensions: null,
        transcription: null,
        modelFormat: null,
        textureUrls: [],
        previewUrls: [],
        license: "CC BY-NC-SA",
        quality: "Studio",
        interactiveData: null,
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Kiến trúc di tích Huế",
        titleEn: "Hue Heritage Architecture",
        description: "Bộ sưu tập hình ảnh và tư liệu về kiến trúc các di tích Huế, bao gồm đền, chùa, lăng tẩm và công trình công cộng. Chi tiết về kỹ thuật xây dựng và trang trí thời Nguyễn.",
        descriptionEn: "Collection of images and documents about Hue heritage architecture, including temples, pagodas, tombs and public works. Details about Nguyen Dynasty construction and decoration techniques.",
        type: "document",
        category: "architecture",
        contentUrl: "https://baotanglichsu.vn/vi/Articles/3087/14967/kien-truc-di-tich-hue.html",
        thumbnailUrl: "/attached_assets/architecture.jpg",
```javascript
        metadata: {
          format: "pdf",
          pages: "150",
          language: "Vietnamese, English",
          year: "2024",
          author: "Trung tâm Bảo tồn Di tích Cố đô Huế"
        },
        culturalPeriod: "Nguyen Dynasty",
        historicalContext: "19th Century",
        relatedLocationId: 1,
        tags: ["architecture", "heritage", "nguyen-dynasty"],
        authorInfo: "Heritage Conservation Center",
        sourceInfo: "National Archives",
        languages: ["vi", "en"],
        format: "pdf",
        duration: null,
        fileSize: "10MB",
        dimensions: null,
        transcription: null,
        modelFormat: null,
        textureUrls: [],
        previewUrls: [],
        license: "CC BY-NC-SA",
        quality: null,
        interactiveData: null,
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Lễ hội cung đình Huế",
        titleEn: "Hue Royal Festivals",
        description: "Tài liệu nghiên cứu về các lễ hội và nghi thức cung đình triều Nguyễn, từ tế Nam Giao đến lễ Đại triều. Bao gồm âm nhạc, trang phục và nghi thức chi tiết.",
        descriptionEn: "Research documents about Nguyen Dynasty court festivals and rituals, from Nam Giao ceremony to Great Court ceremony. Includes music, costumes and detailed protocols.",
        type: "document",
        category: "culture",
        contentUrl: "https://huongxuaonline.com/vi/festivals/le-hoi-cung-dinh-hue",
        thumbnailUrl: "/attached_assets/festival.jpg",
        metadata: {
          format: "pdf",
          pages: "200",
          language: "Vietnamese, English",
          year: "2024",
          publisher: "NXB Thuận Hóa"
        },
        culturalPeriod: "Nguyen Dynasty",
        historicalContext: "19th Century",
        relatedLocationId: 1,
        tags: ["festival", "culture", "nguyen-dynasty"],
        authorInfo: "NXB Thuan Hoa",
        sourceInfo: "Huong Xua Online",
        languages: ["vi", "en"],
        format: "pdf",
        duration: null,
        fileSize: "15MB",
        dimensions: null,
        transcription: null,
        modelFormat: null,
        textureUrls: [],
        previewUrls: [],
        license: "CC BY-NC-SA",
        quality: null,
        interactiveData: null,
        createdAt: new Date()
      }
    ];

    // Initialize Digital Library Categories
    this.digitalLibraryCategories = [
      {
        id: this.getNextId(),
        name: "Di tích lịch sử",
        nameEn: "Historical Sites",
        description: "Các di tích lịch sử và văn hóa Huế",
        descriptionEn: "Historical and cultural sites of Hue",
        parentId: null,
        iconUrl: null,
        type: "heritage",
        sortOrder: "0"
      },
      {
        id: this.getNextId(),
        name: "Âm nhạc cung đình",
        nameEn: "Royal Court Music",
        description: "Âm nhạc truyền thống và nhã nhạc cung đình Huế",
        descriptionEn: "Traditional and royal court music of Hue",
        parentId: null,
        iconUrl: null,
        type: "performing_arts",
        sortOrder: "1"
      },
      {
        id: this.getNextId(),
        name: "Cảnh quan thiên nhiên",
        nameEn: "Natural Landscapes",
        description: "Cảnh quan thiên nhiên của Huế",
        descriptionEn: "Natural landscapes of Hue",
        parentId: null,
        iconUrl: null,
        type: "landscape",
        sortOrder: "2"
      },
      {
        id: this.getNextId(),
        name: "Làng nghề truyền thống",
        nameEn: "Traditional Craft Villages",
        description: "Các làng nghề truyền thống của Huế",
        descriptionEn: "Traditional craft villages of Hue",
        parentId: null,
        iconUrl: null,
        type: "craft_village",
        sortOrder: "3"
      },
      {
        id: this.getNextId(),
        name: "Di sản phi vật thể",
        nameEn: "Intangible Heritage",
        description: "Di sản văn hóa phi vật thể của Huế",
        descriptionEn: "Intangible cultural heritage of Hue",
        parentId: null,
        iconUrl: null,
        type: "intangible_heritage",
        sortOrder: "4"
      }
    ];

    // Initialize Digital Library Resources
    this.digitalLibraryResources = [
      {
        id: this.getNextId(),
        title: "Hoàng thành Huế - Kiệt tác kiến trúc cung đình nhà Nguyễn",
        titleEn: "Hue Imperial City - Masterpiece of Nguyen Dynasty Palace Architecture",
        description: "Hoàng thành Huế là quần thể di tích cung đình rộng hơn 500 hecta, nơi hoàng đế triều Nguyễn sinh sống và làm việc. Được xây dựng từ năm 1805 dưới thời vua Gia Long, hoàn thiện năm 1832 dưới thời vua Minh Mạng. Bao gồm Hoàng thành và Tử cấm thành với hơn 100 công trình kiến trúc đặc sắc.",
        descriptionEn: "A 500-hectare complex where Nguyen Dynasty emperors lived and worked. Built from 1805 under Emperor Gia Long, completed in 1832 under Emperor Minh Mang. Features the Citadel and Imperial City with over 100 remarkable architectural works.",
        type: "document",
        category: "historical_sites",
        contentUrl: "/attached_assets/hoang-thanh-hue.docx",
        thumbnailUrl: "/attached_assets/hoang-thanh.jpg",
        author: "Trung tâm Bảo tồn Di tích Cố đô Huế",
        source: "Trung tâm Bảo tồn Di tích Cố đô Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "19th Century",
        latitude: "16.4698",
        longitude: "107.5796",
        keywords: ["palace", "architecture", "heritage", "nguyen-dynasty"],
        languages: ["vi", "en"],
        metadata: {
          format: "docx",
          pages: "25",
          language: "Vietnamese, English",
          year: "2024",
          author: "Trung tâm Bảo tồn Di tích Cố đô Huế"
        },
        pageCount: "25",
        fileFormat: "docx", 
        fileSize: "2048",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        quality: "high",
        duration: null,
        dimensions: null,
        transcription: null,
        modelFormat: null,
        textureUrls: [],
        previewUrls: [],
        license: "CC BY-NC-SA",
        interactiveData: null
      },
      {
        id: this.getNextId(),
        title: "Chùa Thiên Mụ - Biểu tượng linh thiêng của cố đô Huế",
        titleEn: "Thien Mu Pagoda - Sacred Symbol of Ancient Hue Capital",
        description: `Ngôi chùa cổ nhất Huế, được xây dựng năm 1601. Tháp Phước Duyên 7 tầng cao 21m là biểu tượng của Huế. Chùa còn lưu giữ nhiều cổ vật quý như chuông đồng đúc năm 1710 và bia đá khắc thơ của các vua triều Nguyễn.`,
        descriptionEn: "The oldest pagoda in Hue, built in 1601. The 21-meter, 7-story Phuoc Duyen tower is Hue's iconic symbol. The pagoda preserves many precious artifacts including a bronze bell cast in 1710 and stone steles with poems by Nguyen Dynasty emperors.",
        type: "document",
        category: "historical_sites",
        contentUrl: "/attached_assets/CHÙA THIÊN MỤ – BIỂU TƯỢNG LINH THIÊNG CỦA CỐ ĐÔ HUẾ.docx",
        thumbnailUrl: "/attached_assets/thien-mu.jpg",
        author: "Trung tâm Bảo tồn Di tích Cố đô Huế",
        source: "Trung tâm Bảo tồn Di tích Cố đô Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "17th Century",
        latitude: "16.4539",
        longitude: "107.5537",
        keywords: ["pagoda", "buddhism", "heritage", "architecture"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "20",
        fileFormat: "docx",
        fileSize: "2048",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Điện Hòn Chén - Nơi giao thoa văn hóa Việt-Chăm",
        titleEn: "Hon Chen Temple - Vietnamese-Cham Cultural Intersection",
        description: `Điện Hòn Chén là quần thể kiến trúc tôn giáo độc đáo bên bờ sông Hương, thờ Thiên Y A Na - nữ thần của người Chăm. Công trình thể hiện sự giao thoa văn hóa đặc sắc giữa người Việt và Chăm.`,
        descriptionEn: "Hon Chen Temple is a unique religious architectural complex on the Perfume River, dedicated to Thien Y A Na - a Cham goddess. The structure represents a remarkable cultural intersection between Vietnamese and Cham peoples.",
        type: "document",
        category: "historical_sites",
        contentUrl: "/attached_assets/ĐIỆN HÒN CHÉN – THÁNH TÍCH LINH THIÊNG BÊN SÔNG HƯƠNG.docx",
        thumbnailUrl: "/attached_assets/hon-chen.jpg",
        author: "PGS.TS. Phan Thanh Hải",
        source: "Trung tâm Bảo tồn Di tích Cố đô Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "19th Century",
        latitude: "16.4180",
        longitude: "107.5350",
        keywords: ["temple", "religion", "culture", "cham"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "15",
        fileFormat: "docx",
        fileSize: "1536",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Sông Hương & Cầu Tràng Tiền - Biểu tượng của xứ Huế thơ mộng",
        titleEn: "Perfume River & Trang Tien Bridge - Symbols of Poetic Hue",
        description: "Sông Hương và Cầu Tràng Tiền là biểu tượng của vẻ đẹp thơ mộng xứ Huế. Dòng sông uốn lượn như dải lụa xanh, cầu Tràng Tiền sáu vòm là công trình kiến trúc độc đáo đầu thế kỷ 20.",
        descriptionEn: "The Perfume River and Trang Tien Bridge symbolize Hue's poetic beauty. The river winds like a silk ribbon, while the six-arch Trang Tien Bridge is a unique architectural work from the early 20th century.",
        type: "document",
        category: "landscapes",
        contentUrl: "/documents/song-huong.pdf",
        thumbnailUrl: "/attached_assets/song-huong.jpg",
        author: "TS. Nguyễn Văn Nam",
        source: "Viện Nghiên cứu Văn hóa Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Contemporary",
        period: "20th Century-Present",
        latitude: "16.4690",
        longitude: "107.5880",
        keywords: ["river", "bridge", "landscape", "architecture"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "30",
        fileFormat: "pdf",
        fileSize: "3072",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Làng nghề nón lá Huế - Di sản văn hóa xứ Cố đô",
        titleEn: "Hue Conical Hat Craft Village - Cultural Heritage of the Ancient Capital",
        description: "Làng nghề nón lá Huế là nơi lưu giữ và phát triển nghề thủ công truyền thống làm nón lá. Mỗi chiếc nón lá là sự kết hợp tinh tế của kỹ thuật và nghệ thuật, mang đậm bản sắc văn hóa Huế.",
        descriptionEn: "Hue's conical hat craft village preserves and develops the traditional craft of making leaf hats. Each hat is a delicate combination of technique and art, deeply reflecting Hue's cultural identity.",
        type: "document",
        category: "craft_villages",
        contentUrl: "/attached_assets/Nghề Nón Lá Huế - Di Sản Văn Hóa Xứ Cố Đô.docx",
        thumbnailUrl: "/attached_assets/non-la.jpg",
        author: "ThS. Lê Thị Hương",
        source: "Bảo tàng Dân tộc học",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Traditional",
        period: "Traditional-Contemporary",
        latitude: "16.4580",
        longitude: "107.5750",
        keywords: ["craft", "tradition", "culture", "heritage"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "25",
        fileFormat: "docx",
        fileSize: "2560",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Ca Huế - Tinh hoa âm nhạc xứ Kinh kỳ",
        titleEn: "Hue Classical Music - The Essence of Imperial City Music",
        description: "Ca Huế là một thể loại âm nhạc truyền thống độc đáo của xứ Huế, kết hợp giữa các làn điệu dân ca và nhã nhạc cung đình. Nghệ thuật này phản ánh đời sống tinh thần phong phú và tâm hồn tao nhã của người dân Huế.",
        descriptionEn: "Hue Classical Music is a unique traditional music genre of Hue, combining folk melodies and royal court music. This art form reflects the rich spiritual life and refined soul of Hue people.",
        type: "audio",
        category: "intangible_heritage",
        contentUrl: "/attached_assets/Ca Huế – Tinh Hoa Âm Nhạc Xứ Kinh Kỳ.docx",
        thumbnailUrl: "/attached_assets/ca-hue.jpg",
        author: "Viện Âm nhạc Huế",
        source: "Nghiên cứu Văn hóa Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "19-20th Century",
        keywords: ["music", "tradition", "culture", "heritage"],
        languages: ["vi", "en"],
        metadata: {
          instruments: ["đàn tranh", "đàn nguyệt", "đàn tỳ bà", "sáo trúc"],
          performers: "Traditional musicians and vocalists",
          occasion: "Traditional festivals and ceremonies"
        },
        duration: "3600",
        quality: "High",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize Digital Library Categories
    this.digitalLibraryCategories = [
      {
        id: this.getNextId(),
        name: "Di tích lịch sử",
        nameEn: "Historical Sites",
        description: "Các di tích lịch sử và văn hóa Huế",
        descriptionEn: "Historical and cultural sites of Hue",
        parentId: null,
        iconUrl: null,
        type: "heritage",
        sortOrder: "0"
      },
      {
        id: this.getNextId(),
        name: "Âm nhạc cung đình",
        nameEn: "Royal Court Music",
        description: "Âm nhạc truyền thống và nhã nhạc cung đình Huế",
        descriptionEn: "Traditional and royalcourt music of Hue",
        parentId: null,
        iconUrl: null,
        type: "performing_arts",
        sortOrder: "1"
      },
      {
        id: this.getNextId(),
        name: "Cảnh quan thiên nhiên",
        nameEn: "Natural Landscapes",
        description: "Cảnh quan thiên nhiên của Huế",
        descriptionEn: "Natural landscapes of Hue",
        parentId: null,
        iconUrl: null,
        type: "landscape",
        sortOrder: "2"
      },
      {
        id: this.getNextId(),
        name: "Làng nghề truyền thống",
        nameEn: "Traditional Craft Villages",
        description: "Các làng nghề truyền thống của Huế",
        descriptionEn: "Traditional craft villages of Hue",
        parentId: null,
        iconUrl: null,
        type: "craft_village",
        sortOrder: "3"
      },
      {
        id: this.getNextId(),
        name: "Di sản phi vật thể",
        nameEn: "Intangible Heritage",
        description: "Di sản văn hóa phi vật thể của Huế",
        descriptionEn: "Intangible cultural heritage of Hue",
        parentId: null,
        iconUrl: null,
        type: "intangible_heritage",
        sortOrder: "4"
      }
    ];

    // Initialize Digital Library Resources
    this.digitalLibraryResources = [
      {
        id: this.getNextId(),
        title: "Chùa Thiên Mụ – Biểu tượng linh thiêng của cố đô Huế",
        titleEn: "Thien Mu Pagoda - Sacred Symbol of Ancient Hue Capital",
        description: "Ngôi chùa cổ nhất Huế, được xây dựng năm 1601. Tháp Phước Duyên 7 tầng cao 21m là biểu tượng của Huế. Chùa còn lưu giữ nhiều cổ vật quý như chuông đồng đúc năm 1710 và bia đá khắc thơ của các vua triều Nguyễn.",
        descriptionEn: "The oldest pagoda in Hue, built in 1601. The 21-meter, 7-story Phuoc Duyen tower is Hue's iconic symbol. The pagoda preserves many precious artifacts including a bronze bell cast in 1710 and stone steles with poems by Nguyen Dynasty emperors.",
        type: "document",
        category: "heritage_site",
        contentUrl: "/attached_assets/CHÙA THIÊN MỤ – BIỂU TƯỢNG LINH THIÊNG CỦA CỐ ĐÔ HUẾ.docx",
        thumbnailUrl: "/attached_assets/thien-mu.jpg",
        author: "Trung tâm Bảo tồn Di tích Cố đô Huế",
        source: "Trung tâm Bảo tồn Di tích Cố đô Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "17-20th Century",
        keywords: ["pagoda", "buddhism", "heritage", "architecture"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "15",
        fileFormat: "docx",
        fileSize: "2048",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Ca Huế - Tinh hoa âm nhạc xứ Kinh kỳ",
        titleEn: "Hue Classical Music - The Essence of Imperial City Music",
        description: "Ca Huế là một thể loại âm nhạc truyền thống độc đáo của xứ Huế, kết hợp giữa các làn điệu dân ca và nhã nhạc cung đình. Nghệ thuật này phản ánh đời sống tinh thần phong phú và tâm hồn tao nhã của người dân Huế.",
        descriptionEn: "Hue Classical Music is a unique traditional music genre of Hue, combining folk melodies and royal court music. This art form reflects the rich spiritual life and refined soul of Hue people.",
        type: "audio",
        category: "performing_arts",
        contentUrl: "/attached_assets/Ca Huế – Tinh Hoa Âm Nhạc Xứ Kinh Kỳ.docx",
        thumbnailUrl: "/attached_assets/ca-hue.jpg",
        author: "Viện Âm nhạc Huế",
        source: "Nghiên cứu Văn hóa Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "19-20th Century",
        keywords: ["music", "tradition", "culture"],
        languages: ["vi", "en"],
        metadata: {
          instruments: ["đàn tranh", "đàn nguyệt", "đàn tỳ bà", "sáo trúc"],
          performers: "Traditional musicians and vocalists",
          occasion: "Traditional festivals and ceremonies"
        },
        duration: "3600",
        quality: "High",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Giọng Huế - Âm Điệu Tinh Tế của Xứ Kinh Kỳ",
        titleEn: "Hue Accent - The Subtle Melody of the Imperial City",
        description: "Giọng Huế được biết đến với âm điệu trầm bổng đặc trưng, là sự kết hợp hài hòa giữa ngôn ngữ và âm nhạc. Bài viết nghiên cứu về đặc điểm ngữ âm, từ vựng và văn hóa ẩn chứa trong cách nói của người Huế.",
        descriptionEn: "The Hue accent is known for its distinctive tonal patterns, harmoniously blending language and music. This research explores the phonetic features, vocabulary, and cultural elements embedded in the Hue people's way of speaking.",
        type: "document",
        category: "performing_arts",
        contentUrl: "/documents/giong-hue.pdf",
        thumbnailUrl: "/assets/giong-hue.jpg",
        author: "TS. Nguyễn Thị Hà",
        source: "Viện Nghiên cứu Văn hóa Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "Contemporary",
        keywords: ["language", "culture", "tradition", "communication"],
        languages: ["vi", "en"],
        metadata: {
          format: "PDF",
          pages: "25",
          references: "15 academic sources"
        },
        pageCount: "25",
        fileFormat: "pdf",
        fileSize: "2048",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Điện Hòn Chén - Nơi Giao Thoa Văn Hóa Việt-Chăm",
        titleEn: "Hon Chen Temple - Vietnamese-Cham Cultural Intersection",
        description: "Điện Hòn Chén là quần thể kiến trúc tôn giáo độc đáo bên bờ sông Hương, thờ Thiên Y A Na - nữ thần của người Chăm. Công trình thể hiện sự giao thoa văn hóa đặc sắc giữa người Việt và Chăm.",
        descriptionEn: "Hon Chen Temple is a unique religious architectural complex on the Perfume River, dedicated to Thien Y A Na - a Cham goddess. The structure represents a remarkable cultural intersection between Vietnamese and Cham peoples.",
        type: "document",
        category: "historical_sites",
        contentUrl: "/documents/dien-hon-chen.pdf",
        thumbnailUrl: "/assets/hon-chen.jpg",
        author: "PGS.TS. Phan Thanh Hải",
        source: "Trung tâm Bảo tồn Di tích Cố đô Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "19th Century",
        keywords: ["temple", "religion", "architecture", "cultural-fusion"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "30",
        fileFormat: "pdf",
        fileSize: "3072",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Nghề Dệt Zèng - Di Sản Văn Hóa Phi Vật Thể",
        titleEn: "Zeng Weaving - Intangible Cultural Heritage",
        description: "Nghề dệt Zèng (thổ cẩm) là một trong những nghề thủ công truyền thống đặc sắc của người dân Huế. Bài viết giới thiệu về kỹ thuật, họa tiết và ý nghĩa văn hóa của nghề dệt Zèng.",
        descriptionEn: "Zeng weaving is one of Hue's distinctive traditional crafts. This article introduces the techniques, patterns, and cultural significance of Zeng weaving.",
        type: "document",
        category: "traditional_crafts",
        contentUrl: "/documents/nghe-det-zeng.pdf",
        thumbnailUrl: "/assets/det-zeng.jpg",
        author: "ThS. Trần Thị Minh",
        source: "Bảo tàng Văn hóa Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Contemporary",
        period: "Traditional-Contemporary",
        keywords: ["craft", "weaving", "tradition", "culture"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "20",
        fileFormat: "pdf",
        fileSize: "2560",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Ẩm Thực Cung Đình Huế - Tinh Hoa Ẩm Thực Việt",
        titleEn: "Hue Royal Cuisine - The Essence of Vietnamese Gastronomy",
        description: "Ẩm thực cung đình Huế là sự kết tinh của văn hóa ẩm thực Việt Nam, với những món ăn tinh tế được chế biến công phu. Tài liệu giới thiệu về lịch sử, nghệ thuật chế biến và thưởng thức ẩm thực cung đình Huế.",
        descriptionEn: "Hue royal cuisine represents the pinnacle of Vietnamese culinary culture, featuring sophisticated dishes prepared with elaborate techniques. This document introduces the history,culinary arts, and appreciation of Hue royal cuisine.",
        type: "document",
        category: "culinary",
        contentUrl: "/documents/am-thuc-cung-dinh.pdf",
        thumbnailUrl: "/assets/am-thuc.jpg",
        author: "TS. Hồ Đắc Thiện Anh",
        source: "Viện Nghiên cứu Ẩm thực Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "19th Century-Contemporary",
        keywords: ["cuisine", "culture", "royal", "tradition"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "40",
        fileFormat: "pdf",
        fileSize: "4096",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Bài Chòi - Nghệ Thuật Dân Gian Độc Đáo",
        titleEn: "Bai Choi - Unique Folk Performance Art",
        description: "Bài chòi là loại hình nghệ thuật dân gian độc đáo kết hợp giữa trò chơi dân gian và âm nhạc. Tài liệu nghiên cứu về lịch sử, quy tắc và giá trị văn hóa của bài chòi trong đời sống người dân Huế.",
        descriptionEn: "Bai Choi is a unique folk art combining traditional games and music. This research explores the history, rules, and cultural value of Bai Choi in Hue people's lives.",
        type: "document",
        category: "performing_arts",
        contentUrl: "/documents/bai-choi.pdf",
        thumbnailUrl: "/assets/bai-choi.jpg",
        author: "PGS.TS. Lê Thị Thanh Xuân",
        source: "Trung tâm Bảo tồn Văn hóa Dân gian",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Traditional",
        period: "Traditional-Contemporary",
        keywords: ["folk-art", "game", "music", "tradition"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "35",
        fileFormat: "pdf",
        fileSize: "3584",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];


    // Initialize Digital Library Categories
    this.digitalLibraryCategories = [
      {
        id: this.getNextId(),
        name: "Di tích lịch sử",
        nameEn: "Historical Sites",
        description: "Các di tích lịch sử và văn hóa Huế",
        descriptionEn: "Historical and cultural sites of Hue",
        parentId: null,
        iconUrl: null,
        type: "heritage",
        sortOrder: "0"
      },
      {
        id: this.getNextId(),
        name: "Âm nhạc cung đình",
        nameEn: "Royal Court Music",
        description: "Âm nhạc truyền thống và nhã nhạc cung đình Huế",
        descriptionEn: "Traditional and royalcourt music of Hue",
        parentId: null,
        iconUrl: null,
        type: "performing_arts",
        sortOrder: "1"
      },
      {
        id: this.getNextId(),
        name: "Cảnh quan thiên nhiên",
        nameEn: "Natural Landscapes",
        description: "Cảnh quan thiên nhiên của Huế",
        descriptionEn: "Natural landscapes of Hue",
        parentId: null,
        iconUrl: null,
        type: "landscape",
        sortOrder: "2"
      },
      {
        id: this.getNextId(),
        name: "Làng nghề truyền thống",
        nameEn: "Traditional Craft Villages",
        description: "Các làng nghề truyền thống của Huế",
        descriptionEn: "Traditional craft villages of Hue",
        parentId: null,
        iconUrl: null,
        type: "craft_village",
        sortOrder: "3"
      },
      {
        id: this.getNextId(),
        name: "Di sản phi vật thể",
        nameEn: "Intangible Heritage",
        description: "Di sản văn hóa phi vật thể của Huế",
        descriptionEn: "Intangible cultural heritage of Hue",
        parentId: null,
        iconUrl: null,
        type: "intangible_heritage",
        sortOrder: "4"
      }
    ];

    // Initialize Digital Library Resources
    this.digitalLibraryResources = [
      {
        id: this.getNextId(),
        title: "Chùa Thiên Mụ – Biểu tượng linh thiêng của cố đô Huế",
        titleEn: "Thien Mu Pagoda - Sacred Symbol of Ancient Hue Capital",
        description: "Ngôi chùa cổ nhất Huế, được xây dựng năm 1601. Tháp Phước Duyên 7 tầng cao 21m là biểu tượng của Huế. Chùa còn lưu giữ nhiều cổ vật quý như chuông đồng đúc năm 1710 và bia đá khắc thơ của các vua triều Nguyễn.",
        descriptionEn: "The oldest pagoda in Hue, built in 1601. The 21-meter, 7-story Phuoc Duyen tower is Hue's iconic symbol. The pagoda preserves many precious artifacts including a bronze bell cast in 1710 and stone steles with poems by Nguyen Dynasty emperors.",
        type: "document",
        category: "heritage_site",
        contentUrl: "/attached_assets/CHÙA THIÊN MỤ – BIỂU TƯỢNG LINH THIÊNG CỦA CỐ ĐÔ HUẾ.docx",
        thumbnailUrl: "/attached_assets/thien-mu.jpg",
        author: "Trung tâm Bảo tồn Di tích Cố đô Huế",
        source: "Trung tâm Bảo tồn Di tích Cố đô Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "17-20th Century",
        keywords: ["pagoda", "buddhism", "heritage", "architecture"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "15",
        fileFormat: "docx",
        fileSize: "2048",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Ca Huế - Tinh hoa âm nhạc xứ Kinh kỳ",
        titleEn: "Hue Classical Music - The Essence of Imperial City Music",
        description: "Ca Huế là một thể loại âm nhạc truyền thống độc đáo của xứ Huế, kết hợp giữa các làn điệu dân ca và nhã nhạc cung đình. Nghệ thuật này phản ánh đời sống tinh thần phong phú và tâm hồn tao nhã của người dân Huế.",
        descriptionEn: "Hue Classical Music is a unique traditional music genre of Hue, combining folk melodies and royal court music. This art form reflects the rich spiritual life and refined soul of Hue people.",
        type: "audio",
        category: "performing_arts",
        contentUrl: "/attached_assets/Ca Huế – Tinh Hoa Âm Nhạc Xứ Kinh Kỳ.docx",
        thumbnailUrl: "/attached_assets/ca-hue.jpg",
        author: "Viện Âm nhạc Huế",
        source: "Nghiên cứu Văn hóa Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "19-20th Century",
        keywords: ["music", "tradition", "culture"],
        languages: ["vi", "en"],
        metadata: {
          instruments: ["đàn tranh", "đàn nguyệt", "đàn tỳ bà", "sáo trúc"],
          performers: "Traditional musicians and vocalists",
          occasion: "Traditional festivals and ceremonies"
        },
        duration: "3600",
        quality: "High",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Giọng Huế - Âm Điệu Tinh Tế của Xứ Kinh Kỳ",
        titleEn: "Hue Accent - The Subtle Melody of the Imperial City",
        description: "Giọng Huế được biết đến với âm điệu trầm bổng đặc trưng, là sự kết hợp hài hòa giữa ngôn ngữ và âm nhạc. Bài viết nghiên cứu về đặc điểm ngữ âm, từ vựng và văn hóa ẩn chứa trong cách nói của người Huế.",
        descriptionEn: "The Hue accent is known for its distinctive tonal patterns, harmoniously blending language and music. This research explores the phonetic features, vocabulary, and cultural elements embedded in the Hue people's way of speaking.",
        type: "document",
        category: "performing_arts",
        contentUrl: "/documents/giong-hue.pdf",
        thumbnailUrl: "/assets/giong-hue.jpg",
        author: "TS. Nguyễn Thị Hà",
        source: "Viện Nghiên cứu Văn hóa Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "Contemporary",
        keywords: ["language", "culture", "tradition", "communication"],
        languages: ["vi", "en"],
        metadata: {
          format: "PDF",
          pages: "25",
          references: "15 academic sources"
        },
        pageCount: "25",
        fileFormat: "pdf",
        fileSize: "2048",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Điện Hòn Chén - Nơi Giao Thoa Văn Hóa Việt-Chăm",
        titleEn: "Hon Chen Temple - Vietnamese-Cham Cultural Intersection",
        description: "Điện Hòn Chén là quần thể kiến trúc tôn giáo độc đáo bên bờ sông Hương, thờ Thiên Y A Na - nữ thần của người Chăm. Công trình thể hiện sự giao thoa văn hóa đặc sắc giữa người Việt và Chăm.",
        descriptionEn: "Hon Chen Temple is a unique religious architectural complex on the Perfume River, dedicated to Thien Y A Na - a Cham goddess. The structure represents a remarkable cultural intersection between Vietnamese and Cham peoples.",
        type: "document",
        category: "historical_sites",
        contentUrl: "/documents/dien-hon-chen.pdf",
        thumbnailUrl: "/assets/hon-chen.jpg",
        author: "PGS.TS. Phan Thanh Hải",
        source: "Trung tâm Bảo tồn Di tích Cố đô Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "19th Century",
        keywords: ["temple", "religion", "architecture", "cultural-fusion"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "30",
        fileFormat: "pdf",
        fileSize: "3072",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Nghề Dệt Zèng - Di Sản Văn Hóa Phi Vật Thể",
        titleEn: "Zeng Weaving - Intangible Cultural Heritage",
        description: "Nghề dệt Zèng (thổ cẩm) là một trong những nghề thủ công truyền thống đặc sắc của người dân Huế. Bài viết giới thiệu về kỹ thuật, họa tiết và ý nghĩa văn hóa của nghề dệt Zèng.",
        descriptionEn: "Zeng weaving is one of Hue's distinctive traditional crafts. This article introduces the techniques, patterns, and cultural significance of Zeng weaving.",
        type: "document",
        category: "traditional_crafts",
        contentUrl: "/documents/nghe-det-zeng.pdf",
        thumbnailUrl: "/assets/det-zeng.jpg",
        author: "ThS. Trần Thị Minh",
        source: "Bảo tàng Văn hóa Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Contemporary",
        period: "Traditional-Contemporary",
        keywords: ["craft", "weaving", "tradition", "culture"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "20",
        fileFormat: "pdf",
        fileSize: "2560",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Ẩm Thực Cung Đình Huế - Tinh Hoa Ẩm Thực Việt",
        titleEn: "Hue Royal Cuisine - The Essence of Vietnamese Gastronomy",
        description: "Ẩm thực cung đình Huế là sự kết tinh của văn hóa ẩm thực Việt Nam, với những món ăn tinh tế được chế biến công phu. Tài liệu giới thiệu về lịch sử, nghệ thuật chế biến và thưởng thức ẩm thực cung đình Huế.",
        descriptionEn: "Hue royal cuisine represents the pinnacle of Vietnamese culinary culture, featuring sophisticated dishes prepared with elaborate techniques. This document introduces the history,culinary arts, and appreciation of Hue royal cuisine.",
        type: "document",
        category: "culinary",
        contentUrl: "/documents/am-thuc-cung-dinh.pdf",
        thumbnailUrl: "/assets/am-thuc.jpg",
        author: "TS. Hồ Đắc Thiện Anh",
        source: "Viện Nghiên cứu Ẩm thực Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "19th Century-Contemporary",
        keywords: ["cuisine", "culture", "royal", "tradition"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "40",
        fileFormat: "pdf",
        fileSize: "4096",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Bài Chòi - Nghệ Thuật Dân Gian Độc Đáo",
        titleEn: "Bai Choi - Unique Folk Performance Art",
        description: "Bài chòi là loại hình nghệ thuật dân gian độc đáo kết hợp giữa trò chơi dân gian và âm nhạc. Tài liệu nghiên cứu về lịch sử, quy tắc và giá trị văn hóa của bài chòi trong đời sống người dân Huế.",
        descriptionEn: "Bai Choi is a unique folk art combining traditional games and music. This research explores the history, rules, and cultural value of Bai Choi in Hue people's lives.",
        type: "document",
        category: "performing_arts",
        contentUrl: "/documents/bai-choi.pdf",
        thumbnailUrl: "/assets/bai-choi.jpg",
        author: "PGS.TS. Lê Thị Thanh Xuân",
        source: "Trung tâm Bảo tồn Văn hóa Dân gian",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Traditional",
        period: "Traditional-Contemporary",
        keywords: ["folk-art", "game", "music", "tradition"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "35",
        fileFormat: "pdf",
        fileSize: "3584",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize Digital Library Categories
    this.digitalLibraryCategories = [
      {
        id: this.getNextId(),
        name: "Di tích lịch sử",
        nameEn: "Historical Sites",
        description: "Các di tích lịch sử và văn hóa Huế",
        descriptionEn: "Historical and cultural sites of Hue",
        parentId: null,
        iconUrl: null,
        type: "heritage",
        sortOrder: "0"
      },
      {
        id: this.getNextId(),
        name: "Âm nhạc cung đình",
        nameEn: "Royal Court Music",
        description: "Âm nhạc truyền thống và nhã nhạc cung đình Huế",
        descriptionEn: "Traditional and royalcourt music of Hue",
        parentId: null,
        iconUrl: null,
        type: "performing_arts",
        sortOrder: "1"
      },
      {
        id: this.getNextId(),
        name: "Cảnh quan thiên nhiên",
        nameEn: "Natural Landscapes",
        description: "Cảnh quan thiên nhiên của Huế",
        descriptionEn: "Natural landscapes of Hue",
        parentId: null,
        iconUrl: null,
        type: "landscape",
        sortOrder: "2"
      },
      {
        id: this.getNextId(),
        name: "Làng nghề truyền thống",
        nameEn: "Traditional Craft Villages",
        description: "Các làng nghề truyền thống của Huế",
        descriptionEn: "Traditional craft villages of Hue",
        parentId: null,
        iconUrl: null,
        type: "craft_village",
        sortOrder: "3"
      },
      {
        id: this.getNextId(),
        name: "Di sản phi vật thể",
        nameEn: "Intangible Heritage",
        description: "Di sản văn hóa phi vật thể của Huế",
        descriptionEn: "Intangible cultural heritage of Hue",
        parentId: null,
        iconUrl: null,
        type: "intangible_heritage",
        sortOrder: "4"
      }
    ];

    // Initialize Digital Library Resources
    this.digitalLibraryResources = [
      {
        id: this.getNextId(),
        title: "Chùa Thiên Mụ – Biểu tượng linh thiêng của cố đô Huế",
        titleEn: "Thien Mu Pagoda - Sacred Symbol of Ancient Hue Capital",
        description: "Ngôi chùa cổ nhất Huế, được xây dựng năm 1601. Tháp Phước Duyên 7 tầng cao 21m là biểu tượng của Huế. Chùa còn lưu giữ nhiều cổ vật quý như chuông đồng đúc năm 1710 và bia đá khắc thơ của các vua triều Nguyễn.",
        descriptionEn: "The oldest pagoda in Hue, built in 1601. The 21-meter, 7-story Phuoc Duyen tower is Hue's iconic symbol. The pagoda preserves many precious artifacts including a bronze bell cast in 1710 and stone steles with poems by Nguyen Dynasty emperors.",
        type: "document",
        category: "heritage_site",
        contentUrl: "/attached_assets/CHÙA THIÊN MỤ – BIỂU TƯỢNG LINH THIÊNG CỦA CỐ ĐÔ HUẾ.docx",
        thumbnailUrl: "/attached_assets/thien-mu.jpg",
        author: "Trung tâm Bảo tồn Di tích Cố đô Huế",
        source: "Trung tâm Bảo tồn Di tích Cố đô Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "17-20th Century",
        keywords: ["pagoda", "buddhism", "heritage", "architecture"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "15",
        fileFormat: "docx",
        fileSize: "2048",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Ca Huế - Tinh hoa âm nhạc xứ Kinh kỳ",
        titleEn: "Hue Classical Music - The Essence of Imperial City Music",
        description: "Ca Huế là một thể loại âm nhạc truyền thống độc đáo của xứ Huế, kết hợp giữa các làn điệu dân ca và nhã nhạc cung đình. Nghệ thuật này phản ánh đời sống tinh thần phong phú và tâm hồn tao nhã của người dân Huế.",
        descriptionEn: "Hue Classical Music is a unique traditional music genre of Hue, combining folk melodies and royal court music. This art form reflects the rich spiritual life and refined soul of Hue people.",
        type: "audio",
        category: "performing_arts",
        contentUrl: "/attached_assets/Ca Huế – Tinh Hoa Âm Nhạc Xứ Kinh Kỳ.docx",
        thumbnailUrl: "/attached_assets/ca-hue.jpg",
        author: "Viện Âm nhạc Huế",
        source: "Nghiên cứu Văn hóa Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "19-20th Century",
        keywords: ["music", "tradition", "culture"],
        languages: ["vi", "en"],
        metadata: {
          instruments: ["đàn tranh", "đàn nguyệt", "đàn tỳ bà", "sáo trúc"],
          performers: "Traditional musicians and vocalists",
          occasion: "Traditional festivals and ceremonies"
        },
        duration: "3600",
        quality: "High",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Giọng Huế - Âm Điệu Tinh Tế của Xứ Kinh Kỳ",
        titleEn: "Hue Accent - The Subtle Melody of the Imperial City",
        description: "Giọng Huế được biết đến với âm điệu trầm bổng đặc trưng, là sự kết hợp hài hòa giữa ngôn ngữ và âm nhạc. Bài viết nghiên cứu về đặc điểm ngữ âm, từ vựng và văn hóa ẩn chứa trong cách nói của người Huế.",
        descriptionEn: "The Hue accent is known for its distinctive tonal patterns, harmoniously blending language and music. This research explores the phonetic features, vocabulary, and cultural elements embedded in the Hue people's way of speaking.",
        type: "document",
        category: "performing_arts",
        contentUrl: "/documents/giong-hue.pdf",
        thumbnailUrl: "/assets/giong-hue.jpg",
        author: "TS. Nguyễn Thị Hà",
        source: "Viện Nghiên cứu Văn hóa Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "Contemporary",
        keywords: ["language", "culture", "tradition", "communication"],
        languages: ["vi", "en"],
        metadata: {
          format: "PDF",
          pages: "25",
          references: "15 academic sources"
        },
        pageCount: "25",
        fileFormat: "pdf",
        fileSize: "2048",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Điện Hòn Chén - Nơi Giao Thoa Văn Hóa Việt-Chăm",
        titleEn: "Hon Chen Temple - Vietnamese-Cham Cultural Intersection",
        description: "Điện Hòn Chén là quần thể kiến trúc tôn giáo độc đáo bên bờ sông Hương, thờ Thiên Y A Na - nữ thần của người Chăm. Công trình thể hiện sự giao thoa văn hóa đặc sắc giữa người Việt và Chăm.",
        descriptionEn: "Hon Chen Temple is a unique religious architectural complex on the Perfume River, dedicated to Thien Y A Na - a Cham goddess. The structure represents a remarkable cultural intersection between Vietnamese and Cham peoples.",
        type: "document",
        category: "historical_sites",
        contentUrl: "/documents/dien-hon-chen.pdf",
        thumbnailUrl: "/assets/hon-chen.jpg",
        author: "PGS.TS. Phan Thanh Hải",
        source: "Trung tâm Bảo tồn Di tích Cố đô Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "19th Century",
        keywords: ["temple", "religion", "architecture", "cultural-fusion"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "30",
        fileFormat: "pdf",
        fileSize: "3072",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Nghề Dệt Zèng - Di Sản Văn Hóa Phi Vật Thể",
        titleEn: "Zeng Weaving - Intangible Cultural Heritage",
        description: "Nghề dệt Zèng (thổ cẩm) là một trong những nghề thủ công truyền thống đặc sắc của người dân Huế. Bài viết giới thiệu về kỹ thuật, họa tiết và ý nghĩa văn hóa của nghề dệt Zèng.",
        descriptionEn: "Zeng weaving is one of Hue's distinctive traditional crafts. This article introduces the techniques, patterns, and cultural significance of Zeng weaving.",
        type: "document",
        category: "traditional_crafts",
        contentUrl: "/documents/nghe-det-zeng.pdf",
        thumbnailUrl: "/assets/det-zeng.jpg",
        author: "ThS. Trần Thị Minh",
        source: "Bảo tàng Văn hóa Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Contemporary",
        period: "Traditional-Contemporary",
        keywords: ["craft", "weaving", "tradition", "culture"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "20",
        fileFormat: "pdf",
        fileSize: "2560",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Ẩm Thực Cung Đình Huế - Tinh Hoa Ẩm Thực Việt",
        titleEn: "Hue Royal Cuisine - The Essence of Vietnamese Gastronomy",
        description: "Ẩm thực cung đình Huế là sự kết tinh của văn hóa ẩm thực Việt Nam, với những món ăn tinh tế được chế biến công phu. Tài liệu giới thiệu về lịch sử, nghệ thuật chế biến và thưởng thức ẩm thực cung đình Huế.",
        descriptionEn: "Hue royal cuisine represents the pinnacle of Vietnamese culinary culture, featuring sophisticated dishes prepared with elaborate techniques. This document introduces the history,culinary arts, and appreciation of Hue royal cuisine.",
        type: "document",
        category: "culinary",
        contentUrl: "/documents/am-thuc-cung-dinh.pdf",
        thumbnailUrl: "/assets/am-thuc.jpg",
        author: "TS. Hồ Đắc Thiện Anh",
        source: "Viện Nghiên cứu Ẩm thực Huế",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Nguyễn",
        period: "19th Century-Contemporary",
        keywords: ["cuisine", "culture", "royal", "tradition"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "40",
        fileFormat: "pdf",
        fileSize: "4096",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Bài Chòi - Nghệ Thuật Dân Gian Độc Đáo",
        titleEn: "Bai Choi - Unique Folk Performance Art",
        description: "Bài chòi là loại hình nghệ thuật dân gian độc đáo kết hợp giữa trò chơi dân gian và âm nhạc. Tài liệu nghiên cứu về lịch sử, quy tắc và giá trị văn hóa của bài chòi trong đời sống người dân Huế.",
        descriptionEn: "Bai Choi is a unique folk art combining traditional games and music. This research explores the history, rules, and cultural value of Bai Choi in Hue people's lives.",
        type: "document",
        category: "performing_arts",
        contentUrl: "/documents/bai-choi.pdf",
        thumbnailUrl: "/assets/bai-choi.jpg",
        author: "PGS.TS. Lê Thị Thanh Xuân",
        source: "Trung tâm Bảo tồn Văn hóa Dân gian",
        yearCreated: "2024",
        location: "Huế",
        dynasty: "Traditional",
        period: "Traditional-Contemporary",
        keywords: ["folk-art", "game", "music", "tradition"],
        languages: ["vi", "en"],
        metadata: {},
        pageCount: "35",
        fileFormat: "pdf",
        fileSize: "3584",
        viewCount: 0,
        downloadCount: 0,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
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

  async getResourcesByLocationId(locationId: number): Promise<Resource[]> {
    return this.resources.filter(r => r.relatedLocationId === locationId);
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

  // Favorite Routes implementation
  async getFavoriteRoutes(userId: number): Promise<FavoriteRoute[]> {
    return this.favoriteRoutes.filter(route => route.userId === userId && route.isActive);
  }

  async getFavoriteRouteById(id: number): Promise<FavoriteRoute | undefined> {
    return this.favoriteRoutes.find(route => route.id === id && route.isActive);
  }

  async createFavoriteRoute(route: InsertFavoriteRoute): Promise<FavoriteRoute> {
    const newRoute = {
      ...route,
      id: this.getNextId(),
      createdAt: new Date(),
      isActive: true
    } as FavoriteRoute;
    this.favoriteRoutes.push(newRoute);
    return newRoute;
  }

  async deleteFavoriteRoute(id: number): Promise<void> {
    const routeIndex = this.favoriteRoutes.findIndex(r => r.id === id);
    if (routeIndex !== -1) {
      this.favoriteRoutes[routeIndex].isActive = false;
    }
  }

  // Digital Library implementations
  async getAllDigitalLibraryResources(): Promise<DigitalLibraryResource[]> {
    return this.digitalLibraryResources;
  }

  async getAllDigitalLibraryCategories(): Promise<DigitalLibraryCategory[]> {
    return this.digitalLibraryCategories;
  }
}

export const storage = new MemStorage();