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
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_Tower_in_the_Imperial_City%2C_Hu%E1%BA%BF.jpg/1200px-Flag_Tower_in_the_Imperial_City%2C_Hu%E1%BA%BF.jpg"
      },
      {
        name: "Trường Quốc Tử Giám",
        nameEn: "Quoc Tu Giam School",
        description: "Trường Quốc Tử Giám là trường học đầu tiên của triều Nguyễn, nơi đào tạo con em các quan lại và những người ưu tú. Được xây dựng năm 1803 dưới thời vua Gia Long.",
        descriptionEn: "Quoc Tu Giam was the first school of the Nguyen Dynasty, educating children of officials and talented students. Built in 1803 during King Gia Long's reign.",
        type: "historical_site",
        latitude: "16.4689",
        longitude: "107.5735",
        imageUrl: "https://hueworldheritage.org.vn/Portals/0/Medias/Nam2020/Thang8/0108/quoc-tu-giam-hue.jpg"
      },
      {
        name: "Điện Long An",
        nameEn: "Long An Palace",
        description: "Điện Long An là nơi trưng bày nhiều cổ vật quý của triều Nguyễn, hiện là Bảo tàng Mỹ thuật Cung đình Huế. Điện Long An được xây dựng vào năm 1845 dưới thời vua Thiệu Trị, với kiến trúc độc đáo và những họa tiết chạm khắc tinh tế.",
        descriptionEn: "Long An Palace now houses the Museum of Royal Fine Arts, displaying precious antiques from the Nguyen Dynasty. Built in 1845 during King Thieu Tri's reign, it features unique architecture and intricate carvings.",
        type: "historical_site",
        latitude: "16.4695",
        longitude: "107.5774",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Long_An_Palace%2C_Hue_%2814018169031%29.jpg"
      },
      {
        name: "Điện Thái Hòa",
        nameEn: "Thai Hoa Palace",
        description: "Điện Thái Hòa là công trình chính và quan trọng nhất của triều Nguyễn, nơi diễn ra các đại lễ và thiết triều của vua. Điện được xây dựng năm 1805 và được trùng tu nhiều lần. Đây là nơi vua ngự triều, tiếp kiến các sứ thần nước ngoài và tổ chức các nghi lễ quan trọng.",
        descriptionEn: "Thai Hoa Palace is the main and most important building of the Nguyen Dynasty, where major ceremonies and court meetings were held. Built in 1805, it has been restored several times. This is where the king held court, received foreign envoys, and conducted important ceremonies.",
        type: "historical_site",
        latitude: "16.4697",
        longitude: "107.5776",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Thai_Hoa_palace.jpg"
      },
      {
        name: "Hồ Tịnh Tâm",
        nameEn: "Tinh Tam Lake",
        description: "Hồ Tịnh Tâm là một trong những hồ cảnh quan đẹp nhất trong Kinh thành Huế, nơi vua chúa thường đến thưởng ngoạn và ngắm hoa sen. Hồ được xây dựng vào đầu thế kỷ 19, là nơi nghỉ dưỡng và thư giãn của hoàng gia. Có 3 đảo nhỏ nằm giữa hồ, tượng trưng cho 3 ngọn núi trong truyền thuyết.",
        descriptionEn: "Tinh Tam Lake is one of the most beautiful scenic lakes in Hue Citadel, where kings often came to enjoy the scenery and lotus flowers. Built in the early 19th century, it was a place for royal relaxation. Three small islands in the middle of the lake symbolize three legendary mountains.",
        type: "historical_site",
        latitude: "16.4705",
        longitude: "107.5768",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Ho_Tinh_Tam.jpg"
      },
      {
        name: "Bảo tàng Mỹ thuật Cung đình Huế",
        nameEn: "Hue Royal Fine Arts Museum",
        description: "Bảo tàng Mỹ thuật Cung đình Huế là nơi lưu giữ và trưng bày các hiện vật giá trị về nghệ thuật thời Nguyễn. Bảo tàng được đặt trong Điện Long An, trưng bày hơn 7000 hiện vật gồm đồ sành sứ, gốm, ngọc thạch, và các tác phẩm nghệ thuật khác.",
        descriptionEn: "The Hue Royal Fine Arts Museum preserves and displays valuable Nguyen Dynasty art artifacts. Located in Long An Palace, it houses over 7000 items including ceramics, pottery, jade, and other art works.",
        type: "historical_site",
        latitude: "16.4695",
        longitude: "107.5774",
        imageUrl: "https://media.mia.vn/uploads/blog-du-lich/bao-tang-my-thuat-cung-dinh-hue-noi-gin-giu-net-dep-van-hoa-co-kinh-1-1637922515.jpg"
      },
      {
        name: "Đình Phú Xuân",
        nameEn: "Phu Xuan Communal House",
        description: "Đình Phú Xuân là công trình kiến trúc cổ tại Huế, nơi diễn ra các hoạt động tôn giáo, tín ngưỡng và các sinh hoạt cộng đồng của người dân. Đình được xây dựng theo kiến trúc truyền thống Việt Nam với nhiều họa tiết chạm khắc tinh xảo.",
        descriptionEn: "Phu Xuan Communal House is an ancient architectural work in Hue, where religious activities and community gatherings took place. Built in traditional Vietnamese architectural style with elaborate carvings.",
        type: "historical_site",
        latitude: "16.4680",
        longitude: "107.5750",
        imageUrl: "https://cdn.tgdd.vn/Files/2021/06/22/1362228/10-dia-diem-du-lich-noi-tieng-o-hue-ban-nen-den-tham-quan-mot-lan-202201041501402042.jpg"
      },
      {
        name: "Viện Cơ Mật Tam Toà",
        nameEn: "Tam Toa Secret Council",
        description: "Viện Cơ Mật Tam Toà là cơ quan tham mưu cao nhất của triều Nguyễn, nơi bàn bạc và quyết định các chính sách quan trọng của triều đình. Được xây dựng vào năm 1834 dưới thời vua Minh Mạng, viện có vai trò như một hội đồng nội các.",
        descriptionEn: "Tam Toa Secret Council was the highest advisory body of the Nguyen Dynasty, where important policies were discussed and decided. Built in 1834 during King Minh Mang's reign, it functioned as a cabinet council.",
        type: "historical_site",
        latitude: "16.4702",
        longitude: "107.5780",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Co_Mat_Vien.JPG/1200px-Co_Mat_Vien.JPG"
      },
      {
        name: "Cửu Vị Thần Công",
        nameEn: "Nine Sacred Cannons",
        description: "Cửu Vị Thần Công là chín khẩu đại bác được đúc vào năm 1804 dưới thời vua Gia Long, tượng trưng cho sức mạnh quân sự của triều Nguyễn. Mỗi khẩu đại bác tượng trưng cho một mùa trong năm và có tên gọi riêng.",
        descriptionEn: "The Nine Sacred Cannons were cast in 1804 during King Gia Long's reign, symbolizing the military power of the Nguyen Dynasty. Each cannon represents a season of the year and has its own name.",
        type: "historical_site",
        latitude: "16.4699",
        longitude: "107.5785",
        imageUrl: "https://img.nhandan.com.vn/Files/Images/2021/03/03/a10-1614741129844.jpg"
      },
      {
        name: "Hoàng Thành Huế",
        nameEn: "Hue Imperial City",
        description: "Hoàng Thành Huế là quần thể kiến trúc rộng lớn bao gồm Kinh thành, Hoàng thành và Tử Cấm thành, được xây dựng từ năm 1805 đến 1832. Đây là trung tâm chính trị, văn hóa và tôn giáo của Việt Nam thời Nguyễn, được UNESCO công nhận là Di sản Văn hóa Thế giới.",
        descriptionEn: "Hue Imperial City is a vast architectural complex including the Citadel, Imperial City, and Forbidden Purple City, built from 1805 to 1832. It was the political, cultural, and religious center of Vietnam during the Nguyen Dynasty, recognized by UNESCO as a World Cultural Heritage site.",
        type: "historical_site",
        latitude: "16.4701",
        longitude: "107.5770",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meridian_Gate%2C_Hu%E1%BA%BF_Citadel.jpg/1200px-Meridian_Gate%2C_Hu%E1%BA%BF_Citadel.jpg"
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
        contentUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Royal_Music_Performance_at_the_Citadel%2C_Hu%E1%BA%BF_-_2012.jpg/1200px-Royal_Music_Performance_at_the_Citadel%2C_Hu%E1%BA%BF_-_2012.jpg",
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
        contentUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
        thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Imperial_City%2C_Hu%E1%BA%BF.jpg",
        metadata: {
          format: "mp4",
          duration: "35:20",
          resolution: "3840x2160",
          language: "Vietnamese with English subtitles",
          size: "2.1GB"
        }
      },
      {
        title: "Lịch sử và vai trò của Trường Quốc Tử Giám",
        titleEn: "History and Role of Quoc Tu Giam School",
        description: "Tài liệu nghiên cứu về hệ thống giáo dục của triều Nguyễn, tập trung vào Trường Quốc Tử Giám và ảnh hưởng của nó đối với xã hội Việt Nam thời bấy giờ.",
        descriptionEn: "Research document on the Nguyen Dynasty's educational system, focusing on Quoc Tu Giam School and its influence on Vietnamese society at that time.",
        type: "document",
        category: "academic",
        contentUrl: "https://www.africau.edu/images/default/sample.pdf",
        thumbnailUrl: "https://hueworldheritage.org.vn/Portals/0/Medias/Nam2020/Thang8/0108/truong-quoc-tu-giam-hue.jpg",
        metadata: {
          format: "pdf",
          pages: 78,
          year: 2022,
          author: "PGS.TS. Nguyễn Văn A",
          size: "12.5MB"
        }
      },
      {
        title: "Nghệ thuật trang trí cung đình thời Nguyễn",
        titleEn: "Nguyen Dynasty Court Decorative Arts",
        description: "Bộ sưu tập hình ảnh chất lượng cao về các họa tiết trang trí, đồ dùng, và nghệ thuật triều Nguyễn được lưu giữ tại Bảo tàng Mỹ thuật Cung đình Huế.",
        descriptionEn: "High-quality image collection of decorative patterns, utensils, and arts from the Nguyen Dynasty preserved at the Hue Royal Fine Arts Museum.",
        type: "image",
        category: "artwork",
        contentUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Long_An_Palace3.jpg/1280px-Long_An_Palace3.jpg",
        thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Long_An_Palace3.jpg/320px-Long_An_Palace3.jpg",
        metadata: {
          format: "jpg",
          resolution: "4096x2730",
          items: 150,
          year: 2021,
          photographer: "Trần Văn B",
          size: "450MB"
        }
      },
      {
        title: "Tư liệu về các Châu bản triều Nguyễn",
        titleEn: "Documents on Nguyen Dynasty Royal Decrees",
        description: "Nghiên cứu về hệ thống văn bản hành chính và châu bản triều Nguyễn, một di sản tư liệu quý giá được UNESCO công nhận là Di sản tư liệu thế giới.",
        descriptionEn: "Research on the administrative documents and royal decrees of the Nguyen Dynasty, a valuable documentary heritage recognized by UNESCO as World Documentary Heritage.",
        type: "document",
        category: "royal_document",
        contentUrl: "https://www.africau.edu/images/default/sample.pdf",
        thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Chau_ban_trieu_Nguyen.jpg/800px-Chau_ban_trieu_Nguyen.jpg",
        metadata: {
          format: "pdf",
          pages: 123,
          year: 2020,
          author: "GS.TS. Trần Văn C",
          size: "28.7MB"
        }
      },
      {
        title: "Kiến trúc Điện Thái Hòa và ý nghĩa biểu tượng",
        titleEn: "Thai Hoa Palace Architecture and Symbolic Meaning",
        description: "Video phân tích chi tiết về kiến trúc, bố cục và ý nghĩa biểu tượng của Điện Thái Hòa, công trình trung tâm của Hoàng thành Huế.",
        descriptionEn: "Detailed video analysis of the architecture, layout, and symbolic meaning of Thai Hoa Palace, the central building of Hue Imperial City.",
        type: "video",
        category: "architecture",
        contentUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
        thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Thai_Hoa_palace.jpg",
        metadata: {
          format: "mp4",
          duration: "28:45",
          resolution: "1920x1080",
          language: "Vietnamese with English subtitles",
          size: "1.2GB"
        }
      },
      {
        title: "Mô hình 3D Hoàng thành Huế",
        titleEn: "3D Model of Hue Imperial City",
        description: "Mô hình 3D chi tiết của toàn bộ quần thể Hoàng thành Huế, cho phép người xem khám phá tất cả các công trình kiến trúc từ nhiều góc độ khác nhau.",
        descriptionEn: "Detailed 3D model of the entire Hue Imperial City complex, allowing viewers to explore all architectural structures from various angles.",
        type: "3d_model",
        category: "architecture",
        contentUrl: "https://sketchfab.com/models/35fbb1d7e9574a5a83e5e229272c38b3/embed",
        thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meridian_Gate%2C_Hu%E1%BA%BF_Citadel.jpg/320px-Meridian_Gate%2C_Hu%E1%BA%BF_Citadel.jpg",
        metadata: {
          format: "gltf",
          polygons: "1.2 million",
          textures: "4K resolution",
          year: 2023,
          creator: "Đoàn Văn D",
          size: "185MB"
        }
      },
      {
        title: "Âm nhạc truyền thống Huế - Bộ sưu tập",
        titleEn: "Traditional Hue Music - Collection",
        description: "Bộ sưu tập các bản nhạc truyền thống Huế, bao gồm ca Huế, nhã nhạc cung đình và các thể loại âm nhạc dân gian đặc trưng của vùng đất cố đô.",
        descriptionEn: "Collection of traditional Hue music, including Hue songs, royal court music, and folk music genres characteristic of the ancient capital region.",
        type: "audio",
        category: "music",
        contentUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/Traditional_Hue_royal_court_music.jpg",
        metadata: {
          format: "mp3",
          duration: "78:20",
          tracks: 18,
          year: 2021,
          quality: "320kbps",
          size: "178MB"
        }
      },
      {
        title: "Lễ hội truyền thống tại Cố đô Huế",
        titleEn: "Traditional Festivals in Hue Ancient Capital",
        description: "Video tài liệu về các lễ hội truyền thống được tổ chức tại Huế, như Festival Huế, lễ hội đền Huyền Trân, lễ tế Giao và các nghi lễ cung đình khác.",
        descriptionEn: "Documentary video about traditional festivals held in Hue, such as Hue Festival, Huyen Tran Temple Festival, Heaven and Earth Worship Ceremony, and other court rituals.",
        type: "video",
        category: "cultural_festivals",
        contentUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
        thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Hue_Festival_2014_opening_ceremony.jpg",
        metadata: {
          format: "mp4",
          duration: "42:18",
          resolution: "1920x1080",
          language: "Vietnamese with English subtitles",
          size: "1.8GB"
        }
      },
      {
        title: "Nghiên cứu về hệ thống thủy lợi thời Nguyễn tại Huế",
        titleEn: "Research on Nguyen Dynasty Irrigation Systems in Hue",
        description: "Báo cáo khoa học về hệ thống thủy lợi và quản lý nước thời Nguyễn tại Huế, một thành tựu kỹ thuật đáng chú ý của thời kỳ này.",
        descriptionEn: "Scientific report on the irrigation system and water management during the Nguyen Dynasty in Hue, a notable technical achievement of this period.",
        type: "research",
        category: "academic",
        contentUrl: "https://www.africau.edu/images/default/sample.pdf",
        thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Ho_Tinh_Tam.jpg/320px-Ho_Tinh_Tam.jpg",
        metadata: {
          format: "pdf",
          pages: 95,
          year: 2023,
          author: "TS. Lê Văn E",
          size: "15.3MB"
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