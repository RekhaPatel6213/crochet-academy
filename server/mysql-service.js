import { pool, isMySQLConnected, safeJson } from './db.js';

export async function loadDataFromMySQL() {
  if (!isMySQLConnected || !pool) return null;

  try {
    const db = {};

    // 1. Settings
    const [settingsRows] = await pool.query('SELECT settings_data FROM settings WHERE id = 1');
    if (settingsRows.length > 0) {
      db.settings = safeJson(settingsRows[0].settings_data, {});
    }

    // 2. Admin User
    const [adminRows] = await pool.query('SELECT * FROM admin_users LIMIT 1');
    if (adminRows.length > 0) {
      db.adminUser = {
        email: adminRows[0].email,
        password: adminRows[0].password,
        name: adminRows[0].name,
        role: adminRows[0].role
      };
    }

    // 3. Categories
    const [catRows] = await pool.query('SELECT * FROM categories');
    db.categories = catRows.map(r => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle,
      description: r.description,
      badge: r.badge,
      accent: r.accent,
      iconName: r.icon_name,
      projectCount: r.project_count,
      difficulty: r.difficulty,
      coverImage: r.cover_image,
      images: safeJson(r.images, []),
      videoUrl: r.video_url
    }));

    // 4. Courses
    const [courseRows] = await pool.query('SELECT * FROM courses');
    db.courses = courseRows.map(r => ({
      id: r.id,
      title: r.title,
      categoryId: r.category_id,
      level: r.level,
      duration: r.duration,
      rating: Number(r.rating) || 5.0,
      reviewsCount: r.reviews_count,
      package: r.package,
      summary: r.summary,
      coverImage: r.cover_image,
      videoUrl: r.video_url,
      materials: safeJson(r.materials, []),
      abbreviations: safeJson(r.abbreviations, []),
      steps: safeJson(r.steps, [])
    }));

    // 5. Packages
    const [pkgRows] = await pool.query('SELECT * FROM packages');
    db.packages = pkgRows.map(r => ({
      id: r.id,
      name: r.name,
      tagline: r.tagline,
      price: Number(r.price) || 0,
      billing: r.billing,
      popular: Boolean(r.popular),
      color: r.color,
      badge: r.badge,
      features: safeJson(r.features, []),
      includesCertification: Boolean(r.includes_certification)
    }));

    // 6. MCQ Questions
    const [qRows] = await pool.query('SELECT * FROM mcq_questions ORDER BY id ASC');
    db.mcqQuestions = qRows.map(r => ({
      id: r.id,
      question: r.question,
      options: safeJson(r.options, []),
      correctAnswer: r.correct_answer,
      explanation: r.explanation
    }));

    // 7. Products
    const [prodRows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    db.products = prodRows.map(r => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle,
      price: Number(r.price) || 0,
      originalPrice: Number(r.original_price) || Number(r.price) || 0,
      badge: r.badge,
      rating: Number(r.rating) || 5.0,
      reviewsCount: r.reviews_count || 1,
      stock: r.stock,
      material: r.material,
      dimensions: r.dimensions,
      leadTime: r.lead_time,
      deliveryDays: r.delivery_days,
      care: r.care,
      categoryId: r.category_id,
      images: safeJson(r.images, []),
      inStock: Boolean(r.in_stock)
    }));

    // 8. Product Orders
    const [pOrderRows] = await pool.query('SELECT * FROM product_orders ORDER BY created_at DESC');
    db.productOrders = pOrderRows.map(r => ({
      id: r.id,
      customerName: r.customer_name,
      customerEmail: r.customer_email,
      customerPhone: r.customer_phone,
      customerAddress: safeJson(r.customer_address, {}),
      items: safeJson(r.items, []),
      itemsCount: r.items_count,
      subtotal: Number(r.subtotal) || 0,
      discount: Number(r.discount) || 0,
      gst: Number(r.gst) || 0,
      shipping: Number(r.shipping) || 0,
      total: Number(r.total) || 0,
      paymentMethod: r.payment_method,
      status: r.status,
      date: r.date
    }));

    // 9. Custom Orders
    const [cOrderRows] = await pool.query('SELECT * FROM custom_orders ORDER BY created_at DESC');
    db.customOrders = cOrderRows.map(r => ({
      id: r.id,
      customerName: r.customer_name,
      customerEmail: r.customer_email,
      customerPhone: r.customer_phone,
      projectType: r.project_type,
      colorPalette: r.color_palette,
      dimensions: r.dimensions,
      deadline: r.deadline,
      budget: r.budget,
      referenceUrl: r.reference_url,
      notes: r.notes,
      status: r.status,
      date: r.date
    }));

    // 10. Package Orders
    const [ordRows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    db.orders = ordRows.map(r => ({
      id: r.id,
      studentName: r.student_name,
      studentEmail: r.student_email,
      packageId: r.package_id,
      packageName: r.package_name,
      price: Number(r.price) || 0,
      date: r.date,
      status: r.status
    }));

    // 11. Hero Slides
    const [slideRows] = await pool.query('SELECT * FROM hero_slides ORDER BY sort_order ASC');
    db.heroSlides = slideRows.map(r => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle,
      description: r.description,
      image: r.image,
      badge: r.badge,
      badgeColor: r.badge_color,
      btnText: r.btn_text,
      btnActionType: r.btn_action_type,
      btnActionTarget: r.btn_action_target,
      btnSecondaryText: r.btn_secondary_text,
      btnSecondaryAction: r.btn_secondary_action,
      active: Boolean(r.active)
    }));

    // 12. Exam Submissions
    const [subRows] = await pool.query('SELECT * FROM exam_submissions ORDER BY created_at DESC');
    db.examSubmissions = subRows.map(r => ({
      id: r.id,
      studentName: r.student_name,
      score: r.score,
      passed: Boolean(r.passed),
      credentialId: r.credential_id,
      date: r.date,
      honors: r.honors
    }));

    // 13. User Enrollments
    const [enrollRows] = await pool.query('SELECT * FROM user_enrollments WHERE id = 1');
    if (enrollRows.length > 0) {
      db.userEnrollments = {
        activePackages: safeJson(enrollRows[0].active_packages, []),
        completedSteps: safeJson(enrollRows[0].completed_steps, {}),
        certificates: safeJson(enrollRows[0].certificates, []),
        studentName: enrollRows[0].student_name,
        studentEmail: enrollRows[0].student_email
      };
    }

    // 14. FAQs
    try {
      const [faqRows] = await pool.query('SELECT * FROM faqs ORDER BY sort_order ASC, id ASC');
      db.faqs = faqRows.map(r => ({
        id: r.id,
        category: r.category,
        question: r.question,
        answer: r.answer,
        sortOrder: Number(r.sort_order) || 0,
        active: Boolean(r.active)
      }));
    } catch (e) {
      db.faqs = [];
    }

    return db;
  } catch (err) {
    console.error('❌ [MySQL] Error loading data from MySQL:', err);
    return null;
  }
}

// Background sync functions to MySQL
export async function syncSettingsToMySQL(settings) {
  if (!isMySQLConnected || !pool) return;
  try {
    await pool.execute(
      `INSERT INTO settings (id, settings_data) VALUES (1, ?) ON DUPLICATE KEY UPDATE settings_data = VALUES(settings_data)`,
      [JSON.stringify(settings)]
    );
  } catch (e) {
    console.error('❌ [MySQL] Failed to update settings:', e.message);
  }
}

export async function syncProductToMySQL(p) {
  if (!isMySQLConnected || !pool) return;
  try {
    await pool.execute(
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
        p.stock !== undefined ? p.stock : 10,
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
  } catch (e) {
    console.error('❌ [MySQL] Failed to save product:', e.message);
  }
}

export async function deleteProductFromMySQL(id) {
  if (!isMySQLConnected || !pool) return;
  try {
    await pool.execute(`DELETE FROM products WHERE id = ?`, [id]);
  } catch (e) {
    console.error('❌ [MySQL] Failed to delete product:', e.message);
  }
}

export async function syncProductOrderToMySQL(po) {
  if (!isMySQLConnected || !pool) return;
  try {
    await pool.execute(
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
  } catch (e) {
    console.error('❌ [MySQL] Failed to save product order:', e.message);
  }
}

export async function syncCustomOrderToMySQL(co) {
  if (!isMySQLConnected || !pool) return;
  try {
    await pool.execute(
      `INSERT INTO custom_orders (id, customer_name, customer_email, customer_phone, project_type, color_palette, dimensions, deadline, budget, reference_url, notes, status, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status=VALUES(status)`,
      [
        co.id,
        co.customerName || '',
        co.customerEmail || '',
        co.customerPhone || '',
        co.itemType || co.projectType || '',
        co.colorPalette || '',
        co.dimensions || co.customMeasurements || '',
        co.deadline || co.targetDate || '',
        co.budget || co.estimatedQuote || '',
        co.referenceUrl || co.referenceImage || '',
        co.notes || co.specialNotes || '',
        co.status || 'Under Review',
        co.date || co.createdAt || ''
      ]
    );
  } catch (e) {
    console.error('❌ [MySQL] Failed to save custom order:', e.message);
  }
}

export async function syncSlideToMySQL(s, sortOrder = 0) {
  if (!isMySQLConnected || !pool) return;
  try {
    await pool.execute(
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
        s.badgeColor || '#C86D51',
        s.btnText || 'View Product',
        s.btnActionType || 'product',
        s.btnActionTarget || '',
        s.btnSecondaryText || 'Order on WhatsApp',
        s.btnSecondaryAction || 'whatsapp',
        s.active !== undefined ? Boolean(s.active) : true,
        sortOrder
      ]
    );
  } catch (e) {
    console.error('❌ [MySQL] Failed to save slide:', e.message);
  }
}

export async function deleteSlideFromMySQL(id) {
  if (!isMySQLConnected || !pool) return;
  try {
    await pool.execute(`DELETE FROM hero_slides WHERE id = ?`, [id]);
  } catch (e) {
    console.error('❌ [MySQL] Failed to delete slide:', e.message);
  }
}

export async function syncAllSlidesToMySQL(slides) {
  if (!isMySQLConnected || !pool || !Array.isArray(slides)) return;
  try {
    await pool.execute(`DELETE FROM hero_slides`);
    let order = 0;
    for (const s of slides) {
      await syncSlideToMySQL(s, order++);
    }
  } catch (e) {
    console.error('❌ [MySQL] Failed to sync slides:', e.message);
  }
}

export async function syncEnrollmentsToMySQL(enrollments) {
  if (!isMySQLConnected || !pool) return;
  try {
    await pool.execute(
      `INSERT INTO user_enrollments (id, active_packages, completed_steps, certificates, student_name, student_email)
       VALUES (1, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE active_packages=VALUES(active_packages), completed_steps=VALUES(completed_steps), certificates=VALUES(certificates), student_name=VALUES(student_name), student_email=VALUES(student_email)`,
      [
        JSON.stringify(enrollments.activePackages || []),
        JSON.stringify(enrollments.completedSteps || {}),
        JSON.stringify(enrollments.certificates || []),
        enrollments.studentName || 'Artisan Crafter',
        enrollments.studentEmail || 'artisan@petalloop.com'
      ]
    );
  } catch (e) {
    console.error('❌ [MySQL] Failed to save enrollments:', e.message);
  }
}

export async function syncExamSubmissionToMySQL(sub) {
  if (!isMySQLConnected || !pool) return;
  try {
    await pool.execute(
      `INSERT INTO exam_submissions (id, student_name, score, passed, credential_id, date, honors)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE score=VALUES(score), passed=VALUES(passed)`,
      [
        sub.id,
        sub.studentName || '',
        sub.score || 0,
        Boolean(sub.passed),
        sub.credentialId || null,
        sub.date || '',
        sub.honors || ''
      ]
    );
  } catch (e) {
    console.error('❌ [MySQL] Failed to save exam submission:', e.message);
  }
}

export async function syncFaqToMySQL(faq, sortOrder = 0) {
  if (!isMySQLConnected || !pool) return;
  try {
    await pool.execute(
      `INSERT INTO faqs (id, category, question, answer, sort_order, active)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         category=VALUES(category), 
         question=VALUES(question), 
         answer=VALUES(answer), 
         sort_order=VALUES(sort_order), 
         active=VALUES(active)`,
      [
        faq.id,
        faq.category || 'Orders',
        faq.question || '',
        faq.answer || '',
        faq.sortOrder !== undefined ? faq.sortOrder : sortOrder,
        faq.active !== undefined ? Boolean(faq.active) : true
      ]
    );
  } catch (e) {
    console.error('❌ [MySQL] Failed to save FAQ:', e.message);
  }
}

export async function deleteFaqFromMySQL(id) {
  if (!isMySQLConnected || !pool) return;
  try {
    await pool.execute(`DELETE FROM faqs WHERE id = ?`, [id]);
  } catch (e) {
    console.error('❌ [MySQL] Failed to delete FAQ:', e.message);
  }
}

export async function syncAllFaqsToMySQL(faqs) {
  if (!isMySQLConnected || !pool || !Array.isArray(faqs)) return;
  try {
    await pool.execute(`DELETE FROM faqs`);
    let order = 1;
    for (const f of faqs) {
      await syncFaqToMySQL(f, order++);
    }
  } catch (e) {
    console.error('❌ [MySQL] Failed to sync all FAQs:', e.message);
  }
}

