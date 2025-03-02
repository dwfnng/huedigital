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
        description: "Quần thể di tích cung đình rộng hơn 500 hecta, nơi hoàng đế triều Nguyễn sinh sống và làm việc. Được xây dựng từ năm 1805 dưới thời vua Gia Long, hoàn thiện năm 1832 dưới thời vua Minh Mạng. Bao gồm Hoàng thành và Tử cấm thành với hơn 100 công trình kiến trúc đặc sắc.",
        descriptionEn: "A 500-hectare complex where Nguyen Dynasty emperors lived and worked. Built from 1805 under Emperor Gia Long, completed in 1832 under Emperor Minh Mang. Features the Citadel and Imperial City with over 100 remarkable architectural works.",
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
        description: "Ngôi chùa cổ nhất Huế, được xây dựng năm 1601. Tháp Phước Duyên 7 tầng cao 21m là biểu tượng của Huế. Chùa còn lưu giữ nhiều cổ vật quý như chuông đồng đúc năm 1710 và bia đá khắc thơ của các vua triều Nguyễn.",
        descriptionEn: "The oldest pagoda in Hue, built in 1601. The 21-meter, 7-story Phuoc Duyen tower is Hue's iconic symbol. The pagoda preserves many precious artifacts including a bronze bell cast in 1710 and stone steles with poems by Nguyen Dynasty emperors.",
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
        description: "Công trình quan trọng nhất trong Hoàng thành Huế, nơi diễn ra các đại lễ và thiết triều của vua. Điện được xây năm 1805, thiết kế theo phong cách cung đình truyền thống với 80 cột gỗ quý sơn son thếp vàng và hoa văn tinh xảo.",
        descriptionEn: "The most important building in Hue Citadel, where emperors held grand ceremonies and court meetings. Built in 1805, designed in traditional palace style with 80 precious wooden columns lacquered and gilded with intricate patterns.",
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
        description: "Cổng chính phía nam của Hoàng thành, xây dựng năm 1833 dưới triều Minh Mạng. Công trình 5 cửa, 2 tầng cao 5,2m, là nơi vua ban chiếu chỉ và xem duyệt binh. Kiến trúc kết hợp hài hòa giữa phong cách phương Đông và phương Tây.",
        descriptionEn: "The main southern gate of the Citadel, built in 1833 under Emperor Minh Mang. A 5.2m high structure with 5 entrances and 2 levels, where emperors issued edicts and watched military parades. Architecture harmoniously combines Eastern and Western styles.",
        type: "monument",
        latitude: "16.4716",
        longitude: "107.5827",
        imageUrl: "/attached_assets/pexels-vietnam-photographer-27418892.jpg",
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
        description: "Bộ sưu tập hình ảnh chi tiết về kiến trúc cung đình Huế, từ tổng thể đến các chi tiết trang trí. Kèm theo các bản vẽ kỹ thuật và thông tin về kỹ thuật xây dựng thời Nguyễn.",
        descriptionEn: "Detailed photo collection of Hue royal architecture, from overall views to decorative details. Includes technical drawings and information about Nguyen Dynasty construction techniques.",
        type: "image",
        category: "architecture",
        contentUrl: "https://hueworldheritage.org.vn/kien-truc-cung-dinh.html",
        thumbnailUrl: "/attached_assets/pexels-qhung999-28772283.jpg",
        metadata: {
          format: "jpg",
          resolution: "4K",
          year: "2024",
          count: "50+ images",
          source: "Trung tâm Bảo tồn Di tích Cố đô Huế"
        },
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
        contentUrl: "https://hueworldheritage.org.vn/nghe-thuat-trang-tri.html",
        thumbnailUrl: "/attached_assets/pexels-th-vinh-flute-822138648-21011475.jpg",
        metadata: {
          format: "pdf",
          pages: "120",
          language: "Vietnamese, English",
          author: "PGS.TS. Phan Thanh Hải"
        },
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
        contentUrl: "https://hueworldheritage.org.vn/nha-nhac.html",
        thumbnailUrl: "/attached_assets/pexels-vinhb-29790971.jpg",
        metadata: {
          format: "mp3, mp4",
          duration: "6 hours",
          quality: "Studio",
          performers: "Nhóm Nhã nhạc Cung đình Huế"
        },
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Lễ hội và nghi thức cung đình",
        titleEn: "Royal Festivals and Rituals",
        description: "Phim tài liệu về các lễ hội và nghi thức trong cung đình triều Nguyễn. Tái hiện chi tiết các nghi lễ quan trọng như lễ tế Giao, lễ Đại triều và lễ Nguyên đán.",
        descriptionEn: "Documentary about festivals and rituals in the Nguyen Dynasty court. Detailed reenactments of important ceremonies like Nam Giao Offering, Great Court Ceremony and Lunar New Year.",
        type: "video",
        category: "culture",
        contentUrl: "https://hueworldheritage.org.vn/le-hoi.html",
        thumbnailUrl: "/attached_assets/pexels-vietnam-photographer-27418892.jpg",
        metadata: {
          format: "4K MP4",
          duration: "120 minutes",
          producer: "Trung tâm Phát huy Di sản Văn hóa Huế",
          language: "Vietnamese (English subtitles)"
        },
        createdAt: new Date()
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