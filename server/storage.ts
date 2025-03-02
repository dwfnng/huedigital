import { locations, type Location, type InsertLocation } from "@shared/schema";
import { 
  resources, categories,
  type Resource, type Category,
  type InsertResource, type InsertCategory 
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
}

export class MemStorage implements IStorage {
  private locations: Map<number, Location>;
  private resources: Map<number, Resource>;
  private categories: Map<number, Category>;
  private currentId: number;
  private resourceId: number;
  private categoryId: number;

  constructor() {
    this.locations = new Map();
    this.resources = new Map();
    this.categories = new Map();
    this.currentId = 1;
    this.resourceId = 1;
    this.categoryId = 1;
    this.initializeData();
  }

  private initializeData() {
    const defaultLocations: InsertLocation[] = [
      {
        name: "Kỳ Đài",
        nameEn: "Flag Tower",
        description: "Kỳ Đài là một trong những công trình kiến trúc tiêu biểu của Cố đô Huế, được xây dựng vào năm 1807 dưới thời vua Gia Long. Công trình cao 17.5m, có kiến trúc hình vuông với mỗi cạnh dài 4m.",
        descriptionEn: "The Flag Tower is one of the iconic architectural works of Hue Ancient Capital, built in 1807 during King Gia Long's reign. The tower is 17.5m high with a square base of 4m each side.",
        type: "historical_site",
        latitude: "16.4698",
        longitude: "107.5723",
        imageUrl: "https://i.imgur.com/FLHx123.jpg"
      },
      {
        name: "Trường Quốc Tử Giám",
        nameEn: "Quoc Tu Giam School",
        description: "Trường Quốc Tử Giám là trường học đầu tiên của triều Nguyễn, nơi đào tạo con em các quan lại và những người ưu tú. Được xây dựng năm 1803 dưới thời vua Gia Long.",
        descriptionEn: "Quoc Tu Giam was the first school of the Nguyen Dynasty, educating children of officials and talented students. Built in 1803 during King Gia Long's reign.",
        type: "historical_site",
        latitude: "16.4689",
        longitude: "107.5735",
        imageUrl: "https://i.imgur.com/QTG456.jpg"
      },
      {
        name: "Điện Long An",
        nameEn: "Long An Palace",
        description: "Điện Long An là nơi trưng bày nhiều cổ vật quý của triều Nguyễn, hiện là Bảo tàng Mỹ thuật Cung đình Huế.",
        descriptionEn: "Long An Palace now houses the Museum of Royal Fine Arts, displaying precious antiques from the Nguyen Dynasty.",
        type: "historical_site",
        latitude: "16.4695",
        longitude: "107.5774",
        imageUrl: "https://i.imgur.com/LAN789.jpg"
      },
      {
        name: "Điện Thái Hòa",
        nameEn: "Thai Hoa Palace",
        description: "Điện Thái Hòa là công trình chính và quan trọng nhất của triều Nguyễn, nơi diễn ra các đại lễ và thiết triều của vua. Điện được xây dựng năm 1805 và được trùng tu nhiều lần.",
        descriptionEn: "Thai Hoa Palace is the main and most important building of the Nguyen Dynasty, where major ceremonies and court meetings were held. Built in 1805, it has been restored several times.",
        type: "historical_site",
        latitude: "16.4697",
        longitude: "107.5776",
        imageUrl: "https://i.imgur.com/THH123.jpg"
      },
      {
        name: "Hồ Tịnh Tâm",
        nameEn: "Tinh Tam Lake",
        description: "Hồ Tịnh Tâm là một trong những hồ cảnh quan đẹp nhất trong Kinh thành Huế, nơi vua chúa thường đến thưởng ngoạn và ngắm hoa sen.",
        descriptionEn: "Tinh Tam Lake is one of the most beautiful scenic lakes in Hue Citadel, where kings often came to enjoy the scenery and lotus flowers.",
        type: "historical_site",
        latitude: "16.4705",
        longitude: "107.5768",
        imageUrl: "https://i.imgur.com/TTL456.jpg"
      }
    ];

    const defaultCategories: InsertCategory[] = [
      {
        name: "Di tích lịch sử",
        nameEn: "Historical Sites",
        description: "Các di tích lịch sử trong Cố đô Huế",
        descriptionEn: "Historical sites in Hue Ancient Capital",
      },
      {
        name: "Kiến trúc hoàng cung",
        nameEn: "Royal Architecture",
        description: "Các công trình kiến trúc trong Hoàng thành Huế",
        descriptionEn: "Architectural works in Hue Imperial City",
      },
      {
        name: "Lăng tẩm",
        nameEn: "Royal Tombs",
        description: "Hệ thống lăng tẩm các vua triều Nguyễn",
        descriptionEn: "Nguyen Dynasty royal tomb system",
      },
      {
        name: "Âm nhạc cung đình",
        nameEn: "Court Music",
        description: "Nhã nhạc cung đình Huế - Di sản văn hóa phi vật thể",
        descriptionEn: "Hue Royal Court Music - Intangible cultural heritage",
      },
      {
        name: "Lễ hội văn hóa",
        nameEn: "Cultural Festivals",
        description: "Các lễ hội và nghi lễ truyền thống tại Huế",
        descriptionEn: "Traditional festivals and ceremonies in Hue",
      }
    ];

    const defaultResources: InsertResource[] = [
      {
        title: "Nhã nhạc cung đình Huế - Di sản văn hóa thế giới",
        titleEn: "Hue Royal Court Music - World Cultural Heritage",
        description: "Bản ghi âm các tác phẩm nhã nhạc tiêu biểu được trình diễn tại Huế năm 2023, bao gồm các tác phẩm nổi tiếng như Đăng Đàn Cung và Mừng Xuân.",
        descriptionEn: "Recording of representative royal court music performed in Hue 2023, including famous pieces like Dang Dan Cung and Mung Xuan.",
        type: "audio",
        category: "music",
        contentUrl: "https://cdn.huedigital.vn/audio/nha-nhac-2023.mp3",
        thumbnailUrl: "https://i.imgur.com/NNM123.jpg",
        metadata: {
          format: "mp3",
          duration: "45:30",
          tracks: 12,
          year: 2023,
          quality: "320kbps",
          size: "104MB"
        }
      },
      {
        title: "Kiến trúc Hoàng cung Huế qua các triều đại",
        titleEn: "Hue Imperial Palace Architecture Through Dynasties",
        description: "Phim tài liệu HD về lịch sử phát triển và đặc điểm kiến trúc của Hoàng thành Huế, với những góc quay độc đáo từ flycam.",
        descriptionEn: "HD Documentary about the historical development and architectural features of Hue Imperial City, with unique drone footage.",
        type: "video",
        category: "historical_site",
        contentUrl: "https://cdn.huedigital.vn/videos/hoang-cung-hue-2024.mp4",
        thumbnailUrl: "https://i.imgur.com/HCH456.jpg",
        metadata: {
          format: "mp4",
          duration: "35:20",
          resolution: "3840x2160",
          language: "Vietnamese with English subtitles",
          size: "2.1GB"
        }
      }
    ];

    defaultLocations.forEach(location => this.createLocation(location));
    defaultCategories.forEach(category => this.createCategory(category));
    defaultResources.forEach(resource => this.createResource(resource));
  }

  async getAllLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getLocationById(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async searchLocations(query: string): Promise<Location[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.locations.values()).filter(location => 
      location.name.toLowerCase().includes(lowercaseQuery) ||
      location.nameEn.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const id = this.currentId++;
    const newLocation: Location = { 
      ...location, 
      id,
      isActive: true
    };
    this.locations.set(id, newLocation);
    return newLocation;
  }

  // Resource methods
  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getResourcesByType(type: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      resource => resource.type === type
    );
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      resource => resource.category === category
    );
  }

  async searchResources(query: string): Promise<Resource[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.resources.values()).filter(resource =>
      resource.title.toLowerCase().includes(lowercaseQuery) ||
      resource.titleEn?.toLowerCase().includes(lowercaseQuery) ||
      resource.description?.toLowerCase().includes(lowercaseQuery) ||
      resource.descriptionEn?.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const id = this.resourceId++;
    const now = new Date();
    const newResource: Resource = {
      ...resource,
      id,
      createdAt: now
    };
    this.resources.set(id, newResource);
    return newResource;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = {
      ...category,
      id
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }
}

export const storage = new MemStorage();