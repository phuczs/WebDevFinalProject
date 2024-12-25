import express from 'express';
import articleService from '../services/article.service.js';
import commentService from '../services/comment.service.js';
import { isAuth } from '../middlewares/auth_mdw.js';
import { format } from 'date-fns';
import pdfkit from 'pdfkit';

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

    if (article.is_premium && (!req.session.authUser || req.session.authUser.permission < 1)) {
        return res.status(403).render('403', {
            message: 'You do not have permission to access this premium article.'
        });
    }

    res.render('vwArticle/detail', {
      article: article
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

// Handle article download as PDF
router.get('/download', async function (req, res) {
    try {
        const id = req.query.id || 0;
        const article = await articleService.findById(id);

        if (!article) {
            return res.status(404).send('Article not found');
        }

        const doc = new pdfkit();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="article_${id}.pdf"`);

        doc.pipe(res);
        doc.fontSize(25).text(article.Title, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(article.Content, {
            align: 'justify',
            indent: 30,
            height: 300,
            ellipsis: true
        });
        doc.end();
    } catch (error) {
        res.status(500).send('Error generating PDF');
    }
});

router.get('/byTag', async function (req, res) {
    const id = req.query.id || 0;
    const limit = 4;
    const current_page = req.query.page || 1;
    const offset = (current_page - 1) * limit;

    const nRows = await articleService.countByTagId(id);
    const nPages = Math.ceil(nRows.total / limit);
    const pageNumbers = [];
    for (let i = 0; i < nPages; i++) {
        pageNumbers.push({
            value: i + 1,
            active: (i + 1) === +current_page
        });
    }
    const list = await articleService.findPageByTagId(id, limit, offset);
    res.render('vwArticle/byTag', {
        articles: list,
        empty: list.length === 0,
        pageNumbers: pageNumbers,
        tagId: id
    });
});


export default router;