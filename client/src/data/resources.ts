import type { Resource } from "@shared/schema";

export const resources: Resource[] = [
  {
    id: 1,
    title: "Chùa Thiên Mụ – Biểu tượng linh thiêng của cố đô Huế",
    titleEn: "Thien Mu Pagoda - Sacred Symbol of Ancient Hue",
    type: "article",
    category: "heritage_sites", 
    description: "Chùa Thiên Mụ hay còn gọi là chùa Linh Mụ, là một ngôi chùa cổ nằm trên đồi Hà Khê, tả ngạn sông Hương, cách trung tâm thành phố Huế khoảng 5km về phía tây.",
    textContent: "/resources/chua-thien-mu.html",
    thumbnailUrl: "/resources/images/chua-thien-mu.jpg",
    imageUrls: [
      "/resources/images/chua-thien-mu-1.jpg",
      "/resources/images/chua-thien-mu-2.jpg",
      "/resources/images/chua-thien-mu-3.jpg"
    ],
    author: "Ban Quản lý Di tích Cố đô Huế",
    source: "Tư liệu lịch sử Huế",
    tags: ["chùa", "di tích", "Phật giáo", "kiến trúc"],
    culturalPeriod: "Thời Nguyễn",
    historicalPeriod: "1601 - hiện tại",
    createdAt: new Date("2024-03-05").toISOString()
  },
  {
    id: 2,
    title: "Hoàng thành Huế – Kiệt tác kiến trúc cung đình nhà Nguyễn",
    titleEn: "Hue Imperial City - Architectural Masterpiece of Nguyen Dynasty",
    type: "article",
    category: "heritage_sites",
    description: "Hoàng thành Huế là một quần thể di tích đồ sộ thuộc quần thể di tích Cố đô Huế - Di sản văn hóa thế giới được UNESCO công nhận.",
    textContent: "/resources/hoang-thanh-hue.html",
    thumbnailUrl: "/resources/images/hoang-thanh.jpg",
    imageUrls: [
      "/resources/images/hoang-thanh-1.jpg",
      "/resources/images/hoang-thanh-2.jpg",
      "/resources/images/hoang-thanh-3.jpg"
    ],
    author: "Ban Quản lý Di tích Cố đô Huế",
    source: "Tư liệu lịch sử Huế",
    tags: ["di sản", "kiến trúc", "triều Nguyễn", "cung đình"],
    culturalPeriod: "Thời Nguyễn",
    historicalPeriod: "1805 - 1945",
    createdAt: new Date("2024-03-05").toISOString()
  },
  {
    id: 3,
    title: "Ca Huế – Tinh hoa âm nhạc xứ Kinh kỳ",
    titleEn: "Hue Traditional Music - The Essence of Imperial City's Art",
    type: "article",
    category: "performing_arts",
    description: "Ca Huế là một loại hình nghệ thuật truyền thống độc đáo của xứ Huế, kết hợp giữa âm nhạc và ca từ, thể hiện nét đẹp văn hóa và tâm hồn của người dân xứ Huế.",
    textContent: "/resources/ca-hue.html",
    thumbnailUrl: "/resources/images/ca-hue.jpg",
    author: "Trung tâm Bảo tồn Văn hóa Huế",
    tags: ["âm nhạc", "nghệ thuật", "truyền thống", "di sản"],
    culturalPeriod: "Thời Nguyễn - hiện đại",
    createdAt: new Date("2024-03-05").toISOString()
  },
  {
    id: 4,
    title: "Bài Chòi Huế - Di sản văn hóa độc đáo của miền Trung",
    titleEn: "Bai Choi - Unique Cultural Heritage of Central Vietnam",
    type: "article", 
    category: "performing_arts",
    description: "Bài chòi là một loại hình nghệ thuật dân gian độc đáo, kết hợp giữa trò chơi dân gian và nghệ thuật ca hát. Đây là di sản văn hóa phi vật thể đặc trưng của vùng đất Huế và miền Trung Việt Nam.",
    textContent: "/resources/bai-choi.html",
    thumbnailUrl: "/resources/images/bai-choi.jpg",
    author: "Hội Văn nghệ dân gian Huế",
    tags: ["di sản", "nghệ thuật dân gian", "văn hóa", "trò chơi"],
    culturalPeriod: "Từ thế kỷ XVII - hiện đại",
    createdAt: new Date("2024-03-05").toISOString()
  }
];