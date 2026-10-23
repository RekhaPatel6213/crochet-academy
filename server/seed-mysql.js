import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  const jsonPath = path.join(__dirname, 'database.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('database.json not found!');
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(raw);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'crochet_academy'
  });

  console.log('🌱 Connected to MySQL database:', process.env.DB_NAME || 'crochet_academy');

  try {
    // 1. Settings
    if (data.settings) {
      await connection.execute(
        `INSERT INTO settings (id, settings_data) VALUES (1, ?) ON DUPLICATE KEY UPDATE settings_data = VALUES(settings_data)`,
        [JSON.stringify(data.settings)]
      );
      console.log('✅ Settings seeded');
    }

    // 2. Admin User
    if (data.adminUser) {
      await connection.execute(
        `INSERT INTO admin_users (email, password, name, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password), name = VALUES(name), role = VALUES(role)`,
        [data.adminUser.email, data.adminUser.password, data.adminUser.name, data.adminUser.role || 'Super Admin']
      );
      console.log('✅ Admin user seeded');
    }

    // 3. Categories
    if (Array.isArray(data.categories)) {
      for (const cat of data.categories) {
        await connection.execute(
          `INSERT INTO categories (id, title, subtitle, description, badge, accent, icon_name, project_count, difficulty, cover_image, images, video_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), description=VALUES(description), badge=VALUES(badge), accent=VALUES(accent), icon_name=VALUES(icon_name), project_count=VALUES(project_count), difficulty=VALUES(difficulty), cover_image=VALUES(cover_image), images=VALUES(images), video_url=VALUES(video_url)`,
          [
            cat.id,
            cat.title || '',
            cat.subtitle || '',
            cat.description || '',
            cat.badge || '',
            cat.accent || '#E77D59',
            cat.iconName || 'Sparkles',
            cat.projectCount || 0,
            cat.difficulty || 'All Levels',
            cat.coverImage || '',
            JSON.stringify(cat.images || []),
            cat.videoUrl || ''
          ]
        );
      }
      console.log(`✅ ${data.categories.length} Categories seeded`);
    }

    // 4. Courses
    if (Array.isArray(data.courses)) {
      for (const c of data.courses) {
        await connection.execute(
          `INSERT INTO courses (id, title, category_id, level, duration, rating, reviews_count, package, summary, cover_image, video_url, materials, abbreviations, steps)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title=VALUES(title), category_id=VALUES(category_id), level=VALUES(level), duration=VALUES(duration), rating=VALUES(rating), reviews_count=VALUES(reviews_count), package=VALUES(package), summary=VALUES(summary), cover_image=VALUES(cover_image), video_url=VALUES(video_url), materials=VALUES(materials), abbreviations=VALUES(abbreviations), steps=VALUES(steps)`,
          [
            c.id,
            c.title || '',
            c.categoryId || '',
            c.level || 'Beginner',
            c.duration || '30 mins',
            c.rating || 5.0,
            c.reviewsCount || 0,
            c.package || 'Free',
            c.summary || '',
            c.coverImage || '',
            c.videoUrl || '',
            JSON.stringify(c.materials || []),
            JSON.stringify(c.abbreviations || []),
            JSON.stringify(c.steps || [])
          ]
        );
      }
      console.log(`✅ ${data.courses.length} Courses seeded`);
    }

    // 5. Packages
    if (Array.isArray(data.packages)) {
      for (const pkg of data.packages) {
        await connection.execute(
          `INSERT INTO packages (id, name, tagline, price, billing, popular, color, badge, features, includes_certification)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name), tagline=VALUES(tagline), price=VALUES(price), billing=VALUES(billing), popular=VALUES(popular), color=VALUES(color), badge=VALUES(badge), features=VALUES(features), includes_certification=VALUES(includes_certification)`,
          [
            pkg.id,
            pkg.name || '',
            pkg.tagline || '',
            pkg.price || 0,
            pkg.billing || 'one-time',
            Boolean(pkg.popular),
            pkg.color || '#EE6D88',
            pkg.badge || '',
            JSON.stringify(pkg.features || []),
            Boolean(pkg.includesCertification)
          ]
        );
      }
      console.log(`✅ ${data.packages.length} Packages seeded`);
    }

    // 6. MCQ Questions
    if (Array.isArray(data.mcqQuestions)) {
      for (const q of data.mcqQuestions) {
        await connection.execute(
          `INSERT INTO mcq_questions (id, question, options, correct_answer, explanation)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE question=VALUES(question), options=VALUES(options), correct_answer=VALUES(correct_answer), explanation=VALUES(explanation)`,
          [
            q.id,
            q.question || '',
            JSON.stringify(q.options || []),
            q.correctAnswer,
            q.explanation || ''
          ]
        );
      }
      console.log(`✅ ${data.mcqQuestions.length} MCQ Questions seeded`);
    }

    // 7. Products
    if (Array.isArray(data.products)) {
      for (const p of data.products) {
        await connection.execute(
          `INSERT INTO products (id, title, subtitle, price, original_price, badge, rating, reviews_count, stock, material, dimensions, lead_time, delivery_days, care, category_id, images, in_stock)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), price=VALUES(price), original_price=VALUES(original_price), badge=VALUES(badge), rating=VALUES(rating), reviews_count=VALUES(reviews_count), stock=VALUES(stock), material=VALUES(material), dimensions=VALUES(dimensions), lead_time=VALUES(lead_time), delivery_days=VALUES(delivery_days), care=VALUES(care), category_id=VALUES(category_id), images=VALUES(images), in_stock=VALUES(in_stock)`,
          [
            p.id,
            p.title || '',
            p.subtitle || '',
            p.price || 0,
            p.originalPrice || p.price || 0,
            p.badge || '',
            p.rating || 5.0,
            p.reviewsCount || 1,
            p.stock || 10,
            p.material || '',
            p.dimensions || '',
            p.leadTime || '',
            p.deliveryDays || '',
            p.care || '',
            p.categoryId || 'amigurumi',
            JSON.stringify(p.images || []),
            p.inStock !== undefined ? Boolean(p.inStock) : true
          ]
        );
      }
      console.log(`✅ ${data.products.length} Products seeded`);
    }

    // 8. Product Orders
    if (Array.isArray(data.productOrders)) {
      for (const po of data.productOrders) {
        await connection.execute(
          `INSERT INTO product_orders (id, customer_name, customer_email, customer_phone, customer_address, items, items_count, subtotal, discount, gst, shipping, total, payment_method, status, date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE status=VALUES(status)`,
          [
            po.id,
            po.customerName || '',
            po.customerEmail || '',
            po.customerPhone || '',
            JSON.stringify(po.customerAddress || {}),
            JSON.stringify(po.items || []),
            po.itemsCount || (po.items?.length || 1),
            po.subtotal || 0,
            po.discount || 0,
            po.gst || 0,
            po.shipping || 0,
            po.total || 0,
            po.paymentMethod || 'card',
            po.status || 'Processing',
            po.date || ''
          ]
        );
      }
      console.log(`✅ ${data.productOrders.length} Product Orders seeded`);
    }

    // 9. Custom Orders
    if (Array.isArray(data.customOrders)) {
      for (const co of data.customOrders) {
        await connection.execute(
          `INSERT INTO custom_orders (id, customer_name, customer_email, customer_phone, project_type, color_palette, dimensions, deadline, budget, reference_url, notes, status, date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE status=VALUES(status)`,
          [
            co.id,
            co.customerName || '',
            co.customerEmail || '',
            co.customerPhone || '',
            co.projectType || '',
            co.colorPalette || '',
            co.dimensions || '',
            co.deadline || '',
            co.budget || '',
            co.referenceUrl || '',
            co.notes || '',
            co.status || 'Under Review',
            co.date || ''
          ]
        );
      }
      console.log(`✅ ${data.customOrders.length} Custom Orders seeded`);
    }

    // 10. Enrollment Orders
    if (Array.isArray(data.orders)) {
      for (const o of data.orders) {
        await connection.execute(
          `INSERT INTO orders (id, student_name, student_email, package_id, package_name, price, date, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE status=VALUES(status)`,
          [
            o.id,
            o.studentName || '',
            o.studentEmail || '',
            o.packageId || '',
            o.packageName || '',
            o.price || 0,
            o.date || '',
            o.status || 'Active'
          ]
        );
      }
      console.log(`✅ ${data.orders.length} Package Orders seeded`);
    }

    // 11. Hero Slides
    if (Array.isArray(data.heroSlides)) {
      let sortOrder = 0;
      for (const s of data.heroSlides) {
        await connection.execute(
          `INSERT INTO hero_slides (id, title, subtitle, description, image, badge, badge_color, btn_text, btn_action_type, btn_action_target, btn_secondary_text, btn_secondary_action, active, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), description=VALUES(description), image=VALUES(image), badge=VALUES(badge), badge_color=VALUES(badge_color), btn_text=VALUES(btn_text), btn_action_type=VALUES(btn_action_type), btn_action_target=VALUES(btn_action_target), btn_secondary_text=VALUES(btn_secondary_text), btn_secondary_action=VALUES(btn_secondary_action), active=VALUES(active), sort_order=VALUES(sort_order)`,
          [
            s.id,
            s.title || '',
            s.subtitle || '',
            s.description || '',
            s.image || '',
            s.badge || 'Featured',
            s.badgeColor || '#EE6D88',
            s.btnText || 'View Product',
            s.btnActionType || 'product',
            s.btnActionTarget || '',
            s.btnSecondaryText || 'Order on WhatsApp',
            s.btnSecondaryAction || 'whatsapp',
            s.active !== undefined ? Boolean(s.active) : true,
            sortOrder++
          ]
        );
      }
      console.log(`✅ ${data.heroSlides.length} Hero Slides seeded`);
    }

    // 12. Exam Submissions
    if (Array.isArray(data.examSubmissions)) {
      for (const es of data.examSubmissions) {
        await connection.execute(
          `INSERT INTO exam_submissions (id, student_name, score, passed, credential_id, date, honors)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE score=VALUES(score), passed=VALUES(passed)`,
          [
            es.id,
            es.studentName || '',
            es.score || 0,
            Boolean(es.passed),
            es.credentialId || null,
            es.date || '',
            es.honors || ''
          ]
        );
      }
      console.log(`✅ ${data.examSubmissions.length} Exam Submissions seeded`);
    }

    // 13. User Enrollments
    if (data.userEnrollments) {
      await connection.execute(
        `INSERT INTO user_enrollments (id, active_packages, completed_steps, certificates, student_name, student_email)
         VALUES (1, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE active_packages=VALUES(active_packages), completed_steps=VALUES(completed_steps), certificates=VALUES(certificates), student_name=VALUES(student_name), student_email=VALUES(student_email)`,
        [
          JSON.stringify(data.userEnrollments.activePackages || []),
          JSON.stringify(data.userEnrollments.completedSteps || {}),
          JSON.stringify(data.userEnrollments.certificates || []),
          data.userEnrollments.studentName || 'Artisan Crafter',
          data.userEnrollments.studentEmail || 'artisan@petalloop.com'
        ]
      );
      console.log('✅ User Enrollments seeded');
    }

    console.log('🎉 MySQL Database seeding completed successfully!');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  } finally {
    await connection.end();
  }
}

seed();
