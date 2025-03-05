import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../shared/schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

const resourcesData = [
  {
    title: "Chùa Thiên Mụ – Biểu tượng linh thiêng của cố đô Huế",
    titleEn: "Thien Mu Pagoda - Sacred Symbol of Ancient Hue",
    type: "article",
    category: "heritage_sites",
    description: `Chùa Thiên Mụ hay còn gọi là chùa Linh Mụ, là một ngôi chùa cổ nằm trên đồi Hà Khê, tả ngạn sông Hương, cách trung tâm thành phố Huế khoảng 5km về phía tây. Đây là ngôi chùa cổ nhất tại cố đô Huế, được xây dựng từ năm 1601 dưới thời chúa Nguyễn Hoàng.`,
    textContent: `
      <h1>Lịch sử hình thành</h1>
      <p>Chùa được xây dựng vào năm 1601 dưới thời chúa Nguyễn Hoàng. Theo truyền thuyết, một đêm chúa Nguyễn Hoàng nằm mộng thấy một bà lão mặc áo đỏ quần xanh ngồi trên đỉnh đồi Hà Khê, nói rằng sẽ có một vị chân chủ đến xây chùa nơi đây để tụ khí thiêng, giúp cho việc trấn yểm long mạch và phát triển bền vững cho đất nước.</p>

      <h2>Kiến trúc độc đáo</h2>
      <p>Điểm nhấn của chùa Thiên Mụ là Tháp Phước Duyên 7 tầng cao 21m, được vua Thiệu Trị cho xây dựng năm 1844. Mỗi tầng tháp thờ một vị Phật khác nhau. Tháp đã trở thành biểu tượng của thành phố Huế và là một trong những công trình kiến trúc Phật giáo đặc sắc nhất của Việt Nam.</p>

      <h2>Di tích và cổ vật quý</h2>
      <p>Chùa còn lưu giữ nhiều cổ vật quý như chuông đồng đúc năm 1710 nặng 2.052 kg, bia đá khắc thơ của các vua triều Nguyễn. Đặc biệt là chiếc xe Austin của Hòa thượng Thích Quảng Đức - một chứng tích lịch sử quan trọng.</p>
    `,
    imageUrls: [
      "/attached_assets/chua-thien-mu-1.jpg",
      "/attached_assets/chua-thien-mu-2.jpg",
      "/attached_assets/chua-thien-mu-3.jpg"
    ],
    author: "Ban Quản lý Di tích Cố đô Huế",
    source: "Tư liệu lịch sử Huế",
    tags: ["chùa", "di tích", "Phật giáo", "kiến trúc"],
    culturalPeriod: "Thời Nguyễn",
    historicalPeriod: "1601 - hiện tại",
    geographicalContext: "Đồi Hà Khê, Huế",
    culturalSignificance: "Biểu tượng tâm linh và kiến trúc của Huế"
  },
  {
    title: "Hoàng thành Huế – Kiệt tác kiến trúc cung đình nhà Nguyễn",
    titleEn: "Hue Imperial City - Architectural Masterpiece of Nguyen Dynasty",
    type: "article",
    category: "heritage_sites",
    description: `Hoàng thành Huế là một quần thể di tích đồ sộ thuộc quần thể di tích Cố đô Huế - Di sản văn hóa thế giới được UNESCO công nhận. Đây là nơi đặt trung tâm chính trị của vương triều Nguyễn.`,
    textContent: `
      <h1>Giới thiệu chung</h1>
      <p>Hoàng thành Huế được xây dựng từ năm 1805 dưới thời vua Gia Long và hoàn thành vào năm 1832 dưới thời vua Minh Mạng. Quần thể này bao gồm Kinh thành (Thành ngoài) và Hoàng thành (Thành trong), với diện tích khoảng 520 ha.</p>

      <h2>Kiến trúc độc đáo</h2>
      <p>Hoàng thành Huế được xây dựng theo nguyên tắc phong thủy và triết lý âm dương với nhiều công trình kiến trúc độc đáo như Ngọ Môn, điện Thái Hòa, Tử Cấm Thành, Thế Miếu, và Hiển Lâm Các.</p>
    `,
    imageUrls: [
      "/attached_assets/hoang-thanh-1.jpg",
      "/attached_assets/hoang-thanh-2.jpg",
      "/attached_assets/hoang-thanh-3.jpg"
    ],
    author: "Ban Quản lý Di tích Cố đô Huế",
    source: "Tư liệu lịch sử Huế",
    tags: ["di sản", "kiến trúc", "triều Nguyễn", "cung đình"],
    culturalPeriod: "Thời Nguyễn",
    historicalPeriod: "1805 - 1945",
    geographicalContext: "Trung tâm Thành phố Huế",
    culturalSignificance: "Trung tâm quyền lực và văn hóa triều Nguyễn"
  },
  {
    title: "Ca Huế – Tinh hoa âm nhạc xứ Kinh kỳ",
    titleEn: "Hue Traditional Music - The Essence of Imperial City's Art",
    type: "article",
    category: "performing_arts",
    description: `Ca Huế là một loại hình nghệ thuật truyền thống độc đáo của xứ Huế, kết hợp giữa âm nhạc và ca từ, thể hiện nét đẹp văn hóa và tâm hồn của người dân xứ Huế.`,
    textContent: `
      <h1>Nguồn gốc và đặc trưng</h1>
      <p>Ca Huế ra đời và phát triển từ thời các chúa Nguyễn, là sự kết hợp giữa nhã nhạc cung đình và âm nhạc dân gian. Nghệ thuật này thường được biểu diễn trên thuyền đêm sông Hương hoặc trong các không gian truyền thống.</p>

      <h2>Các làn điệu chính</h2>
      <p>Ca Huế có nhiều làn điệu như: Nam ai, Nam bình, Lý hoài nam, Tứ đại cảnh, và nhiều điệu lý dân ca khác. Mỗi làn điệu đều mang những cảm xúc và nội dung riêng biệt.</p>
    `,
    author: "Trung tâm Bảo tồn Văn hóa Huế",
    tags: ["âm nhạc", "nghệ thuật", "truyền thống", "di sản"],
    culturalPeriod: "Thời Nguyễn - hiện đại",
    culturalSignificance: "Di sản văn hóa phi vật thể đặc sắc của Huế"
  },
  {
    title: "Bài Chòi Huế - Di sản văn hóa độc đáo của miền Trung",
    titleEn: "Bai Choi - Unique Cultural Heritage of Central Vietnam",
    type: "article",
    category: "performing_arts",
    description: `Bài chòi là một loại hình nghệ thuật dân gian độc đáo, kết hợp giữa trò chơi dân gian và nghệ thuật ca hát. Đây là di sản văn hóa phi vật thể đặc trưng của vùng đất Huế và miền Trung Việt Nam.`,
    textContent: `
      <h1>Nguồn gốc lịch sử</h1>
      <p>Bài chòi xuất hiện từ thế kỷ XVII, ban đầu là một trò chơi dân gian trong các dịp lễ hội. Về sau, nó phát triển thành một loại hình nghệ thuật tổng hợp, kết hợp giữa âm nhạc, thơ ca và trò chơi dân gian.</p>

      <h2>Đặc trưng nghệ thuật</h2>
      <p>Bài chòi bao gồm các yếu tố nghệ thuật đa dạng như hát, kể, diễn xướng và trò chơi. Người chơi ngồi trong các chòi tre, nghe hát và tham gia đánh bài theo quy tắc đặc biệt.</p>
    `,
    author: "Hội Văn nghệ dân gian Huế",
    tags: ["di sản", "nghệ thuật dân gian", "văn hóa", "trò chơi"],
    culturalPeriod: "Từ thế kỷ XVII - hiện đại",
    culturalSignificance: "Di sản văn hóa phi vật thể đặc trưng của miền Trung"
  }
];

async function main() {
  console.log('Bắt đầu khởi tạo dữ liệu...');

  try {
    // Import dữ liệu
    for (const resource of resourcesData) {
      await db.insert(schema.resources).values(resource);
      console.log(`Đã thêm bài viết: ${resource.title}`);
    }

    console.log('Khởi tạo dữ liệu thành công');
  } catch (error) {
    console.error('Lỗi khi khởi tạo dữ liệu:', error);
  } finally {
    await client.end();
  }
}

main();