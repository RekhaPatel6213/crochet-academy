import { pool, isMySQLConnected } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const defaultTestimonials = [
  {
    id: 'test-1',
    name: 'Pooja Sharma',
    location: 'Gaur City 2, Greater Noida',
    review: 'I ordered the crochet rose & lily eternal bouquet for our wedding anniversary. It looks breathtaking in our living room and never wilts! Beautiful packaging.',
    tag: 'Eternal Bouquet',
    rating: 5,
    sortOrder: 1,
    active: true
  },
  {
    id: 'test-2',
    name: 'Rahul Verma',
    location: 'Sector 62, Noida',
    review: 'Ordered 40 customized sunflower keychains for our college farewell. Tishaya delivered everything on time with cute individual packaging. Super reliable!',
    tag: 'Bulk Farewell Order',
    rating: 5,
    sortOrder: 2,
    active: true
  },
  {
    id: 'test-3',
    name: 'Neha Gupta',
    location: 'Delhi',
    review: 'Joined Tishaya’s beginner crochet classes on weekends. She is so patient and broke down every stitch with ease. Now I can crochet granny square bags easily!',
    tag: 'Crochet Student',
    rating: 5,
    sortOrder: 3,
    active: true
  },
  {
    id: 'test-4',
    name: 'Priya Sen',
    location: 'Bengaluru, Karnataka',
    review: 'Pan-India shipping was surprisingly fast. The baby booties and wooden rattle gift set were packed in a lovely box. My sister loved it for her baby shower!',
    tag: 'Baby Shower Gift',
    rating: 5,
    sortOrder: 4,
    active: true
  }
];

export async function initTestimonials() {
  if (isMySQLConnected && pool) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS testimonials (
          id VARCHAR(100) NOT NULL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          location VARCHAR(255) DEFAULT '',
          review TEXT NOT NULL,
          tag VARCHAR(100) DEFAULT 'Customer Review',
          rating INT DEFAULT 5,
          avatar VARCHAR(500) DEFAULT '',
          sort_order INT DEFAULT 0,
          active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log('🐬 [MySQL] Verified testimonials table');

      const [existing] = await pool.query('SELECT COUNT(*) as cnt FROM testimonials');
      if (existing[0].cnt === 0) {
        for (const t of defaultTestimonials) {
          await pool.query(
            'INSERT INTO testimonials (id, name, location, review, tag, rating, sort_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [t.id, t.name, t.location, t.review, t.tag, t.rating, t.sortOrder, t.active]
          );
        }
        console.log(`🐬 [MySQL] Successfully seeded ${defaultTestimonials.length} testimonials`);
      }
    } catch (err) {
      console.error('❌ [MySQL] Error initializing testimonials table:', err.message);
    }
  }

  // Update database.json
  const dbPath = path.join(__dirname, 'database.json');
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(raw);
    if (!data.testimonials || data.testimonials.length === 0) {
      data.testimonials = defaultTestimonials;
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
      console.log('📄 [JSON] Synced default testimonials to database.json');
    }
  } catch (err) {
    console.error('❌ [JSON] Error writing testimonials to database.json:', err.message);
  }
}

if (process.argv[1] && process.argv[1].endsWith('init-testimonials.js')) {
  initTestimonials().then(() => {
    console.log('✨ Testimonials initialization complete!');
    process.exit(0);
  });
}

