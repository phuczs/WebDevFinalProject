import db from '../utils/db.js';

export default{
    
   
      async addComment(commentData) {
        try {            
            const [commentId] = await db('comments').insert({
                NewsID: commentData.newsID,
                content: commentData.content,
                date_create: db.fn.now(), 
                author: commentData.author
            });
            return commentId;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw new Error('Failed to add comment');
        }
    },

    async findCommentsByNewsId(newsId) {
        const comments = await db('comments').where({ NewsID: newsId });
        return comments;
    },

}