-- ==============================================================
-- Crochet Craft Academy & Store - MySQL Database Schema
-- Database Name: crochet_academy
-- Compatible with MySQL 8.0+ / MariaDB / Laragon / phpMyAdmin
-- ==============================================================

CREATE DATABASE IF NOT EXISTS `crochet_academy` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `crochet_academy`;

-- 1. Store & System Settings
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT NOT NULL DEFAULT 1 PRIMARY KEY,
  `settings_data` JSON NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Admin Users
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(100) DEFAULT 'Super Admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT '',
  `description` LONGTEXT,
  `badge` VARCHAR(100) DEFAULT '',
  `accent` VARCHAR(50) DEFAULT '#E77D59',
  `icon_name` VARCHAR(50) DEFAULT 'Sparkles',
  `project_count` INT DEFAULT 0,
  `difficulty` VARCHAR(100) DEFAULT 'All Levels',
  `cover_image` VARCHAR(500) DEFAULT '',
  `images` JSON,
  `video_url` VARCHAR(500) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Courses
CREATE TABLE IF NOT EXISTS `courses` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category_id` VARCHAR(100) NOT NULL,
  `level` VARCHAR(100) DEFAULT 'Beginner',
  `duration` VARCHAR(50) DEFAULT '30 mins',
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `reviews_count` INT DEFAULT 0,
  `package` VARCHAR(100) DEFAULT 'Free',
  `summary` TEXT,
  `cover_image` VARCHAR(500) DEFAULT '',
  `video_url` VARCHAR(500) DEFAULT '',
  `materials` JSON,
  `abbreviations` JSON,
  `steps` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Membership Packages
CREATE TABLE IF NOT EXISTS `packages` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `tagline` VARCHAR(255) DEFAULT '',
  `price` DECIMAL(10,2) DEFAULT 0.00,
  `billing` VARCHAR(100) DEFAULT 'one-time',
  `popular` BOOLEAN DEFAULT FALSE,
  `color` VARCHAR(50) DEFAULT '#C86D51',
  `badge` VARCHAR(100) DEFAULT '',
  `features` JSON,
  `includes_certification` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. MCQ Questions for Certification Exam
CREATE TABLE IF NOT EXISTS `mcq_questions` (
  `id` INT NOT NULL PRIMARY KEY,
  `question` TEXT NOT NULL,
  `options` JSON NOT NULL,
  `correct_answer` INT NOT NULL,
  `explanation` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Products (Shop Catalog)
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT '',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `original_price` DECIMAL(10,2) DEFAULT 0.00,
  `badge` VARCHAR(100) DEFAULT '',
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `reviews_count` INT DEFAULT 1,
  `stock` INT DEFAULT 10,
  `material` VARCHAR(255) DEFAULT '',
  `dimensions` VARCHAR(255) DEFAULT '',
  `lead_time` VARCHAR(100) DEFAULT '',
  `delivery_days` VARCHAR(100) DEFAULT '',
  `care` VARCHAR(255) DEFAULT '',
  `category_id` VARCHAR(100) DEFAULT 'amigurumi',
  `images` JSON,
  `in_stock` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Product Orders (Store Checkout Orders)
CREATE TABLE IF NOT EXISTS `product_orders` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_email` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(100) DEFAULT '',
  `customer_address` JSON,
  `items` JSON NOT NULL,
  `items_count` INT DEFAULT 1,
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `discount` DECIMAL(10,2) DEFAULT 0.00,
  `gst` DECIMAL(10,2) DEFAULT 0.00,
  `shipping` DECIMAL(10,2) DEFAULT 0.00,
  `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `payment_method` VARCHAR(100) DEFAULT 'card',
  `status` VARCHAR(100) DEFAULT 'Processing',
  `date` VARCHAR(50) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Custom Orders
CREATE TABLE IF NOT EXISTS `custom_orders` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_email` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(100) DEFAULT '',
  `project_type` VARCHAR(255) DEFAULT '',
  `color_palette` VARCHAR(255) DEFAULT '',
  `dimensions` VARCHAR(255) DEFAULT '',
  `deadline` VARCHAR(100) DEFAULT '',
  `budget` VARCHAR(100) DEFAULT '',
  `reference_url` VARCHAR(500) DEFAULT '',
  `notes` TEXT,
  `status` VARCHAR(100) DEFAULT 'Under Review',
  `date` VARCHAR(50) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Package Enrollment Orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `student_name` VARCHAR(255) NOT NULL,
  `student_email` VARCHAR(255) NOT NULL,
  `package_id` VARCHAR(100) NOT NULL,
  `package_name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) DEFAULT 0.00,
  `date` VARCHAR(50) DEFAULT '',
  `status` VARCHAR(100) DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Hero Image Slider
CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT '',
  `description` TEXT,
  `image` VARCHAR(500) NOT NULL,
  `badge` VARCHAR(100) DEFAULT 'Featured',
  `badge_color` VARCHAR(50) DEFAULT '#C86D51',
  `btn_text` VARCHAR(100) DEFAULT 'View Product',
  `btn_action_type` VARCHAR(100) DEFAULT 'product',
  `btn_action_target` VARCHAR(255) DEFAULT '',
  `btn_secondary_text` VARCHAR(100) DEFAULT 'Order on WhatsApp',
  `btn_secondary_action` VARCHAR(100) DEFAULT 'whatsapp',
  `active` BOOLEAN DEFAULT TRUE,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Exam Submissions
CREATE TABLE IF NOT EXISTS `exam_submissions` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `student_name` VARCHAR(255) NOT NULL,
  `score` INT NOT NULL,
  `passed` BOOLEAN DEFAULT FALSE,
  `credential_id` VARCHAR(100) DEFAULT NULL,
  `date` VARCHAR(50) DEFAULT '',
  `honors` VARCHAR(255) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. User Enrollments & Progress
CREATE TABLE IF NOT EXISTS `user_enrollments` (
  `id` INT NOT NULL DEFAULT 1 PRIMARY KEY,
  `active_packages` JSON,
  `completed_steps` JSON,
  `certificates` JSON,
  `student_name` VARCHAR(255) DEFAULT 'Artisan Crafter',
  `student_email` VARCHAR(255) DEFAULT 'artisan@petalloop.com',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Frequently Asked Questions (FAQ)
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Orders',
  `question` TEXT NOT NULL,
  `answer` LONGTEXT NOT NULL,
  `sort_order` INT DEFAULT 0,
  `active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

