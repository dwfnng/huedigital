import {
  type Location, type User, type Discussion, type Comment, type Contribution, type Review,
  type InsertLocation, type InsertUser, type InsertDiscussion, type InsertComment,
  type InsertContribution, type InsertReview, type Resource, type Category, type InsertResource, type InsertCategory,
  type FavoriteRoute, type InsertFavoriteRoute
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
  createResource(resource: InsertResource): Promise<Resource>;

  // Categories 
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Favorite Routes
  getFavoriteRoutes(userId: number): Promise<FavoriteRoute[]>;
  getFavoriteRouteById(id: number): Promise<FavoriteRoute | undefined>;
  createFavoriteRoute(route: InsertFavoriteRoute): Promise<FavoriteRoute>;
  deleteFavoriteRoute(id: number): Promise<void>;

  // Session store
  sessionStore: session.Store;
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
  private nextId = 1;
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Clear expired entries every 24h
    });
    this.initializeData();
  }

  private initializeData() {
    // Initialize basic locations
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
      },
      {
        id: this.getNextId(),
        name: "Kỳ Đài",
        nameEn: "Ky Dai Flagpole",
        description: "Kỳ Đài Huế là công trình kiến trúc nằm trong quần thể di tích Cố đô Huế, được xây dựng năm 1807 dưới thời vua Gia Long.",
        descriptionEn: "Ky Dai Flagpole is an architectural work within the Hue Ancient Capital complex, built in 1807 under Emperor Gia Long.",
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
        description: "Trường đại học đầu tiên của triều Nguyễn, được xây dựng năm 1821 dưới thời vua Minh Mạng.",
        descriptionEn: "The first university of the Nguyen Dynasty, built in 1821 under Emperor Minh Mang.",
        type: "education",
        latitude: "16.4680",
        longitude: "107.5790",
        imageUrl: "/attached_assets/quoc-tu-giam.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Lăng Gia Long",
        nameEn: "Gia Long Tomb",
        description: "Lăng mộ của vua Gia Long và Hoàng hậu Thừa Thiên Cao, được xây dựng từ 1814-1820.",
        descriptionEn: "The tomb of Emperor Gia Long and Empress Thua Thien Cao, built from 1814-1820.",
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
        description: "Công trình kiến trúc hoàn hảo nhất trong các lăng tẩm triều Nguyễn, xây dựng từ 1840-1843.",
        descriptionEn: "The most architecturally perfect among Nguyen Dynasty mausoleums, built from 1840-1843.",
        type: "tomb",
        latitude: "16.4470",
        longitude: "107.5530",
        imageUrl: "/attached_assets/lang-minh-mang.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Sông Hương & Cầu Tràng Tiền",
        nameEn: "Perfume River & Trang Tien Bridge",
        description: "Biểu tượng của vẻ đẹp thơ mộng xứ Huế, với cây cầu lịch sử xây dựng năm 1899.",
        descriptionEn: "Symbol of Hue's poetic beauty, with the historic bridge built in 1899.",
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
        description: "Núi cao 103m, được ví như bức bình phong của kinh thành Huế.",
        descriptionEn: "The 103m tall mountain acts as a screen protecting Hue Citadel.",
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
        description: "Điểm cao đắc địa để ngắm toàn cảnh sông Hương và cố đô Huế.",
        descriptionEn: "A strategic viewpoint overlooking the Perfume River and ancient Hue.",
        type: "landscape",
        latitude: "16.4178",
        longitude: "107.5514",
        imageUrl: "/attached_assets/vong-canh.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Thiền viện Trúc Lâm Bạch Mã",
        nameEn: "Truc Lam Bach Ma Zen Monastery",
        description: "Trung tâm tu học Phật giáo lớn tại Huế, tọa lạc trên núi Bạch Mã.",
        descriptionEn: "Major Buddhist meditation center in Hue, located on Bach Ma Mountain.",
        type: "temple",
        latitude: "16.1851",
        longitude: "107.8501",
        imageUrl: "/attached_assets/truc-lam.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Cửu Đỉnh",
        nameEn: "Nine Dynasty Urns",
        description: "Chín đỉnh đồng được đúc dưới thời Minh Mạng (1836-1839), tượng trưng cho sự vĩnh cửu của triều Nguyễn.",
        descriptionEn: "Nine bronze urns cast during Minh Mang's reign (1836-1839), symbolizing the perpetuity of Nguyen Dynasty.",
        type: "heritage_site",
        latitude: "16.4697",
        longitude: "107.5795",
        imageUrl: "/attached_assets/cuu-dinh.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Điện Long An",
        nameEn: "Long An Palace",
        description: "Điện Long An được xây dựng năm 1845 dưới thời vua Thiệu Trị, nay là Bảo tàng Mỹ thuật Cung đình Huế.",
        descriptionEn: "Long An Palace built in 1845 under Emperor Thieu Tri, now houses the Museum of Royal Fine Arts.",
        type: "palace",
        latitude: "16.4695",
        longitude: "107.5793",
        imageUrl: "/attached_assets/dien-long-an.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Điện Thái Hòa",
        nameEn: "Thai Hoa Palace",
        description: "Điện Thái Hòa là nơi tổ chức các đại lễ và thiết triều quan trọng của vương triều Nguyễn.",
        descriptionEn: "Thai Hoa Palace was where the Nguyen Dynasty held important ceremonies and court meetings.",
        type: "palace",
        latitude: "16.4700",
        longitude: "107.5792",
        imageUrl: "/attached_assets/dien-thai-hoa.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Chợ Đông Ba",
        nameEn: "Dong Ba Market",
        description: "Khu chợ truyền thống lớn nhất và lâu đời nhất Huế, nơi tập trung các mặt hàng đặc sản địa phương.",
        descriptionEn: "The largest and oldest traditional market in Hue, featuring local specialties.",
        type: "market",
        latitude: "16.4717",
        longitude: "107.5828",
        imageUrl: "/attached_assets/cho-dong-ba.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Làng Hương Thủy Xuân",
        nameEn: "Thuy Xuan Incense Village",
        description: "Làng nghề truyền thống nổi tiếng với nghề làm hương thơm, thu hút nhiều du khách tham quan.",
        descriptionEn: "Traditional craft village famous for incense making, attracting many visitors.",
        type: "craft_village",
        latitude: "16.4167",
        longitude: "107.5500",
        imageUrl: "/attached_assets/lang-huong.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Làng Nón Bài Thơ",
        nameEn: "Bai Tho Conical Hat Village",
        description: "Làng nghề làm nón lá truyền thống, nổi tiếng với kỹ thuật đan nón và thêu thơ trên lá nón.",
        descriptionEn: "Traditional conical hat making village, famous for weaving techniques and poetry embroidery.",
        type: "craft_village",
        latitude: "16.4583",
        longitude: "107.5917",
        imageUrl: "/attached_assets/lang-non.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Làng Gốm Phước Tích",
        nameEn: "Phuoc Tich Pottery Village",
        description: "Làng gốm cổ với lịch sử hơn 500 năm, vẫn bảo tồn nhiều giá trị văn hóa và kỹ thuật làm gốm truyền thống.",
        descriptionEn: "Ancient pottery village with over 500 years of history, preserving cultural values and traditional techniques.",
        type: "craft_village",
        latitude: "16.5500",
        longitude: "107.6167",
        imageUrl: "/attached_assets/lang-gom.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Lăng Tự Đức",
        nameEn: "Tu Duc Tomb",
        description: "Lăng mộ của vua Tự Đức, một quần thể kiến trúc đẹp và thơ mộng với nhiều công trình độc đáo.",
        descriptionEn: "Tomb of Emperor Tu Duc, a beautiful and poetic architectural complex with unique structures.",
        type: "tomb",
        latitude: "16.4700",
        longitude: "107.5500",
        imageUrl: "/attached_assets/lang-tu-duc.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Lăng Khải Định",
        nameEn: "Khai Dinh Tomb",
        description: "Lăng mộ độc đáo với kiến trúc kết hợp Đông - Tây, được xây dựng từ 1920-1931.",
        descriptionEn: "Unique tomb with East-West architectural fusion, built from 1920-1931.",
        type: "tomb",
        latitude: "16.4200",
        longitude: "107.5800",
        imageUrl: "/attached_assets/lang-khai-dinh.jpg",
        isActive: true
      }
    ];

    // Initialize other collections as empty arrays
    this.users = [];
    this.discussions = [];
    this.comments = [];
    this.contributions = [];
    this.reviews = [];
    this.pointTransactions = [];
    this.resources = [];
    this.categories = [];
    this.favoriteRoutes = [];
  }

  private getNextId(): number {
    return this.nextId++;
  }

  public async createUser(user: InsertUser): Promise<User> {
    const newUser = { id: this.getNextId(), ...user, points: "0", createdAt: new Date() };
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
    const newLocation = { id: this.getNextId(), ...location, isActive: true };
    this.locations.push(newLocation);
    return newLocation;
  }
  public async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    const newDiscussion = {
      id: this.getNextId(),
      userId: discussion.userId,
      title: discussion.title,
      content: discussion.content,
      category: discussion.category,
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
      r.titleEn?.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery) ||
      r.descriptionEn?.toLowerCase().includes(lowerQuery)
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
      parentId: category.parentId || 0,
      iconUrl: category.iconUrl || null
    };
    this.categories.push(newCategory);
    return newCategory;
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
}