import db from '../utils/db.js';

const miscService = {
    // Get all categories for dropdown
    async getAllCategories() {
        return await db('categories').select('CatName');
    },

    // Add new article
    async addArticle(articleData) {
        try {
            const [articleId] = await db('draft').insert({
                Title: articleData.title,
                Abstract: articleData.abstract,
                Content: articleData.content,
                CatName: articleData.catName,
                PublishDate: db.fn.now(), 
                Author: articleData.author,
                status:'pending'
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
