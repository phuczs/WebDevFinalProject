import express from 'express';
import multer from 'multer';
import miscService from '../services/misc.service.js';
import editorService from '../services/editor.service.js';
import { isAuth} from '../middlewares/auth_mdw.js';

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
            author: req.session.authUser.name,
            status: 'pending',
            is_premium: req.body.is_premium,
            catID: req.body.catID
        };

        const articleId = await miscService.addArticle(articleData);
        
        res.render('vwMisc/upload', {
            successMessage: 'Article published successfully!',
            articleId,
            status: articleData.status
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

router.get('/pend', isAuth, async (req, res) => {
    try {
        const drafts = await editorService.getAllDrafts();
        const draftsWithStatus = await Promise.all(drafts.map(async draft => {
            const status = await editorService.getDraftStatus(draft.NewsID);
            return { ...draft, Status: status };
        }));
        res.render('vwMisc/pend', { 
            list: draftsWithStatus,
            user: req.session.authUser 
        });
    } catch (error) {
        res.status(500).send('Error fetching drafts');
    }
});

export default router;