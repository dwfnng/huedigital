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
        description: "Kỳ Đài là một trong những công trình kiến trúc tiêu biểu của Cố đô Huế",
        descriptionEn: "The Flag Tower is one of the iconic architectural works of Hue Ancient Capital",
        type: "historical_site",
        latitude: 16.4698,
        longitude: 107.5723,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Flag_Tower_of_Hu%E1%BA%BF.jpg/1280px-Flag_Tower_of_Hu%E1%BA%BF.jpg"
      },
      {
        name: "Điện Thái Hòa",
        nameEn: "Thai Hoa Palace",
        description: "Điện Thái Hòa là công trình chính và quan trọng nhất của triều Nguyễn",
        descriptionEn: "Thai Hoa Palace is the main and most important building of the Nguyen Dynasty",
        type: "historical_site",
        latitude: 16.4697,
        longitude: 107.5776,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Thai_Hoa_Palace.jpg/1280px-Thai_Hoa_Palace.jpg"
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
        name: "Tài liệu hoàng gia",
        nameEn: "Royal Documents",
        description: "Bộ sưu tập tài liệu hoàng gia thời Nguyễn",
        descriptionEn: "Collection of Nguyen Dynasty royal documents",
      },
    ];

    // Add some initial resources
    const defaultResources: InsertResource[] = [
      {
        title: "Điện Thái Hòa",
        titleEn: "Thai Hoa Palace",
        description: "Tư liệu về điện Thái Hòa - công trình chính của triều Nguyễn",
        descriptionEn: "Documents about Thai Hoa Palace - the main building of Nguyen Dynasty",
        type: "document",
        category: "historical_site",
        contentUrl: "https://example.com/documents/thai-hoa-palace.pdf",
        thumbnailUrl: "https://example.com/images/thai-hoa-palace-thumb.jpg",
        metadata: {
          format: "pdf",
          size: "2.5MB",
          pages: 15
        }
      },
      {
        title: "Nhã nhạc cung đình Huế",
        titleEn: "Hue Royal Court Music",
        description: "Bản ghi âm nhã nhạc cung đình - di sản văn hóa phi vật thể",
        descriptionEn: "Recording of royal court music - intangible cultural heritage",
        type: "audio",
        category: "music",
        contentUrl: "https://example.com/audio/royal-court-music.mp3",
        thumbnailUrl: "https://example.com/images/royal-music-thumb.jpg",
        metadata: {
          format: "mp3",
          duration: "45:30",
          size: "15MB"
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