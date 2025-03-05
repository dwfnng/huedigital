import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from '../../shared/schema';

// Initialize drizzle with schema
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

// Define resources data
const resourcesData = [
  {
    title: 'Giọng Huế - Nét đặc trưng văn hóa xứ Huế',
    type: 'article',
    category: 'cultural_practices',
    description: `
      <h1>Giọng Huế - Đặc trưng văn hóa độc đáo</h1>
      <p>Giọng Huế là một trong những nét văn hóa đặc trưng của người dân xứ Huế, được thể hiện qua cách phát âm và ngữ điệu riêng biệt. Đây không chỉ là một phương ngữ đơn thuần mà còn là di sản văn hóa phi vật thể, phản ánh tính cách, lối sống và tâm hồn của người Huế.</p>
    `,
    contentUrl: '/articles/giong-hue',
    thumbnailUrl: '/images/giong-hue.jpg',
    authorInfo: 'Viện Nghiên cứu Văn hóa Huế',
    sourceInfo: 'Tư liệu văn hóa Huế',
    tags: ['văn hóa', 'ngôn ngữ', 'bản sắc'],
    culturalSignificance: 'Thể hiện bản sắc văn hóa và đặc trưng của người dân Huế',
    historicalPeriod: 'Đương đại'
  },
  {
    title: 'Điện Hòn Chén - Thánh tích linh thiêng bên sông Hương',
    type: 'article',
    category: 'heritage_sites',
    description: `
      <h1>Điện Hòn Chén - Di tích tâm linh độc đáo</h1>
      <p>Điện Hòn Chén hay còn gọi là điện Huệ Nam là một trong những công trình kiến trúc tâm linh độc đáo của Huế. Tọa lạc bên bờ sông Hương thơ mộng, điện không chỉ là nơi thờ cúng mà còn là điểm đến văn hóa tâm linh quan trọng của du khách khi đến Huế.</p>
    `,
    contentUrl: '/articles/dien-hon-chen',
    thumbnailUrl: '/images/dien-hon-chen.jpg',
    authorInfo: 'Ban Quản lý Di tích Huế',
    sourceInfo: 'Tư liệu Di sản Huế',
    tags: ['di tích', 'tâm linh', 'kiến trúc'],
    culturalSignificance: 'Là trung tâm tín ngưỡng quan trọng của người dân Huế',
    historicalPeriod: 'Triều Nguyễn'
  }
];

async function main() {
  console.log('Starting database initialization...');
  
  try {
    // Insert resources
    for (const resource of resourcesData) {
      await db.insert(schema.resources).values(resource);
    }
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await client.end();
  }
}

main();
