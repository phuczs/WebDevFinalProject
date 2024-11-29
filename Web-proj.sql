-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS `bao_dien_tu`;

-- Sử dụng cơ sở dữ liệu
USE `bao_dien_tu`;

-- Tạo bảng articles
CREATE TABLE IF NOT EXISTS `articles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `abstract` TEXT NOT NULL,
    `publish_date` DATE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng categories
CREATE TABLE IF NOT EXISTS `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `parent_id` INT DEFAULT NULL,
    FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`)
);

-- Tạo bảng tags
CREATE TABLE IF NOT EXISTS `tags` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng liên kết article_subcategories
CREATE TABLE IF NOT EXISTS `article_subcategories` (
    `article_id` INT NOT NULL,
    `subcategory_id` INT NOT NULL,
    PRIMARY KEY (`article_id`, `subcategory_id`),
    FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`),
    FOREIGN KEY (`subcategory_id`) REFERENCES `categories`(`id`)
);

-- Tạo bảng nội dung bài viết
CREATE TABLE IF NOT EXISTS `article_content` (
    `article_content_id` INT AUTO_INCREMENT PRIMARY KEY,
    `article_id` INT NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`)
);

-- Tạo bảng liên kết article_categories
CREATE TABLE IF NOT EXISTS `article_categories` (
    `article_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    PRIMARY KEY (`article_id`, `category_id`),
    FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`),
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
);

-- Tạo bảng liên kết article_tags
CREATE TABLE IF NOT EXISTS `article_tags` (
    `article_id` INT NOT NULL,
    `tag_id` INT NOT NULL,
    PRIMARY KEY (`article_id`, `tag_id`),
    FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`),
    FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`)
);
