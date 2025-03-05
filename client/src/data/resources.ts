import type { Resource } from "@shared/schema";

export const resources: Resource[] = [
  {
    id: 1,
    title: "Chùa Thiên Mụ – Biểu tượng linh thiêng của cố đô Huế",
    titleEn: "Thien Mu Pagoda - Sacred Symbol of Ancient Hue",
    type: "article",
    category: "heritage_sites",
    description: "Chùa Thiên Mụ hay còn gọi là chùa Linh Mụ, là một ngôi chùa cổ nằm trên đồi Hà Khê, tả ngạn sông Hương, cách trung tâm thành phố Huế khoảng 5km về phía tây.",
    contentUrl: "/assets/content/di-san-van-hoa/chua-thien-mu.html",
    thumbnailUrl: "/assets/images/di-san-van-hoa/chua-thien-mu/thumbnail.jpg",
    imageUrls: [
      "/assets/images/di-san-van-hoa/chua-thien-mu/thap-phuoc-duyen.jpg",
      "/assets/images/di-san-van-hoa/chua-thien-mu/cong-tam-quan.jpg", 
      "/assets/images/di-san-van-hoa/chua-thien-mu/toan-canh.jpg"
    ],
    author: "Ban Quản lý Di tích Cố đô Huế",
    source: "Tư liệu lịch sử Huế",
    tags: ["chùa", "di tích", "Phật giáo", "kiến trúc"],
    culturalPeriod: "Thời Nguyễn",
    historicalPeriod: "1601 - hiện tại",
    status: "published",
    viewCount: "0",
    createdAt: "2024-03-05T00:00:00.000Z"
  },
  {
    id: 2,
    title: "Hoàng thành Huế – Kiệt tác kiến trúc cung đình nhà Nguyễn",
    titleEn: "Hue Imperial City - Architectural Masterpiece of Nguyen Dynasty",
    type: "article",
    category: "heritage_sites",
    description: "Hoàng thành Huế là một quần thể di tích đồ sộ thuộc quần thể di tích Cố đô Huế - Di sản văn hóa thế giới được UNESCO công nhận.",
    contentUrl: "/resources/articles/hoang-thanh-hue.html",
    thumbnailUrl: "/assets/images/hoang-thanh/thumbnail.jpg",
    imageUrls: [
      "/assets/images/hoang-thanh/1.jpg", 
      "/assets/images/hoang-thanh/2.jpg",
      "/assets/images/hoang-thanh/3.jpg"
    ],
    author: "Ban Quản lý Di tích Cố đô Huế",
    source: "Tư liệu lịch sử Huế",
    tags: ["di sản", "kiến trúc", "triều Nguyễn", "cung đình"],
    culturalPeriod: "Thời Nguyễn",
    historicalPeriod: "1805 - 1945",
    status: "published",
    viewCount: "0",
    createdAt: "2024-03-05T00:00:00.000Z"
  },
  {
    id: 3,
    title: "Ca Huế – Tinh hoa âm nhạc xứ Kinh kỳ",
    titleEn: "Hue Traditional Music - The Essence of Imperial City's Art",
    type: "article",
    category: "performing_arts",
    description: "Ca Huế là một loại hình nghệ thuật truyền thống độc đáo của xứ Huế, kết hợp giữa âm nhạc và ca từ, thể hiện nét đẹp văn hóa và tâm hồn của người dân xứ Huế.",
    contentUrl: "/resources/articles/ca-hue.html",
    thumbnailUrl: "/assets/images/ca-hue/thumbnail.jpg",
    imageUrls: [
      "/assets/images/ca-hue/1.jpg",
      "/assets/images/ca-hue/2.jpg",
      "/assets/images/ca-hue/3.jpg"
    ],
    author: "Trung tâm Bảo tồn Văn hóa Huế",
    tags: ["âm nhạc", "nghệ thuật", "truyền thống", "di sản"],
    culturalPeriod: "Thời Nguyễn - hiện đại",
    status: "published",
    viewCount: "0",
    createdAt: "2024-03-05T00:00:00.000Z"
  },
  {
    id: 4,
    title: "Bài Chòi Huế - Di sản văn hóa độc đáo của miền Trung",
    titleEn: "Bai Choi - Unique Cultural Heritage of Central Vietnam",
    type: "article", 
    category: "performing_arts",
    description: "Bài chòi là một loại hình nghệ thuật dân gian độc đáo, kết hợp giữa trò chơi dân gian và nghệ thuật ca hát. Đây là di sản văn hóa phi vật thể đặc trưng của vùng đất Huế và miền Trung Việt Nam.",
    contentUrl: "/resources/articles/bai-choi.html",
    thumbnailUrl: "/assets/images/bai-choi/thumbnail.jpg",
    imageUrls: [
      "/assets/images/bai-choi/1.jpg",
      "/assets/images/bai-choi/2.jpg",
      "/assets/images/bai-choi/3.jpg"
    ],
    author: "Hội Văn nghệ dân gian Huế",
    tags: ["di sản", "nghệ thuật dân gian", "văn hóa", "trò chơi"],
    culturalPeriod: "Từ thế kỷ XVII - hiện đại",
    status: "published",
    viewCount: "0",
    createdAt: "2024-03-05T00:00:00.000Z"
  }
];