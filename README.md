# 🌸 Tishaya Petal & Loop • Handmade Crochet Boutique & Academy

A modern full-stack web platform for artisanal handmade crochet bouquets, plushies, wearables, step-by-step masterclasses, and interactive artisan certification exams.

## ✨ Features

- **Dynamic Homepage Hero Carousel**: Configurable image slider with rich titles, subtitles, descriptions, and direct product links.
- **Handcrafted Boutique Shop**: Filterable product inventory (Flowers & Bouquets, Keychains, Amigurumi Plushies, Bags, Baby Gifts) with instant WhatsApp ordering and shopping cart.
- **Interactive Shopping Cart & Checkout**: Slide-out cart drawer with real-time tax/discount calculation, promo codes, and multi-step checkout.
- **Step-by-Step Crochet Classes**: Curriculum categorized by discipline (Amigurumi, Wearables, Granny Squares, Home Décor) with timestamped video tutorials and stitch counters.
- **Artisan Accreditation Guild**: 10-Question MCQ assessment with automatic grading (80% passing threshold) and verifiable certificates.
- **Custom Commission Orders**: Detailed custom order form with color palettes, reference photo uploads, delivery dates, and budget estimates.
- **Admin Studio CRM (`/admin`)**:
  - Dashboard analytics & financial overview
  - Class builder with step-by-step video timestamps
  - Category manager with rich text editor & multi-image gallery
  - Storefront product inventory manager
  - Dynamic Hero Slider editor
  - Branding & settings manager (GST, discounts, logo, currency, helpline)
- **100% Fully Responsive**: Optimized for desktop, tablet, and mobile devices with zero horizontal overflow.

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS Design System
- **Backend**: Node.js, Express, RESTful APIs, JSON file database
- **Aesthetics**: Fraunces & Plus Jakarta Sans typography, artisanal terracotta/honey/sage palette

## 🛠️ Local Setup & Running

### 1. Install Dependencies
```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### 2. Run Backend Server
```bash
cd server
node server.js
# API runs on http://localhost:5000
```

### 3. Run Frontend Development Server
```bash
cd client
npm run dev
# Frontend runs on http://localhost:3000
```

## 🔐 Admin CRM Credentials
- **URL**: `http://localhost:3000/admin`
- **Email**: `admin@petalloop.com`
- **Password**: `admin123`
