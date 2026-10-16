# 🌸 Tishaya Petal & Loop • Handmade Crochet Boutique & Academy

A modern, full-stack web platform for artisanal handmade crochet bouquets, plushies, wearables, step-by-step masterclasses, and interactive artisan certification exams.

---

## ✨ Key Features

- **Dynamic Homepage Hero Carousel**: Configurable image slider with rich titles, subtitles, descriptions, and direct product links.
- **Handcrafted Boutique Shop**: Filterable product inventory (Flowers & Bouquets, Keychains, Amigurumi Plushies, Bags, Baby Gifts) with instant WhatsApp ordering and shopping cart.
- **Interactive Shopping Cart & Checkout**: Slide-out cart drawer with real-time tax/discount calculation, promo codes, and multi-step checkout.
- **Step-by-Step Crochet Classes**: Curriculum categorized by discipline (Amigurumi, Wearables, Granny Squares, Home Décor) with timestamped video tutorials and stitch counters.
- **Artisan Accreditation Guild**: 10-Question MCQ assessment with automatic grading (80% passing threshold) and verifiable certificates.
- **Custom Commission Orders**: Detailed custom order form with color palettes, reference photo uploads, delivery dates, and budget estimates.
- **Admin Studio CRM (`/admin`)**:
  - Live Database indicator (`MySQL 8.0`)
  - Dashboard analytics & financial overview
  - Class builder with step-by-step video timestamps
  - Category manager with rich text editor & multi-image gallery
  - Storefront product inventory manager
  - Dynamic Hero Slider editor
  - Branding & settings manager (GST, discounts, logo, currency, helpline)
- **100% Fully Responsive**: Optimized for desktop, tablet, and mobile devices with zero horizontal overflow.

---

## 🚀 Tech Stack & Database Architecture

- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS Design System
- **Backend**: Node.js, Express, RESTful APIs
- **Database**: **MySQL 8.0** (Laragon / phpMyAdmin compatible) with automatic JSON-cache resilience
- **Database Driver**: `mysql2/promise` with connection pooling

### 📊 MySQL Database Structure (`crochet_academy`)
The database contains 13 relational tables:
1. `categories` — Craft categories, descriptions, images, and video tutorials
2. `courses` — Step-by-step crochet masterclasses, syllabus, and materials
3. `packages` — Membership & academy tier bundles
4. `products` — Storefront inventory, pricing, ratings, and stock
5. `product_orders` — Customer cart checkout orders and fulfillment status
6. `custom_orders` — Custom commission requests with specs & quotes
7. `hero_slides` — Dynamic homepage carousel slides
8. `settings` — Storewide configuration (GST, discounts, logo, contact, currency)
9. `admin_users` — Admin credentials & roles
10. `orders` — Student course enrollments
11. `exam_submissions` — Quiz scores and honors
12. `mcq_questions` — Certification questions and answer bank
13. `user_enrollments` — Student progress, completed steps, and earned credentials

---

## 🛠️ Local Setup & Running

### 1. Database Setup (MySQL / Laragon)
Make sure your MySQL server is running (e.g. Start All in Laragon).

Create the database and seed the tables:
```bash
cd server
npm install

# (Optional) Seed the database tables and data automatically:
npm run db:seed
```

Or import `server/schema.sql` directly into phpMyAdmin / MySQL workbench.

### 2. Configure Environment (`server/.env`)
Create or edit `server/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=crochet_academy
```

### 3. Start Backend API
```bash
cd server
node server.js
# 🐬 [MySQL] Successfully connected to 'crochet_academy' at localhost:3306
# 🧶 Crochet Craft Academy API running on http://localhost:5000
```

### 4. Start Frontend Client
```bash
cd client
npm install
npm run dev
# ➜ Local: http://localhost:3000/
```

---

## 🔐 Admin CRM Credentials
- **URL**: `http://localhost:3000/admin`
- **Email**: `admin@petalloop.com`
- **Password**: `admin123`
