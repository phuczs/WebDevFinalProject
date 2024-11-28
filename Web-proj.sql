-- Create the database if it does not exist
CREATE DATABASE IF NOT EXISTS `bao-dien-tu`;

-- Use the created database
USE `bao-dien-tu`;

-- Create the articles table
CREATE TABLE IF NOT EXISTS `articles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `abstract` TEXT NOT NULL,
    `publish_date` DATE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the categories table
CREATE TABLE IF NOT EXISTS `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `parent_id` INT DEFAULT NULL,
    FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`)
);

-- Create the tags table
CREATE TABLE IF NOT EXISTS `tags` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the article_subcategories table to link articles and subcategories
CREATE TABLE IF NOT EXISTS `article_subcategories` (
    `article_id` INT NOT NULL,
    `subcategory_id` INT NOT NULL,
    PRIMARY KEY (`article_id`, `subcategory_id`),
    FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`),
    FOREIGN KEY (`subcategory_id`) REFERENCES `categories`(`id`)
);

-- Create the article_content table
CREATE TABLE IF NOT EXISTS `article_content` (
    `article_content_id` INT AUTO_INCREMENT PRIMARY KEY,
    `article_id` INT NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`)
);

-- Create the article_categories junction table
CREATE TABLE IF NOT EXISTS `article_categories` (
    `article_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    PRIMARY KEY (`article_id`, `category_id`),
    FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`),
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
);

-- Create the article_tags junction table
CREATE TABLE IF NOT EXISTS `article_tags` (
    `article_id` INT NOT NULL,
    `tag_id` INT NOT NULL,
    PRIMARY KEY (`article_id`, `tag_id`),
    FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`),
    FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`)
);

-- Insert main categories
INSERT INTO `categories` (`name`) VALUES 
('World'), 
('Politics'), 
('Business'), 
('Technology'), 
('Sports'), 
('Entertainment');

-- Insert subcategories for World
INSERT INTO `categories` (`name`, `parent_id`) VALUES 
('Asia', 1), 
('Europe', 1), 
('Middle East', 1);

-- Insert subcategories for Politics
INSERT INTO `categories` (`name`, `parent_id`) VALUES 
('Election', 2), 
('Policies', 2), 
('International Relations', 2);

-- Insert subcategories for Business
INSERT INTO `categories` (`name`, `parent_id`) VALUES 
('Markets', 3), 
('Economy', 3), 
('Startups', 3);

-- Insert subcategories for Technology
INSERT INTO `categories` (`name`, `parent_id`) VALUES 
('Gadgets', 4), 
('AI', 4), 
('Software', 4);

-- Insert subcategories for Sports
INSERT INTO `categories` (`name`, `parent_id`) VALUES 
('Football', 5), 
('Basketball', 5), 
('Tennis', 5);

-- Insert subcategories for Entertainment
INSERT INTO `categories` (`name`, `parent_id`) VALUES 
('Movies', 6), 
('Music', 6), 
('Celebrity News', 6);

-- Insert tags
INSERT INTO `tags` (`name`) VALUES
('Breaking News'),
('AI'),
('Football'),
('Movies'),
('Research'),
('Technology'),
('Politics'),
('Economy'),
('Healthcare'),
('Environment'),
('Entertainment'),
('Sports'),
('Business'),
('Science'),
('International'),
('Celebrity'),
('Music'),
('Education'),
('Travel'),
('Food'),
('Culture'),
('Art'),
('Lifestyle'),
('Innovation'),
('Weather'),
('Social Media'),
('Finance'),
('Startups'),
('Virtual Reality'),
('Cybersecurity'),
('Mental Health'),
('Podcasts'),
('Elections'),
('Market Trends'),
('Social Issues'),
('Law'),
('Space Exploration');

-- Insert sample articles for Asia subcategory
INSERT INTO `articles` (`title`, `abstract`, `publish_date`) VALUES
('The Rise of Tech in Asia', 'Exploring how Asia is becoming a global leader in technology.', '2024-11-15'),
('Asia\'s Economic Growth in 2024', 'A look into the booming economies of Asian countries in 2024.', '2024-11-16'),
('Asia\'s Climate Change Challenges', 'Understanding the unique climate challenges facing Asia.', '2024-11-17');

-- Link articles to the Asia subcategory (subcategory_id = 7)
INSERT INTO `article_subcategories` (`article_id`, `subcategory_id`) VALUES
(1, 7), -- 'The Rise of Tech in Asia' belongs to Asia subcategory
(2, 7), -- 'Asia\'s Economic Growth in 2024' belongs to Asia subcategory
(3, 7); -- 'Asia\'s Climate Change Challenges' belongs to Asia subcategory

-- Insert article tags for the Asia subcategory
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES
(1, 2), -- 'The Rise of Tech in Asia' tagged with 'Tech'
(2, 5), -- 'Asia\'s Economic Growth in 2024' tagged with 'Economy'
(3, 6); -- 'Asia\'s Climate Change Challenges' tagged with 'Environment'

-- Insert article content for the sample articles
INSERT INTO `article_content` (`article_id`, `content`) VALUES
(1, '<p><strong>The Surge of Startups and Tech Giants</strong></p><br><p>...</p>'),
(2, 'Asia has become the economic powerhouse of the world.'),
(3, 'Asia is facing some of the world\'s most severe climate change impacts.');
