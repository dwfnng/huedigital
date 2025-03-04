import {
  type Location, type Resource, type Category, type Contribution, type Ticket,
  type InsertLocation, type InsertResource, type InsertCategory, type InsertContribution, type InsertTicket,
  type User, type Discussion, type Comment, type Review, type InsertUser, type InsertDiscussion, type InsertComment,
  type InsertReview, type Product, type InsertProduct
} from "@shared/schema";

export interface IStorage {
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

  // Contributions (no user auth)
  createContribution(contribution: InsertContribution): Promise<Contribution>;
  getContributionsByLocationId(locationId: number): Promise<Contribution[]>;
  getPendingContributions(): Promise<Contribution[]>;
  updateContributionStatus(id: number, status: string): Promise<Contribution>;

  // Tickets (no user auth)
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  getTicketById(id: number): Promise<Ticket | undefined>;
  getTicketsByLocationId(locationId: number): Promise<Ticket[]>;
  updateTicketStatus(id: number, status: string): Promise<Ticket>;

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

  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByLocationId(locationId: number): Promise<Review[]>;
  getReviewsByUserId(userId: number): Promise<Review[]>;

  // Point Transactions
  createPointTransaction(userId: number, points: string, type: string, referenceId: number): Promise<void>;
  getPointTransactionsByUserId(userId: number): Promise<any[]>;

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
  private tickets: Ticket[] = [];
  private nextId = 1;

  constructor() {
    this.initializeData();
  }

  private getNextId(): number {
    return this.nextId++;
  }

  private initializeData() {
    // Initialize locations with historical sites data
    this.locations = [
      {
        id: this.getNextId(),
        name: "Đại Nội Huế",
        nameEn: "Hue Imperial City",
        description: "Quần thể di tích cung đình rộng hơn 500 hecta, nơi hoàng đế triều Nguyễn sinh sống và làm việc. Được xây dựng từ năm 1805 dưới thời vua Gia Long, hoàn thiện năm 1832 dưới thời vua Minh Mạng. Bao gồm Hoàng thành và Tử cấm thành với hơn 100 công trình kiến trúc đặc sắc.",
        descriptionEn: "A 500-hectare complex where Nguyen Dynasty emperors lived and worked. Built from 1805 under Emperor Gia Long, completed in 1832 under Emperor Minh Mang. Features the Citadel and Imperial City with over 100 remarkable architectural works.",
        type: "heritage_site",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "1805",
        architect: "Hoàng đế Gia Long",
        latitude: "16.4698",
        longitude: "107.5796",
        imageUrl: "/attached_assets/dai-noi-hue.jpg",
        galleryUrls: ["/gallery/dai-noi-1.jpg", "/gallery/dai-noi-2.jpg"],
        openingHours: "07:00-17:30",
        admissionFee: "200000",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Kỳ Đài",
        nameEn: "Ky Dai Flagpole",
        description: "Kỳ Đài Huế là công trình kiến trúc nằm trong quần thể di tích Cố đô Huế, được xây dựng năm 1807 dưới thời vua Gia Long. Đây là nơi thường trực treo cờ triều Nguyễn, với chiều cao 37m, gồm 3 tầng hình bát giác thu nhỏ dần về phía trên.",
        descriptionEn: "Ky Dai Flagpole is an architectural work within the Hue Ancient Capital complex, built in 1807 under Emperor Gia Long. It was used to fly the Nguyen Dynasty flag, standing 37m tall with 3 octagonal tiers that gradually narrow towards the top.",
        type: "monument",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "1807",
        architect: "Hoàng đế Gia Long",
        latitude: "16.4715",
        longitude: "107.5828",
        imageUrl: "/attached_assets/ky-dai.jpg",
        galleryUrls: ["/gallery/ky-dai-1.jpg"],
        openingHours: "08:00-17:00",
        admissionFee: "100000",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Trường Quốc Tử Giám",
        nameEn: "National Academy",
        description: "Trường Quốc Tử Giám là trường đại học đầu tiên của triều Nguyễn, được xây dựng năm 1821 dưới thời vua Minh Mạng. Nơi đây đào tạo quan lại và trí thức cho triều đình, với hệ thống giáo dục theo mô hình Nho giáo truyền thống.",
        descriptionEn: "The National Academy was the first university of the Nguyen Dynasty, built in 1821 under Emperor Minh Mang. It trained officials and scholars for the court, following traditional Confucian educational system.",
        type: "education",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "1821",
        architect: "Hoàng đế Minh Mạng",
        latitude: "16.4680",
        longitude: "107.5790",
        imageUrl: "/attached_assets/quoc-tu-giam.jpg",
        galleryUrls: ["/gallery/quoc-tu-giam-1.jpg", "/gallery/quoc-tu-giam-2.jpg"],
        openingHours: "09:00-16:00",
        admissionFee: "50000",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Điện Long An",
        nameEn: "Long An Palace",
        description: "Điện Long An được xây dựng năm 1845 dưới thời vua Thiệu Trị, là nơi thờ các vị hoàng đế triều Nguyễn. Hiện nay công trình được sử dụng làm Bảo tàng Mỹ thuật Cung đình Huế, trưng bày nhiều hiện vật quý về nghệ thuật cung đình.",
        descriptionEn: "Long An Palace was built in 1845 under Emperor Thieu Tri, serving as a temple for Nguyen Dynasty emperors. Today it houses the Museum of Royal Fine Arts, displaying precious royal art artifacts.",
        type: "museum",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "1845",
        architect: "Hoàng đế Thiệu Trị",
        latitude: "16.4695",
        longitude: "107.5793",
        imageUrl: "/attached_assets/long-an.jpg",
        galleryUrls: ["/gallery/long-an-1.jpg"],
        openingHours: "08:30-17:00",
        admissionFee: "150000",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Điện Thái Hòa",
        nameEn: "Thai Hoa Palace",
        description: "Công trình quan trọng nhất trong Hoàng thành Huế, nơi diễn ra các đại lễ và thiết triều của vua. Điện được xây năm 1805, thiết kế theo phong cách cung đình truyền thống với 80 cột gỗ quý sơn son thếp vàng và hoa văn tinh xảo.",
        descriptionEn: "The most important building in Hue Citadel, where emperors held grand ceremonies and court meetings. Built in 1805, designed in traditional palace style with 80 precious wooden columns lacquered and gilded with intricate patterns.",
        type: "palace",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "1805",
        architect: "Hoàng đế Gia Long",
        latitude: "16.4700",
        longitude: "107.5792",
        imageUrl: "/attached_assets/thai-hoa.jpg",
        galleryUrls: ["/gallery/thai-hoa-1.jpg", "/gallery/thai-hoa-2.jpg"],
        openingHours: "09:00-16:30",
        admissionFee: "180000",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Hồ Tịnh Tâm",
        nameEn: "Tinh Tam Lake",
        description: "Hồ Tịnh Tâm được xây dựng năm 1833 dưới thời vua Minh Mạng, là một trong những cảnh quan đẹp nhất trong Hoàng thành. Hồ có diện tích khoảng 5 hecta, nổi tiếng với hoa sen và các công trình kiến trúc xung quanh như đình Tịnh Tâm.",
        descriptionEn: "Tinh Tam Lake was built in 1833 under Emperor Minh Mang, one of the most beautiful landscapes in the Citadel. The 5-hectare lake is famous for its lotus flowers and surrounding architecture like Tinh Tam Pavilion.",
        type: "landscape",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "1833",
        architect: "Hoàng đế Minh Mạng",
        latitude: "16.4705",
        longitude: "107.5785",
        imageUrl: "/attached_assets/tinh-tam.jpg",
        galleryUrls: ["/gallery/tinh-tam-1.jpg"],
        openingHours: "All Day",
        admissionFee: "Free",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Cửu Vị Thần Công",
        nameEn: "Nine Sacred Cannons",
        description: "Cửu Vị Thần Công là 9 khẩu đại bác được đúc năm 1804 dưới thời vua Gia Long, mỗi khẩu tượng trưng cho một vị thần và bốn mùa. Có trọng lượng từ 1,900 đến 2,900 kg, là biểu tượng của quyền lực và sức mạnh quân sự triều Nguyễn.",
        descriptionEn: "The Nine Sacred Cannons were cast in 1804 under Emperor Gia Long, each representing a deity and the four seasons. Weighing between 1,900 and 2,900 kg, they symbolize the Nguyen Dynasty's military power and authority.",
        type: "artifact",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "1804",
        architect: "Hoàng đế Gia Long",
        latitude: "16.4697",
        longitude: "107.5799",
        imageUrl: "/attached_assets/cuu-vi-than-cong.jpg",
        galleryUrls: ["/gallery/cuu-vi-than-cong-1.jpg"],
        openingHours: "08:00-17:00",
        admissionFee: "Free",
        isActive: true
      },
       {
        id: this.getNextId(),
        name: "Lăng Gia Long",
        nameEn: "Gia Long Tomb",
        description: "Lăng Gia Long là lăng mộ của vua Gia Long và Hoàng hậu Thừa Thiên Cao, được xây dựng từ 1814-1820. Quần thể rộng khoảng 11,700 hecta với kiến trúc hài hòa giữa nhân tạo và thiên nhiên, nằm trong thung lũng Thiên Thọ.",
        descriptionEn: "Gia Long Tomb is the mausoleum of Emperor Gia Long and Empress Thua Thien Cao, built from 1814-1820. The 11,700-hectare complex features architecture harmoniously blending with nature in Thien Tho Valley.",
        type: "tomb",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "1814-1820",
        architect: "Unknown",
        latitude: "16.4198",
        longitude: "107.5438",
        imageUrl: "/attached_assets/lang-gia-long.jpg",
        galleryUrls: ["/gallery/lang-gia-long-1.jpg"],
        openingHours: "08:00-17:00",
        admissionFee: "100000",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Lăng Minh Mạng",
        nameEn: "Minh Mang Tomb",
        description: "Lăng Minh Mạng được xây dựng từ 1840-1843, là công trình kiến trúc hoàn hảo nhất trong các lăng tẩm triều Nguyễn. Quần thể gồm 40 công trình kiến trúc được bố trí đối xứng qua trục chính Bắc-Nam, thể hiện quan niệm về vũ trụ và âm dương.",
        descriptionEn: "Minh Mang Tomb was built from 1840-1843, considered the most architecturally perfect among Nguyen Dynasty mausoleums. The complex includes 40 structures arranged symmetrically along the North-South axis, reflecting cosmic and yin-yang concepts.",
        type: "tomb",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "1840-1843",
        architect: "Unknown",
        latitude: "16.4470",
        longitude: "107.5530",
        imageUrl: "/attached_assets/lang-minh-mang.jpg",
        galleryUrls: ["/gallery/lang-minh-mang-1.jpg"],
        openingHours: "08:00-17:00",
        admissionFee: "120000",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Lăng Thiệu Trị",
        nameEn: "Thieu Tri Tomb",
        description: "Lăng Thiệu Trị được xây dựng năm 1848, là lăng mộ đơn giản nhất trong các lăng vua triều Nguyễn. Điểm đặc biệt là lăng được xây dựng theo di chúc của vua, chú trọng sự giản dị và tiết kiệm.",
        descriptionEn: "Thieu Tri Tomb was built in 1848, the simplest among Nguyen Dynasty royal tombs. Notably, it was built according to the emperor's will, emphasizing simplicity and frugality.",
        type: "tomb",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "1848",
        architect: "Unknown",
        latitude: "16.4530",
        longitude: "107.5570",
        imageUrl: "/attached_assets/lang-thieu-tri.jpg",
        galleryUrls: ["/gallery/lang-thieu-tri-1.jpg"],
        openingHours: "08:00-17:00",
        admissionFee: "80000",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Lăng Khải Định",
        nameEn: "Khai Dinh Tomb",
        description: "Lăng Khải Định được xây dựng từ 1920-1931, là lăng mộ cuối cùng của triều Nguyễn. Kiến trúc độc đáo kết hợp phong cách Đông-Tây, với các họa tiết trang trí tinh xảo bằng mảnh sứ và thủy tinh.",
        descriptionEn: "Khai Dinh Tomb was built from 1920-1931, the last tomb of the Nguyen Dynasty. Its unique architecture combines Eastern and Western styles, featuring intricate decorations made from ceramic and glass pieces.",
        type: "tomb",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "1920-1931",
        architect: "Unknown",
        latitude: "16.4200",
        longitude: "107.5780",
        imageUrl: "/attached_assets/lang-khai-dinh.jpg",
        galleryUrls: ["/gallery/lang-khai-dinh-1.jpg"],
        openingHours: "08:00-17:00",
        admissionFee: "150000",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Lăng Tự Đức",
        nameEn: "Tu Duc Tomb",
        description: "Quần thể lăng mộ rộng 12 ha được xây dựng từ 1864-1867, là nơi nghỉ ngơi và làm việc của vua Tự Đức sinh thời. Kiến trúc tinh tế với hồ Lưu Khiêm, điện Luân Khiêm và vườn thơ Xung Khiêm thể hiện tính cách văn nhân của vị vua thi sĩ.",
        descriptionEn: "A 12-hectare tomb complex built from 1864-1867, served as Emperor Tu Duc's retreat and workplace. Features elegant architecture with Luu Khiem Lake, Luan Khiem Palace and Xung Khiem Poetry Garden reflecting the poet-emperor's scholarly nature.",
        type: "tomb",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "1864-1867",
        architect: "Unknown",
        latitude: "16.4570",
        longitude: "107.5530",
        imageUrl: "/attached_assets/lang-tu-duc.jpg",
        galleryUrls: ["/gallery/lang-tu-duc-1.jpg"],
        openingHours: "08:00-17:00",
        admissionFee: "100000",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Đình Phú Xuân",
        nameEn: "Phu Xuan Communal House",
        description: "Đình Phú Xuân là công trình kiến trúc cổ được xây dựng từ thời Nguyễn, là nơi thờ thành hoàng và tổ chức các nghi lễ quan trọng của làng. Kiến trúc đình thể hiện nghệ thuật chạm khắc gỗ tinh xảo thời Nguyễn.",
        descriptionEn: "Phu Xuan Communal House is an ancient architectural work built during the Nguyen Dynasty, used for village deity worship and important ceremonies. Its architecture showcases exquisite Nguyen Dynasty woodcarving art.",
        type: "communal_house",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "Unknown",
        architect: "Unknown",
        latitude: "16.4720",
        longitude: "107.5840",
        imageUrl: "/attached_assets/dinh-phu-xuan.jpg",
        galleryUrls: ["/gallery/dinh-phu-xuan-1.jpg"],
        openingHours: "08:00-17:00",
        admissionFee: "Free",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Viện Cơ Mật",
        nameEn: "Co Mat Institute",
        description: "Viện Cơ Mật là cơ quan tham mưu cao nhất của triều Nguyễn, được thành lập năm 1834 dưới thời vua Minh Mạng. Nơi đây từng là trung tâm hoạch định chính sách và điều hành đất nước.",
        descriptionEn: "Co Mat Institute was the highest advisory body of the Nguyen Dynasty, established in 1834 under Emperor Minh Mang. It served as the center for policy planning and national administration.",
        type: "government",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "1834",
        architect: "Unknown",
        latitude: "16.4690",
        longitude: "107.5795",
        imageUrl: "/attached_assets/vien-co-mat.jpg",
        galleryUrls: ["/gallery/vien-co-mat-1.jpg"],
        openingHours: "09:00-16:00",
        admissionFee: "Free",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Văn Miếu",
        nameEn: "Temple of Literature",
        description: "Văn Miếu Huế được xây dựng năm 1808 thời vua Gia Long, thờ Khổng Tử và các bậc hiền triết. Nơi đây là biểu tượng của nền giáo dục Nho học và tổ chức các kỳ thi Hương của triều Nguyễn.",
        descriptionEn: "Hue Temple of Literature was built in 1808 under Emperor Gia Long, dedicated to Confucius and other sages. It symbolizes Confucian education and hosted the regional examinations of the Nguyen Dynasty.",
        type: "temple",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "1808",
        architect: "Unknown",
        latitude: "16.4630",
        longitude: "107.5780",
        imageUrl: "/attached_assets/van-mieu.jpg",
        galleryUrls: ["/gallery/van-mieu-1.jpg"],
        openingHours: "08:00-17:00",
        admissionFee: "Free",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Đàn Nam Giao",
        nameEn: "Nam Giao Esplanade",
        description: "Đàn Nam Giao là công trình kiến trúc tôn giáo quy mô lớn, nơi vua triều Nguyễn thực hiện tế lễ Giao hàng năm. Quần thể gồm ba cấp đàn hình vuông, tròn và bát giác tượng trưng cho Thiên - Địa - Nhân.",
        descriptionEn: "Nam Giao Esplanade is a large religious architectural complex where Nguyen emperors performed annual Heaven and Earth worship ceremonies. The three-tiered altar includes square, round, and octagonal levels symbolizing Heaven, Earth, and Human.",
        type: "ritual",
        historicalPeriod: "Nguyễn Dynasty",
        buildYear: "Unknown",
        architect: "Unknown",
        latitude: "16.4510",
        longitude: "107.5670",
        imageUrl: "/attached_assets/dan-nam-giao.jpg",
        galleryUrls: ["/gallery/dan-nam-giao-1.jpg"],
        openingHours: "09:00-16:00",
        admissionFee: "Free",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Điện Hòn Chén",
        nameEn: "Hon Chen Temple",
        description: "Điện Hòn Chén là quần thể kiến trúc tôn giáo nằm bên bờ sông Hương, thờ Thiên Y A Na - nữ thần của người Chăm. Nơi đây là điểm giao thoa văn hóa Việt-Chăm độc đáo.",
        descriptionEn: "Hon Chen Temple is a religious architectural complex on the Perfume River bank, dedicated to Thien Y A Na - a Cham goddess. It represents a unique intersection of Vietnamese and Cham cultures.",
        type: "temple",
        historicalPeriod: "Unknown",
        buildYear: "Unknown",
        architect: "Unknown",
        latitude: "16.4180",
        longitude: "107.5350",
        imageUrl: "/attached_assets/dien-hon-chen.jpg",
        galleryUrls: ["/gallery/dien-hon-chen-1.jpg"],
        openingHours: "08:00-17:00",
        admissionFee: "Free",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Chùa Thiên Mụ",
        nameEn: "Thien Mu Pagoda",
        description: "Ngôi chùa cổ nhất Huế, được xây dựng năm 1601. Tháp Phước Duyên 7 tầng cao 21m là biểu tượng của Huế. Chùa còn lưu giữ nhiều cổ vật quý như chuông đồng đúc năm 1710 và bia đá khắc thơ của các vua triều Nguyễn.",
        descriptionEn: "The oldest pagoda in Hue, built in 1601. The 21-meter, 7-story Phuoc Duyen tower is Hue's iconic symbol. The pagoda preserves many precious artifacts including a bronze bell cast in 1710 and stone steles with poems by Nguyen Dynasty emperors.",
        type: "temple",
        historicalPeriod: "Unknown",
        buildYear: "1601",
        architect: "Unknown",
        latitude: "16.4539",
        longitude: "107.5537",
        imageUrl: "/attached_assets/thien-mu.jpg",
        galleryUrls: ["/gallery/thien-mu-1.jpg"],
        openingHours: "07:00-18:00",
        admissionFee: "Free",
        isActive: true
      }
    ];

    // Initialize resources
    this.resources = [
      {
        id: this.getNextId(),
        title: "Kiến trúc cung đình Huế",
        titleEn: "Hue Royal Architecture",
        description: "Bộ sưu tập hình ảnh chi tiết về kiến trúc cung đình Huế",
        descriptionEn: "Detailed photo collection of Hue royal architecture",
        type: "document",
        category: "architecture",
        contentUrl: "/resources/kien-truc-cung-dinh.pdf",
        thumbnailUrl: "/thumbnails/kien-truc.jpg",
        metadata: {},
        culturalPeriod: "Nguyễn Dynasty",
        historicalContext: "19th Century",
        relatedLocationId: 1,
        tags: ["architecture", "heritage"],
        authorInfo: "Trung tâm Bảo tồn Di tích Huế",
        sourceInfo: "Archival Records",
        languages: ["vi", "en"],
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        title: "Lễ hội Huế",
        titleEn: "Hue Festivals",
        description: "Thông tin về các lễ hội truyền thống ở Huế",
        descriptionEn: "Information on traditional festivals in Hue",
        type: "document",
        category: "culture",
        contentUrl: "/resources/le-hoi-hue.pdf",
        thumbnailUrl: "/thumbnails/le-hoi.jpg",
        metadata: {},
        culturalPeriod: "Nguyễn Dynasty",
        historicalContext: "19th-20th Century",
        relatedLocationId: 1,
        tags: ["festival", "culture", "tradition"],
        authorInfo: "Sở Văn hóa và Thể thao Thừa Thiên Huế",
        sourceInfo: "Online Resources",
        languages: ["vi", "en"],
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

  // Location methods
  async getAllLocations(): Promise<Location[]> {
    return this.locations;
  }

  async getLocationById(id: number): Promise<Location | undefined> {
    return this.locations.find(l => l.id === id);
  }

  async searchLocations(query: string): Promise<Location[]> {
    const lowerQuery = query.toLowerCase();
    return this.locations.filter(l =>
      l.name.toLowerCase().includes(lowerQuery) ||
      l.nameEn.toLowerCase().includes(lowerQuery)
    );
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const newLocation = { ...location, id: this.getNextId() } as Location;
    this.locations.push(newLocation);
    return newLocation;
  }

  // Resource methods
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
      r.title.toLowerCase().includes(lowerQuery) ||
      r.titleEn.toLowerCase().includes(lowerQuery)
    );
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const newResource = { ...resource, id: this.getNextId() } as Resource;
    this.resources.push(newResource);
    return newResource;
  }

  // Category methods
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

  // Contribution methods (no user auth)
  async createContribution(contribution: InsertContribution): Promise<Contribution> {
    const newContribution = { ...contribution, id: this.getNextId() } as Contribution;
    this.contributions.push(newContribution);
    return newContribution;
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

  // Ticket methods (no user auth)
  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const bookingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newTicket = { 
      ...ticket, 
      id: this.getNextId(),
      bookingCode,
      createdAt: new Date() 
    } as Ticket;
    this.tickets.push(newTicket);
    return newTicket;
  }

  async getTicketById(id: number): Promise<Ticket | undefined> {
    return this.tickets.find(t => t.id === id);
  }

  async getTicketsByLocationId(locationId: number): Promise<Ticket[]> {
    return this.tickets.filter(t => t.locationId === locationId);
  }

  async updateTicketStatus(id: number, status: string): Promise<Ticket> {
    const ticket = await this.getTicketById(id);
    if (!ticket) throw new Error('Ticket not found');
    ticket.status = status;
    return ticket;
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

  // Implement ticket methods
  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const bookingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newTicket = { 
      ...ticket, 
      id: this.getNextId(),
      bookingCode,
      createdAt: new Date() 
    } as Ticket;
    this.tickets.push(newTicket);
    return newTicket;
  }

  async getTicketById(id: number): Promise<Ticket | undefined> {
    return this.tickets.find(t => t.id === id);
  }

  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    return this.tickets.filter(t => t.userId === userId);
  }

  async getTicketsByLocationId(locationId: number): Promise<Ticket[]> {
    return this.tickets.filter(t => t.locationId === locationId);
  }

  async updateTicketStatus(id: number, status: string): Promise<Ticket> {
    const ticket = await this.getTicketById(id);
    if (!ticket) throw new Error('Ticket not found');
    ticket.status = status;
    return ticket;
  }
}

export const storage = new MemStorage();