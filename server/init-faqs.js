import { pool, isMySQLConnected } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultFaqs = [
  {
    id: 'faq-1',
    category: 'Orders',
    question: 'How can I place an order with Tishaya Petal & Loop?',
    answer: 'You can easily place an order right here through our website by browsing our Handcrafted Shop and adding items to your cart with instant order placement, or directly message us on WhatsApp (+91 9099962395) with screenshots or names of your selected creations.',
    sortOrder: 1,
    active: true
  },
  {
    id: 'faq-2',
    category: 'Custom',
    question: 'Can I customize the color, flower arrangement, or size of a bouquet?',
    answer: "Yes, absolutely! We specialize in bespoke commissions. You can click on 'Custom Order' in our navigation bar or message us on WhatsApp with your favorite color palette, desired flower species (roses, sunflowers, tulips, daisies, lilies), ribbon text, or reference photos. We will craft it to your exact preferences.",
    sortOrder: 2,
    active: true
  },
  {
    id: 'faq-3',
    category: 'Shipping',
    question: 'How long does delivery take across India, and how are fragile bouquets packed?',
    answer: 'Orders are dispatched within 24–48 hours from our Greater Noida West studio. Standard tracked shipping reaches Delhi NCR in 1–2 days, major metro cities (Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Pune) in 2–4 business days, and other regions in 4–6 business days. Each delicate bouquet and amigurumi plush is safely nestled in crush-resistant aesthetic gift boxing with bubble wrap protection.',
    sortOrder: 3,
    active: true
  },
  {
    id: 'faq-4',
    category: 'Classes',
    question: 'Do you offer crochet classes in Greater Noida West and online?',
    answer: 'Yes! We run comprehensive online interactive video masterclasses with verified certification, as well as hands-on weekend studio sessions at Gaur City 2, Greater Noida West. Our courses cater to all experience levels — from absolute beginner stitch basics (slip knots, single crochet, magic ring) to complex 3D amigurumi plushies, wearables, and multi-colored granny square blankets.',
    sortOrder: 4,
    active: true
  },
  {
    id: 'faq-5',
    category: 'Studio',
    question: 'Where is your physical studio located and what are your visiting hours?',
    answer: 'Our creative studio and workshop is located at 2039, 12th Avenue, Gaur City 2, Greater Noida West, Uttar Pradesh 201009. We are open for student classes, gift pick-ups, and studio visits every day from 10:00 AM to 9:00 PM IST. If visiting in person, drop us a quick WhatsApp ping before coming so we can prepare your items!',
    sortOrder: 5,
    active: true
  },
  {
    id: 'faq-6',
    category: 'Orders',
    question: 'What kind of yarn and materials do you use for your flowers and plushies?',
    answer: 'We use exclusively premium 100% baby-safe, hypoallergenic combed milk cotton, acrylic, and chenille velvet yarns. They are lint-free, soft to the touch, washable, colorfast, and long-lasting — meaning your crochet bouquets will never wilt, fade, or trigger allergies like fresh flowers.',
    sortOrder: 6,
    active: true
  },
  {
    id: 'faq-7',
    category: 'Orders',
    question: 'Do you accept bulk, corporate, or return-gift orders for weddings and events?',
    answer: 'Yes! We frequently craft bulk handcrafted favours, wedding return gifts, graduation sunflower keychains, bridesmaids bouquets, and corporate festive hampers (Diwali, New Year, Women’s Day). Bulk pricing discounts are available for quantities of 15+ pieces. Please reach out via WhatsApp at least 7–10 days in advance for large quantities.',
    sortOrder: 7,
    active: true
  },
  {
    id: 'faq-8',
    category: 'Custom',
    question: 'Can you recreate a bouquet or toy from an Instagram or Pinterest picture?',
    answer: "Yes! Simply share the image with us via WhatsApp. Founder & lead artisan Anjali Kumari will analyze the stitch pattern, calculate the yarn requirements, confirm timeline & pricing, and keep you updated with progress photos while crocheting your custom creation.",
    sortOrder: 8,
    active: true
  },
  {
    id: 'faq-9',
    category: 'Classes',
    question: 'How does the Artisan Certification Exam work?',
    answer: 'Our Certification Assessment is a 10-question multiple choice (MCQ) exam covering stitch anatomy, tension control, abbreviations (US vs UK terminology), magic rings, and project finishing. Scoring 80% or higher awards you an official verified PDF certificate with your credential ID that can be downloaded and displayed.',
    sortOrder: 9,
    active: true
  },
  {
    id: 'faq-10',
    category: 'Shipping',
    question: 'What are the shipping charges? Is Free Delivery available?',
    answer: 'We offer FREE Pan-India doorstep delivery on all orders above ₹499! For orders below ₹499, a nominal flat courier fee of ₹60 is applied at checkout.',
    sortOrder: 10,
    active: true
  },
  {
    id: 'faq-11',
    category: 'Orders',
    question: 'How do I care for and clean my handcrafted crochet items?',
    answer: 'Crochet flower bouquets simply need occasional gentle dusting with a soft brush or cool hairdryer on low setting. For keychains and plushies, hand wash in lukewarm water using mild baby detergent, gently squeeze (do not wring), and dry flat in shade. Avoid hot water, bleach, or tumble drying.',
    sortOrder: 11,
    active: true
  },
  {
    id: 'faq-12',
    category: 'Studio',
    question: 'What payment modes are accepted?',
    answer: 'We accept UPI (Google Pay, PhonePe, Paytm), BHIM, Net Banking, credit/debit cards, and Cash on Delivery / Pay on Pickup at our Greater Noida West studio.',
    sortOrder: 12,
    active: true
  }
];

export async function initFaqs() {
  if (isMySQLConnected && pool) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS faqs (
          id VARCHAR(100) NOT NULL PRIMARY KEY,
          category VARCHAR(100) NOT NULL DEFAULT 'Orders',
          question TEXT NOT NULL,
          answer LONGTEXT NOT NULL,
          sort_order INT DEFAULT 0,
          active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log('🐬 [MySQL] Verified faqs table');

      const [existing] = await pool.query('SELECT COUNT(*) as cnt FROM faqs');
      if (existing[0].cnt === 0) {
        for (const f of defaultFaqs) {
          await pool.query(
            'INSERT INTO faqs (id, category, question, answer, sort_order, active) VALUES (?, ?, ?, ?, ?, ?)',
            [f.id, f.category, f.question, f.answer, f.sortOrder, f.active]
          );
        }
        console.log(`🐬 [MySQL] Successfully seeded ${defaultFaqs.length} FAQs`);
      }
    } catch (err) {
      console.error('❌ [MySQL] Error initializing faqs table:', err.message);
    }
  }

  // Update database.json
  const dbPath = path.join(__dirname, 'database.json');
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(raw);
    if (!data.faqs || data.faqs.length === 0) {
      data.faqs = defaultFaqs;
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
      console.log('📄 [JSON] Synced default faqs to database.json');
    }
  } catch (err) {
    console.error('❌ [JSON] Error writing faqs to database.json:', err.message);
  }
}

if (process.argv[1] && process.argv[1].endsWith('init-faqs.js')) {
  initFaqs().then(() => {
    console.log('✨ FAQs initialization complete!');
    process.exit(0);
  });
}
