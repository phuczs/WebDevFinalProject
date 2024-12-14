import express from 'express';
import articleService from '../services/article.service.js';
import commentService from '../services/comment.service.js';
import { isAuth } from '../middlewares/auth_mdw.js';
import { format } from 'date-fns';

const router = express.Router();

router.get('/byCat', async function (req, res) {
    const id = req.query.id || 0;
    const limit = 4;
    const current_page = req.query.page || 1;
    const offset = (current_page - 1) * limit;
  
    const nRows = await articleService.countByCatId(id);
    const nPages = Math.ceil(nRows.total / limit);
    const pageNumbers = [];
    for (let i = 0; i < nPages; i++) {
      pageNumbers.push({
        value: i + 1,
        active: (i + 1) === +current_page
      });
    }
  
    const list = await articleService.findPageByCatId(id, limit, offset);
    res.render('vwArticle/byCat', {
      articles: list,
      empty: list.length === 0,
      pageNumbers: pageNumbers,
      catId: id
    });
  });

  router.get('/detail', async function (req, res) {
    const id = req.query.id || 0;
    const article = await articleService.findById(id);
    res.render('vwArticle/detail', {
      article:article
    });
  });

  

  router.get('/comment', isAuth, async function (req, res) {
    try {
        const articleId = req.query.id;
        const comments = await commentService.findCommentsByNewsId(articleId);
        const article = await articleService.findById(articleId);
        
        res.render('vwArticle/comment', { 
            comments: comments,
            user: req.session.authUser,
            article: article
        }); 
    } catch (error) {
        res.status(500).send('Error fetching comments');
    }
  });

  // Handle new comment submission
  router.post('/comment', isAuth, async function (req, res) {
    try {
        const commentData = {
            newsID: req.query.id,
            content: req.body.content,
            author: req.session.authUser.name,
        };

        const commentId = await commentService.addComment(commentData);
        
        // After adding comment, fetch comments again to display updated list
        const comments = await commentService.findCommentsByNewsId(req.body.newsID);
        comments.forEach(comment => {
            comment.date_create = format(new Date(comment.date_create), 'MMMM do, yyyy H:mm:ss'); // Format the date
        });
        
        res.render('vwArticle/comment', {
            successMessage: 'Comment published successfully!',
            comments: comments,
            user: req.session.authUser
        });
    } catch (error) {
        res.status(500).send('Error publishing comment');
    }
  });
  
  export default router;