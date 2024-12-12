import express from 'express';
import multer from 'multer';
import miscService from '../services/misc.service.js';
import { isAuth } from '../middlewares/auth_mdw.js';

const router = express.Router();
const upload = multer({ dest: './static/imgs/news/{articleId}/' });

router.get('/upload', isAuth, async (req, res) => {
    try {
        const categories = await miscService.getAllCategories();
        res.render('vwMisc/upload', { 
            categories,
            user: req.session.authUser 
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.post('/upload', isAuth, async (req, res) => {
    try {
        const articleData = {
            title: req.body.title,
            abstract: req.body.abstract,
            content: req.body.content,
            catName: req.body.catName,
            author: req.session.authUser.name
        };

        const articleId = await miscService.addArticle(articleData);
        
        res.render('vwMisc/upload', {
            successMessage: 'Article published successfully!',
            articleId
        });
    } catch (error) {
        res.status(500).send('Error publishing article');
    }
});

// TinyMCE image upload endpoint
router.post('/upload-image', isAuth, upload.single('file'), async (req, res) => {
    try {
        const result = await miscService.uploadImage(req.file);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Image upload failed' });
    }
});

export default router;