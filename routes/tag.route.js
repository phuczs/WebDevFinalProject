import express from 'express';
import tagService from '../services/tag.service.js';

const router = express.Router();

router.get('/', async function(req, res) {
    const tags = await tagService.findAll();
    res.render('vwTag/tags', { tags: tags });
});

router.get('/add', function(req, res) {
    res.render('vwTag/add');
});

router.post('/add', async function(req, res) {
    const ret = await tagService.add(req.body);
    res.render('vwTag/add');
});

router.get('/edit', async function(req, res) {
    const id = +req.query.id || 0;
    const entity = await tagService.findById(id);
    if (!entity) {
        return res.redirect('/admin/tags');
    }
    res.render('vwTag/edit', { tag: entity });
});

router.post('/patch', async function(req, res) {
    const id = +req.body.id || 0;
    const changes = {
        tag_name: req.body.tag_name
    }
    await tagService.patch(id, changes);
    res.redirect('/admin/tags');
});

router.post('/del', async function(req, res) {
    await tagService.del(req.body.tag_id);
    res.redirect('/admin/tags');
});


export default router;