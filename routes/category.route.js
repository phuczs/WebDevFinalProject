import express from 'express';
import categoryService from '../services/category.service.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const list = await categoryService.findAll();
    // console.log(list);
    res.render('vwCategory/list', {
      list: list
    });
  });
  
  router.get('/add', function (req, res) {
    res.render('vwCategory/add');
  });
  
  router.post('/add', async function (req, res) {
    // console.log(req.body);
    const ret = await categoryService.add(req.body);
    // console.log(ret); // insertId
    res.render('vwCategory/add');
  });
  
  // /admin/categories/edit?id=1
  router.get('/edit', async function (req, res) {
    const id = +req.query.id || 0;
    const entity = await categoryService.findById(id);
    if (!entity) {
      return res.redirect('/admin/categories');
    }
  
    res.render('vwCategory/edit', {
      category: entity
    });
  });
  
  router.post('/del', async function (req, res) {
    await categoryService.del(req.body.CatID);
    res.redirect('/admin/categories');
  });
  
  router.post('/patch', async function (req, res) {
    const id = req.body.CatID;
    const changes = {
      CatName: req.body.CatName
    }
    await categoryService.patch(id, changes);
    res.redirect('/admin/categories');
  });
  
  
  export default router;