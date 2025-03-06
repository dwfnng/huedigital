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
  metadata: {};
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
  getResourcesByLocationId(locationId: number): Promise<Resource[]>;
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

  // Digital Library methods
  getAllDigitalLibraryResources(): Promise<DigitalLibraryResource[]>;
  getAllDigitalLibraryCategories(): Promise<DigitalLibraryCategory[]>;

  // Session store
  sessionStore: session.Store;
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
  private favoriteRoutes: FavoriteRoute[] = [];
  private products: Product[] = [];
  private digitalLibraryResources: DigitalLibraryResource[] = [];
  private digitalLibraryCategories: DigitalLibraryCategory[] = [];
  private nextId = 1;
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Clear expired entries every 24h
    });
    this.initializeData();
  }

  private initializeData() {
    // Initialize locations with proper structure
    this.locations = [
      // Giữ lại các địa điểm hiện có
      ...this.locations,

      // Thêm các địa điểm mới
      {
        id: this.getNextId(),
        name: "Điện Thái Hòa",
        nameEn: "Thai Hoa Palace",
        description: "Điện Thái Hòa là công trình quan trọng nhất trong Hoàng thành Huế, nơi diễn ra các đại lễ và thiết triều của vua. Điện được xây năm 1805, thiết kế theo phong cách cung đình truyền thống với 80 cột gỗ quý sơn son thếp vàng.",
        descriptionEn: "Thai Hoa Palace is the most important building in Hue Citadel, where emperors held grand ceremonies and court meetings. Built in 1805, it features traditional palace architecture with 80 precious lacquered and gilded wooden columns.",
        type: "heritage_site",
        latitude: "16.4700",
        longitude: "107.5792",
        imageUrl: "/media/images/thai-hoa.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Lăng Đồng Khánh",
        nameEn: "Dong Khanh Tomb",
        description: "Lăng Đồng Khánh được xây dựng từ năm 1888 đến 1923, là nơi an nghỉ của vua Đồng Khánh. Công trình mang đậm phong cách kiến trúc kết hợp Đông - Tây độc đáo.",
        descriptionEn: "Dong Khanh Tomb was built from 1888 to 1923, serving as the resting place of Emperor Dong Khanh. The architecture uniquely combines Eastern and Western styles.",
        type: "tomb",
        latitude: "16.4520",
        longitude: "107.5740",
        imageUrl: "/media/images/lang-dong-khanh.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Lăng Dục Đức",
        nameEn: "Duc Duc Tomb",
        description: "Lăng Dục Đức được xây dựng năm 1883 là nơi an nghỉ của vua Dục Đức. Kiến trúc đơn giản nhưng vẫn giữ được nét đặc trưng của lăng tẩm triều Nguyễn.",
        descriptionEn: "Built in 1883, Duc Duc Tomb is the resting place of Emperor Duc Duc. Though simple in design, it maintains characteristic features of Nguyen Dynasty tombs.",
        type: "tomb",
        latitude: "16.4430",
        longitude: "107.5650",
        imageUrl: "/media/images/lang-duc-duc.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Trấn Bình Đài",
        nameEn: "Tran Binh Platform",
        description: "Trấn Bình Đài là công trình phòng thủ quân sự được xây dựng dưới thời vua Minh Mạng, có vai trò quan trọng trong việc bảo vệ kinh thành từ phía biển.",
        descriptionEn: "Tran Binh Platform is a military defensive structure built under Emperor Minh Mang, playing a crucial role in protecting the citadel from the sea.",
        type: "heritage_site",
        latitude: "16.4660",
        longitude: "107.5920",
        imageUrl: "/media/images/tran-binh-dai.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Tàng Thư Lâu",
        nameEn: "Royal Library",
        description: "Tàng Thư Lâu là thư viện hoàng gia, nơi lưu trữ sách vở và tài liệu quý của triều Nguyễn. Công trình thể hiện sự coi trọng việc giáo dục và văn hóa của triều đại.",
        descriptionEn: "The Royal Library stored precious books and documents of the Nguyen Dynasty, reflecting the dynasty's emphasis on education and culture.",
        type: "heritage_site",
        latitude: "16.4695",
        longitude: "107.5789",
        imageUrl: "/media/images/tang-thu-lau.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Phu Văn Lâu",
        nameEn: "Phu Van Tower",
        description: "Phu Văn Lâu là nơi công bố các chiếu chỉ và thông báo quan trọng của triều đình. Kiến trúc hai tầng độc đáo tọa lạc gần cầu Trường Tiền.",
        descriptionEn: "Phu Van Tower was where royal edicts and important announcements were proclaimed. The unique two-story structure is located near Truong Tien Bridge.",
        type: "heritage_site",
        latitude: "16.4710",
        longitude: "107.5830",
        imageUrl: "/media/images/phu-van-lau.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Văn Miếu Huế",
        nameEn: "Temple of Literature",
        description: "Văn Miếu Huế được xây dựng năm 1808 dưới thời vua Gia Long, thờ Khổng Tử và các bậc hiền triết. Nơi đây là biểu tượng của nền giáo dục Nho học thời Nguyễn.",
        descriptionEn: "Built in 1808 under Emperor Gia Long, the Temple of Literature is dedicated to Confucius and other sages, symbolizing Confucian education during the Nguyen Dynasty.",
        type: "temple",
        latitude: "16.4630",
        longitude: "107.5780",
        imageUrl: "/media/images/van-mieu.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Võ Miếu",
        nameEn: "Temple of Military",
        description: "Võ Miếu được xây dựng năm 1835 dưới thời vua Minh Mạng, thờ các vị danh tướng có công với đất nước. Công trình thể hiện sự tôn vinh võ nghệ trong triều Nguyễn.",
        descriptionEn: "Built in 1835 under Emperor Minh Mang, the Temple of Military honors great military commanders. It reflects the Nguyen Dynasty's respect for martial arts.",
        type: "temple",
        latitude: "16.4640",
        longitude: "107.5770",
        imageUrl: "/media/images/vo-mieu.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Hổ Quyền",
        nameEn: "Ho Quyen Arena",
        description: "Hổ Quyền là đấu trường cổ nơi diễn ra các trận đấu giữa voi và hổ, được xây dựng năm 1830 dưới thời vua Minh Mạng. Công trình có kiến trúc độc đáo dạng hình tròn.",
        descriptionEn: "Built in 1830 under Emperor Minh Mang, Ho Quyen Arena hosted elephant-tiger fights. The structure features unique circular architecture.",
        type: "heritage_site",
        latitude: "16.4520",
        longitude: "107.5730",
        imageUrl: "/media/images/ho-quyen.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Cầu Ngói Thanh Toàn",
        nameEn: "Thanh Toan Tile-roofed Bridge",
        description: "Cầu Ngói Thanh Toàn được xây dựng từ thế kỷ 18, là một trong những cây cầu ngói cổ nhất Việt Nam. Cầu không chỉ là công trình giao thông mà còn là điểm nhấn văn hóa độc đáo.",
        descriptionEn: "Built in the 18th century, Thanh Toan Bridge is one of Vietnam's oldest tile-roofed bridges. It serves both as transportation infrastructure and a unique cultural landmark.",
        type: "heritage_site",
        latitude: "16.5150",
        longitude: "107.6280",
        imageUrl: "/media/images/cau-ngoi-thanh-toan.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Làng Cổ Phước Tích",
        nameEn: "Phuoc Tich Ancient Village",
        description: "Làng cổ Phước Tích là một trong những làng nghề gốm truyền thống lâu đời nhất xứ Huế, với nhiều ngôi nhà rường cổ kính và lò gốm truyền thống.",
        descriptionEn: "Phuoc Tich Ancient Village is one of Hue's oldest traditional pottery villages, featuring many ancient garden houses and traditional kilns.",
        type: "craft_village",
        latitude: "16.5680",
        longitude: "107.6850",
        imageUrl: "/media/images/lang-phuoc-tich.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Thiền Viện Trúc Lâm Bạch Mã",
        nameEn: "Truc Lam Bach Ma Zen Monastery",
        description: "Thiền viện Trúc Lâm Bạch Mã là trung tâm tu học Phật giáo lớn tại Huế, tọa lạc trên núi Bạch Mã với không gian thanh tịnh và view panorama tuyệt đẹp.",
        descriptionEn: "Truc Lam Bach Ma Zen Monastery is a major Buddhist meditation center in Hue, located on Bach Ma Mountain offering serene environment and panoramic views.",
        type: "temple",
        latitude: "16.1970",
        longitude: "107.8500",
        imageUrl: "/media/images/thien-vien-truc-lam.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Đại Nội Huế",
        nameEn: "Hue Imperial City",
        description: "Quần thể di tích cung đình rộng hơn 500 hecta, nơi hoàng đế triều Nguyễn sinh sống và làm việc. Được xây dựng từ năm 1805 dưới thời vua Gia Long, hoàn thiện năm 1832 dưới thời vua Minh Mạng. Bao gồm Hoàng thành và Tử cấm thành với hơn 100 công trình kiến trúc đặc sắc.",
        descriptionEn: "A 500-hectare complex where Nguyen Dynasty emperors lived and worked. Built from 1805 under Emperor Gia Long, completed in 1832 under Emperor Minh Mang. Features the Citadel and Imperial City with over 100 remarkable architectural works.",
        type: "heritage_site",
        latitude: "16.4698",
        longitude: "107.5796",
        imageUrl: "/media/images/pexels-vinhb-29790971.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Kỳ Đài Huế",
        nameEn: "Ky Dai Flag Tower",
        description: "Kỳ Đài là công trình kiến trúc được xây dựng năm 1807 thời vua Gia Long, nơi thường trực treo cờ triều Nguyễn. Công trình cao 37m gồm 3 tầng hình bát giác thu nhỏ dần về phía trên.",
        descriptionEn: "Built in 1807 under Emperor Gia Long, Ky Dai is a 37-meter flag tower where the Nguyen Dynasty flag was flown. The structure has 3 octagonal tiers that gradually narrow towards the top.",
        type: "heritage_site",
        latitude: "16.4715",
        longitude: "107.5828",
        imageUrl: "/media/images/ky-dai.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Trường Quốc Tử Giám",
        nameEn: "Imperial Academy",
        description: "Trường Quốc Tử Giám được xây dựng năm 1821 dưới thời vua Minh Mạng, là trường đại học đầu tiên của triều Nguyễn để đào tạo quan lại và trí thức.",
        descriptionEn: "Built in 1821 under Emperor Minh Mang, the Imperial Academy was the first university of the Nguyen Dynasty for training court officials and scholars.",
        type: "heritage_site",
        latitude: "16.4680",
        longitude: "107.5790",
        imageUrl: "/media/images/quoc-tu-giam.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Điện Long An",
        nameEn: "Long An Palace",
        description: "Điện Long An được xây dựng năm 1845 dưới thời vua Thiệu Trị. Hiện nay là Bảo tàng Mỹ thuật Cung đình Huế, trưng bày nhiều hiện vật quý về nghệ thuật cung đình.",
        descriptionEn: "Built in 1845 under Emperor Thieu Tri, Long An Palace now houses the Museum of Royal Fine Arts, displaying precious royal art artifacts.",
        type: "museum",
        latitude: "16.4695",
        longitude: "107.5793",
        imageUrl: "/media/images/long-an.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Sông Hương",
        nameEn: "Perfume River",
        description: "Dòng sông biểu tượng của xứ Huế, uốn lượn qua trung tâm thành phố với chiều dài 80km. Là nguồn cảm hứng cho nhiều tác phẩm văn học nghệ thuật.",
        descriptionEn: "The iconic 80km river flowing through Hue city center has inspired numerous artistic and literary works.",
        type: "natural_site",
        latitude: "16.4680",
        longitude: "107.5790",
        imageUrl: "/media/images/song-huong.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Núi Ngự Bình",
        nameEn: "Ngu Binh Mountain",
        description: "Ngọn núi cao 103m được xem là điểm nhấn trong địa lý phong thủy của kinh thành Huế, tượng trưng cho bình phong che chắn cho Hoàng thành.",
        descriptionEn: "The 103m mountain is a key element in Hue's feng shui geography, symbolizing a screen protecting the Imperial City.",
        type: "natural_site",
        latitude: "16.4510",
        longitude: "107.5670",
        imageUrl: "/media/images/ngu-binh.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Làng hương Thủy Xuân",
        nameEn: "Thuy Xuan Incense Village",
        description: "Làng nghề truyền thống nổi tiếng với nghề làm hương thơm theo phương pháp thủ công, tạo ra những cây hương thơm nổi tiếng của xứ Huế.",
        descriptionEn: "A traditional village famous for handcrafting aromatic incense sticks, producing Hue's renowned incense products.",
        type: "craft_village",
        latitude: "16.4180",
        longitude: "107.5350",
        imageUrl: "/media/images/lang-huong.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Làng nón bài thơ Phú Cam",
        nameEn: "Phu Cam Poem Conical Hat Village",
        description: "Làng nghề làm nón lá truyền thống, nổi tiếng với kỹ thuật đặc biệt tạo hình bài thơ trong nón khi soi qua ánh sáng.",
        descriptionEn: "A traditional conical hat making village, famous for its special technique of creating poem shadows when the hat is held against light.",
        type: "craft_village",
        latitude: "16.4720",
        longitude: "107.5840",
        imageUrl: "/media/images/lang-non.jpg",
        isActive: true
      },
      {
        id: this.getNextId(),
        name: "Điện Long An",
        nameEn: "Long An Palace",
        description: "Điện Long An được xây dựng năm 1845 dưới thời vua Thiệu Trị. Hiện nay là Bảo tàng Mỹ thuật Cung đình Huế, trưng bày nhiều hiện vật quý về nghệ thuật cung đình.",
        descriptionEn: "Built in 1845 under Emperor Thieu Tri, Long An Palace now houses the Museum of Royal Fine Arts, displaying precious royal art artifacts.",
        type: "museum",
        latitude: "16.4695",
        longitude: "107.5793",
        imageUrl: "/media/images/long-an.jpg",
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
        imageUrl: "/media/images/thai-hoa.jpg",
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
        imageUrl: "/media/images/tinh-tam.jpg",
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
        imageUrl: "/media/images/cuu-vi-than-cong.jpg",
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
        imageUrl: "/media/images/lang-gia-long.jpg",
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
        imageUrl: "/media/images/lang-minh-mang.jpg",
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
        imageUrl: "/media/images/lang-thieu-tri.jpg",
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
        imageUrl: "/media/images/lang-khai-dinh.jpg",
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
        imageUrl: "/media/images/lang-tu-duc.jpg",
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
        imageUrl: "/media/images/dinh-phu-xuan.jpg",
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
        imageUrl: "/media/images/vien-co-mat.jpg",
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
        imageUrl: "/media/images/van-mieu.jpg",
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
        imageUrl: "/media/images/dan-nam-giao.jpg",
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
        imageUrl: "/media/images/dien-hon-chen.jpg",
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
        imageUrl: "/media/images/thien-mu.jpg",
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
        contentUrl: "/media/images/kien-truc.jpg",
        thumbnailUrl: "/media/images/kien-truc.jpg",
        metadata: {},
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
        contentUrl: "/media/documents/nghe-thuat.pdf",
        thumbnailUrl: "/media/images/nghe-thuat.jpg",
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
        contentUrl: "/media/audio/nha-nhac.mp3",
        thumbnailUrl: "/media/images/nha-nhac.jpg",
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
        contentUrl: "/media/documents/architecture.pdf",
        thumbnailUrl: "/media/images/architecture.jpg",
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
        contentUrl: "/media/documents/festival.pdf",
        thumbnailUrl: "/media/images/festival.jpg",
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

    this.digitalLibraryCategories = [
      {
        id: this.getNextId(),
        name: "Di tích lịch sử",
        nameEn: "Historical Sites",
        description: "Các di tích lịch sử và công trình kiến trúc tiêu biểu của Huế",
        descriptionEn: "Historical sites and architectural landmarks of Hue",
        parentId: null,
        iconUrl: null,
        type: "heritage",
        sortOrder: "0"
      },
      {
        id: this.getNextId(),
        name: "Danh thắng thiên nhiên",
        nameEn: "Natural Attractions",
        description: "Các địa danh và cảnh quan thiên nhiên đặc sắc",
        descriptionEn: "Natural landmarks and scenic landscapes",
        parentId: null,
        iconUrl: null,
        type: "natural",
        sortOrder: "1"
      },
      {
        id: this.getNextId(),
        name: "Làng nghề truyền thống",
        nameEn: "Traditional Craft Villages",
        description: "Các làng nghề thủ công truyền thống của Huế",
        descriptionEn: "Traditional handicraft villages of Hue",
        parentId: null,
        iconUrl: null,
        type: "craft",
        sortOrder: "2"
      },
      {
        id: this.getNextId(),
        name: "Văn hóa nghệ thuật",
        nameEn: "Arts and Culture",
        description: "Nghệ thuật truyền thống và di sản văn hóa phi vật thể",
        descriptionEn: "Traditional arts and intangible cultural heritage",
        parentId: null,
        iconUrl: null,
        type: "culture",
        sortOrder: "3"
      }
    ];

    this.digitalLibraryResources = [
      {
        id: this.getNextId(),
        title: "Chùa Thiên Mụ – Biểu tượng linh thiêng của cố đô Huế",
        titleEn: "Thien Mu Pagoda - Sacred Symbol of Ancient Hue Capital",
        description: "Ngôi chùa cổ nhất Huế, được xây dựng năm 1601. Tháp Phước Duyên 7 tầng cao 21m là biểu tượng của Huế. Chùa còn lưu giữ nhiều cổ vật quý như chuông đồng đúc năm 1710 và bia đá khắc thơ của các vua triều Nguyễn.",
        descriptionEn: "The oldest pagoda in Hue, built in 1601. The 21-meter, 7-story Phuoc Duyen tower is Hue's iconic symbol. The pagoda preserves many precious artifacts including a bronze bell cast in 1710 and stone steles with poems by Nguyen Dynasty emperors.",
        type: "document",
        category: "heritage_site",
        contentUrl: "/media/documents/chua-thien-mu.pdf",
        thumbnailUrl: "/media/images/thien-mu.jpg",
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
        title: "Ca Huế - Tinh hoa âm nhạc xứ Kinh kỳ",
        titleEn: "Hue Classical Music - The Essence of Imperial City Music",
        description: "Ca Huế là một thể loại âm nhạc truyền thống độc đáo của xứ Huế, kết hợp giữa các làn điệu dân ca và nhã nhạc cung đình. Nghệ thuật này phản ánh đời sống tinh thần phong phú và tâm hồn tao nhã của người dân Huế.",
        descriptionEn: "Hue Classical Music is a unique traditional music genre of Hue, combining folk melodies and royal court music. This art form reflects the rich spiritual life and refined soul of Hue people.",
        type: "audio",
        category: "arts",
        contentUrl: "/media/audio/ca-hue.mp3",
        thumbnailUrl: "/media/images/ca-hue.jpg",
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
        category: "arts",
        contentUrl: "/media/documents/giong-hue.pdf",
        thumbnailUrl: "/media/images/giong-hue.jpg",
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
        category: "heritage_site",
        contentUrl: "/media/documents/dien-hon-chen.pdf",
        thumbnailUrl: "/media/images/hon-chen.jpg",
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
        category: "culinary_crafts",
        contentUrl: "/media/documents/nghe-det-zeng.pdf",
        thumbnailUrl: "/media/images/det-zeng.jpg",
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
        descriptionEn: "Hue royal cuisine represents the pinnacle of Vietnamese culinary culture, featuring sophisticated dishes prepared with elaborate techniques. This document introduces the history, culinary arts, and appreciation of Hue royal cuisine.",
        type: "document",
        category: "culinary_crafts",
        contentUrl: "/media/documents/am-thuc-cung-dinh.pdf",
        thumbnailUrl: "/media/images/am-thuc.jpg",
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
        category: "arts",
        contentUrl: "/media/documents/bai-choi.pdf",
        thumbnailUrl: "/media/images/bai-choi.jpg",
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
    // Initialize Digital Library Categories. This part is already updated.
    

    // Initialize Digital Library Resources. This part is already updated.

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