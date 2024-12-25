import db from '../utils/db.js';
import { format } from 'date-fns';
const miscService = {
    // Get all categories for dropdown
    async getAllCategories() {
        return await db('categories').select('CatName');
    },

    async getAllTags() {
        return await db('article_tags').select('tag_name');
    },

    // Add new article
    async addArticle(articleData) {
        try {
            const [articleId] = await db('draft').insert({
                Title: articleData.title,
                Abstract: articleData.abstract,
                Content: articleData.content,
                CatName: articleData.catName,
                PublishDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                Author: articleData.author,
                status: 'pending',
                is_premium: articleData.is_premium,
                CatID: articleData.catID,
                tag_id: articleData.tagID,
                tag_name: articleData.tagName
            });
            return articleId;
        } catch (error) {
            console.error('Error adding article:', error);
            throw new Error('Failed to add article');
        }
    },

    // Upload image for TinyMCE
    async uploadImage(file) {
        try {
            // Implement file upload logic (e.g., to cloud storage or local directory)
            // Return the URL of the uploaded image
            return {
                location: `/static/imgs/news/${articleId}/${file.filename}`
            };
        } catch (error) {
            console.error('Image upload error:', error);
            throw new Error('Image upload failed');
        }
    }
};

export default miscService;
