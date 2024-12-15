import express from 'express';
import editorService from '../services/editor.service.js';
import miscService from '../services/misc.service.js';
import { isAuth, isEditor } from '../middlewares/auth_mdw.js';

const router = express.Router();

router.get('/index', isAuth, isEditor, async (req, res) => {
    const drafts = await editorService.getAllDrafts();
    const draftsWithStatus = await Promise.all(drafts.map(async draft => {
        const status = await editorService.getDraftStatus(draft.NewsID);
        return { ...draft, Status: status };
    }));
    res.render('vwEditor/index', { list: draftsWithStatus });
});

router.get('/modify', isAuth, isEditor, async function (req, res) {
    const id = +req.query.id || 0;
    const entity = await editorService.getDraftById(id);
    const categories = await miscService.getAllCategories();
    if (!entity) {
      return res.redirect('/editor/index');
    }
  
    res.render('vwEditor/modify', {
      draft: entity,
      categories: categories
    });
});

router.post('/modify', isAuth, isEditor, async function (req, res) {
    const id = req.body.id;
    const draft = {
        Title: req.body.title,
        Abstract: req.body.abstract,
        Content: req.body.content,
        CatName: req.body.catName,
        PublishDate: req.body.publishDate
    };
    await editorService.updateDraft(id, draft);
    res.redirect('/editor/index');
});

router.post('/accept', isAuth, isEditor, async function (req, res) {
    const id = req.body.id;
    try {
        await editorService.moveDraftToArticles(id);
        res.redirect('/editor/index');
    } catch (error) {
        console.error('Error accepting draft:', error);
        res.status(500).send('Error accepting draft');
    }
});

router.post('/reject', isAuth, isEditor, async function (req, res) {
    const id = req.body.id;
    const reason = req.body.reason || 'No reason provided';
    try {
        await editorService.rejectDraft(id);
        console.log(`Draft ${id} rejected for reason: ${reason}`);
        res.redirect('/editor/index');
    } catch (error) {
        console.error('Error rejecting draft:', error);
        res.status(500).send('Error rejecting draft');
    }
});

router.get('/approval', isAuth, isEditor, async function (req, res) {
    const id = +req.query.id || 0;
    const entity = await editorService.getDraftById(id);
    const categories = await miscService.getAllCategories();
    const categoryIds = await editorService.getAllCatId();
    if (!entity) {
      return res.redirect('/editor/index');
    }

    const status = await editorService.getDraftStatus(id);
  
    res.render('vwEditor/approval', {
      draft: entity,
      categories: categories,
      categoryIds: categoryIds,
      status: status
    });
});

export default router;