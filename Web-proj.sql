/*
 Navicat Premium Data Transfer

 Source Server         : mamp
 Source Server Type    : MySQL
 Source Server Version : 50638
 Source Host           : 127.0.0.1:8889
 Source Schema         : qlbh

 Target Server Type    : MySQL
 Target Server Version : 50638
 File Encoding         : 65001

 Date: 23/08/2018 18:56:44
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


-- ----------------------------
-- Create the database
-- ----------------------------
CREATE DATABASE IF NOT EXISTS news_website;
USE news_website;

-- Create the articles table
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    abstract TEXT NOT NULL,
    publish_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each category
    name VARCHAR(255) NOT NULL,       -- Name of the category or subcategory
    parent_id INT DEFAULT NULL,       -- Parent category (NULL if it's a main category)
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Create the tags table
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Create the article_subcategories table to link articles and subcategories
CREATE TABLE article_subcategories (
    article_id INT NOT NULL,
    subcategory_id INT NOT NULL,
    PRIMARY KEY (article_id, subcategory_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (subcategory_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE article_content (
    article_content_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for content
    article_id INT NOT NULL,                           -- Foreign key referencing the article
    content TEXT NOT NULL,                             -- Full article content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- Timestamp for when the article content was added
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Timestamp for updates
    FOREIGN KEY (article_id) REFERENCES articles(article_id) -- Ensure content links to an article
);

-- Create the article_categories junction table
CREATE TABLE IF NOT EXISTS article_categories (
    article_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (article_id, category_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Create the article_tags junction table
CREATE TABLE IF NOT EXISTS article_tags (
    article_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Insert main categories
INSERT INTO categories (name) VALUES 
('World'), 
('Politics'), 
('Business'), 
('Technology'), 
('Sports'), 
('Entertainment');

-- Insert subcategories for World
INSERT INTO categories (name, parent_id) VALUES 
('Asia', 1), 
('Europe', 1), 
('Middle East', 1);

-- Insert subcategories for Politics
INSERT INTO categories (name, parent_id) VALUES 
('Election', 2), 
('Policies', 2), 
('International Relations', 2);


-- Insert subcategories for Business
INSERT INTO categories (name, parent_id) VALUES 
('Markets', 3), 
('Economy', 3), 
('Startups', 3);

-- Insert subcategories for Technology
INSERT INTO categories (name, parent_id) VALUES 
('Gadgets', 4), 
('AI', 4), 
('Software', 4);

-- Insert subcategories for Sports
INSERT INTO categories (name, parent_id) VALUES 
('Football', 5), 
('Basketball', 5), 
('Tennis', 5);

-- Insert subcategories for Entertainment
INSERT INTO categories (name, parent_id) VALUES 
('Movies', 6), 
('Music', 6), 
('Celebrity News', 6);

-- Insert tags
INSERT INTO tags (name) VALUES
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
INSERT INTO articles (title, abstract, publish_date) VALUES
('The Rise of Tech in Asia', 'Exploring how Asia is becoming a global leader in technology.', '2024-11-15'),
('Asia\'s Economic Growth in 2024', 'A look into the booming economies of Asian countries in 2024.', '2024-11-16'),
('Asia\'s Climate Change Challenges', 'Understanding the unique climate challenges facing Asia.', '2024-11-17');

-- Link articles to the Asia subcategory (subcategory_id = 7)
INSERT INTO article_subcategories (article_id, subcategory_id) VALUES
(1, 7), -- 'The Rise of Tech in Asia' belongs to Asia subcategory
(2, 7), -- 'Asia\'s Economic Growth in 2024' belongs to Asia subcategory
(3, 7); -- 'Asia\'s Climate Change Challenges' belongs to Asia subcategory

-- Insert article tags for the Asia subcategory
INSERT INTO article_tags (article_id, tag_id) VALUES
(1, 2), -- 'The Rise of Tech in Asia' tagged with 'Tech'
(2, 5), -- 'Asia\'s Economic Growth in 2024' tagged with 'Economy'
(3, 6); -- 'Asia\'s Climate Change Challenges' tagged with 'Environment'

INSERT INTO article_content (article_id, content) VALUES
(1, '<p><strong>The Surge of Startups and Tech Giants</strong></p><br><p>One of the most striking trends in Asia\'s technological rise is the rapid growth of homegrown startups. In China, companies like Huawei, Tencent, and Alibaba have expanded their influence far beyond national borders, becoming significant players in global markets. Similarly, India has produced unicorns like Flipkart and Byju\''s, attracting substantial venture capital and expanding their reach worldwide. The rise of these companies has shown that Asia is no longer simply a consumer of technology, but a major producer.</p><br><p><strong>Innovation and Government Support</strong></p><br><p>Asia\''s tech success story is also powered by strategic government policies. In China, the government\''s "Made in China 2025" initiative aims to shift the country�s manufacturing base towards high-tech industries such as AI, semiconductors, and clean energy. In India, the government is actively fostering a startup culture through initiatives like "Startup India," which supports innovation and entrepreneurship. Singapore has positioned itself as a tech hub, with investments in research and development, while South Korea continues to push boundaries in electronics, particularly with companies like Samsung and LG.</p><br><p><strong>Tech Education and Talent Pool</strong></p><br><p>The rise of Asia�s tech industry can also be attributed to its growing pool of talent. Asian universities, such as the National University of Singapore and Tsinghua University in China, are producing some of the world�s brightest engineers and tech entrepreneurs. The increasing emphasis on STEM education and tech-related programs across the region has created a highly skilled workforce. Moreover, the availability of affordable tech education in countries like India has led to a surge in coding boot camps, empowering millions of young people with digital skills and fueling the tech talent pipeline.</p><br><p><strong>Technological Advancements: AI, 5G, and Robotics</strong></p><br><p>Asia�s commitment to cutting-edge technologies is evident in the rapid development and deployment of AI, 5G, and robotics. China leads the world in AI research and applications, with AI-powered products becoming ubiquitous in both consumer and industrial sectors. South Korea is rolling out 5G networks at an unprecedented scale, providing the infrastructure necessary for next-generation innovations in autonomous driving and IoT. Japan�s advancements in robotics are equally notable, with companies like SoftBank Robotics and Honda pushing the boundaries of AI and robotics integration into everyday life.</p><br><p><strong>The Future of Tech in Asia</strong></p><br><p>The future of Asia in the global tech landscape looks bright. With increasing investment in research and development, a focus on sustainable technologies, and expanding global trade networks, Asia is well-positioned to maintain its leadership in the tech sector. Additionally, collaborations between Asian countries and Western tech giants are expected to continue, accelerating innovation and creating opportunities for cross-border partnerships. However, challenges remain, particularly in areas like cybersecurity, data privacy, and regulatory frameworks. As Asia�s tech industry continues to evolve, these issues will need to be addressed to maintain its competitive edge.</p><br><p><strong>Conclusion</strong></p><p>The rise of tech in Asia is not just a passing trend; it represents a fundamental shift in the global technological landscape. With its rapid innovation, strategic investments, and growing talent pool, Asia is emerging as the undisputed leader in shaping the future of technology. As the world looks to Asia for inspiration, it�s clear that the region�s influence on the global tech industry will only continue to grow.</p><br>'),
(2, 'Asia has become the economic powerhouse of the world. This article dives into the reasons behind the region\''s growth.'),
(3, 'Asia is facing some of the world\''s most severe climate change impacts. This article highlights key challenges.');