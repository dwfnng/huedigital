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
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Flag_Tower_of_Hu%E1%BA%BF.jpg/1280px-Flag_Tower_of_Hu%E1%BA%BF.jpg"
      },
      {
        name: "Điện Thái Hòa",
        nameEn: "Thai Hoa Palace",
        description: "Điện Thái Hòa là công trình chính và quan trọng nhất của triều Nguyễn, nơi diễn ra các đại lễ và thiết triều của vua. Điện được xây dựng năm 1805 và được trùng tu nhiều lần.",
        descriptionEn: "Thai Hoa Palace is the main and most important building of the Nguyen Dynasty, where major ceremonies and court meetings were held. Built in 1805, it has been restored several times.",
        type: "historical_site",
        latitude: "16.4697",
        longitude: "107.5776",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Thai_Hoa_Palace.jpg/1280px-Thai_Hoa_Palace.jpg"
      },
      {
        name: "Lăng Gia Long",
        nameEn: "Gia Long Tomb",
        description: "Lăng Gia Long (Thiên Thọ Lăng) là khu lăng tẩm đầu tiên và lớn nhất của triều Nguyễn, được xây dựng từ năm 1814 đến 1820. Lăng thể hiện sự kết hợp hài hòa giữa kiến trúc và thiên nhiên.",
        descriptionEn: "Gia Long Tomb (Thien Tho Mausoleum) is the first and largest royal tomb of the Nguyen Dynasty, built from 1814 to 1820. The tomb demonstrates a harmonious blend of architecture and nature.",
        type: "historical_site",
        latitude: "16.4736",
        longitude: "107.2215",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Gia_Long_tomb.jpg/1280px-Gia_Long_tomb.jpg"
      },
      {
        name: "Đàn Nam Giao",
        nameEn: "Nam Giao Esplanade",
        description: "Đàn Nam Giao là nơi các vua triều Nguyễn thực hiện tế lễ Trời Đất hàng năm. Công trình thể hiện quan niệm về vũ trụ của người phương Đông với 3 tầng hình vuông, tròn và bát giác.",
        descriptionEn: "Nam Giao Esplanade was where Nguyen emperors performed annual ceremonies to Heaven and Earth. Its three-tiered structure represents the Eastern cosmology with square, circular, and octagonal platforms.",
        type: "historical_site",
        latitude: "16.4454",
        longitude: "107.5778",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Nam_Giao_Esplanade.jpg/1280px-Nam_Giao_Esplanade.jpg"
      }
    ];

    // Add some initial categories
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

    // Add rich media resources
    const defaultResources: InsertResource[] = [
      {
        title: "Nhã nhạc cung đình Huế - Di sản văn hóa thế giới",
        titleEn: "Hue Royal Court Music - World Cultural Heritage",
        description: "Bản ghi âm các tác phẩm nhã nhạc tiêu biểu được trình diễn tại Huế",
        descriptionEn: "Recording of representative royal court music performed in Hue",
        type: "audio",
        category: "music",
        contentUrl: "https://example.com/audio/royal-court-music.mp3",
        thumbnailUrl: "https://example.com/images/royal-music-thumb.jpg",
        metadata: {
          format: "mp3",
          duration: "45:30",
          tracks: 12,
          year: 2023
        }
      },
      {
        title: "Kiến trúc Hoàng thành Huế qua các triều đại",
        titleEn: "Hue Imperial City Architecture Through Dynasties",
        description: "Phim tài liệu về lịch sử phát triển và đặc điểm kiến trúc của Hoàng thành Huế",
        descriptionEn: "Documentary about the historical development and architectural features of Hue Imperial City",
        type: "video",
        category: "historical_site",
        contentUrl: "https://example.com/videos/imperial-city-history.mp4",
        thumbnailUrl: "https://example.com/images/imperial-city-thumb.jpg",
        metadata: {
          format: "mp4",
          duration: "25:15",
          resolution: "1920x1080",
          language: "Vietnamese with English subtitles"
        }
      },
      {
        title: "Bộ ảnh lăng tẩm triều Nguyễn",
        titleEn: "Nguyen Dynasty Royal Tombs Photo Collection",
        description: "Bộ sưu tập hình ảnh chi tiết về kiến trúc và nghệ thuật của các lăng tẩm vua triều Nguyễn",
        descriptionEn: "Detailed photo collection of architecture and art in Nguyen Dynasty royal tombs",
        type: "image",
        category: "royal_tomb",
        contentUrl: "https://example.com/images/royal-tombs-collection.zip",
        thumbnailUrl: "https://example.com/images/tombs-thumb.jpg",
        metadata: {
          format: "jpg",
          count: 200,
          resolution: "4K",
          year: 2024
        }
      },
      {
        title: "Mô hình 3D Điện Thái Hòa",
        titleEn: "Thai Hoa Palace 3D Model",
        description: "Mô hình 3D chi tiết của Điện Thái Hòa, cho phép khám phá từng chi tiết kiến trúc",
        descriptionEn: "Detailed 3D model of Thai Hoa Palace, allowing exploration of architectural details",
        type: "3d_model",
        category: "royal_architecture",
        contentUrl: "https://example.com/3d/thai-hoa-palace.glb",
        thumbnailUrl: "https://example.com/images/thai-hoa-3d-thumb.jpg",
        metadata: {
          format: "glb",
          polygons: "2M",
          textures: "4K",
          size: "500MB"
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