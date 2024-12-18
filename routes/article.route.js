import express from 'express';
import articleService from '../services/article.service.js';
import miscService from '../services/misc.service.js';

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await articleService.findAll();
  res.render('vwArticle/list', {
    list: list
  });
});

router.get('/edit-news', async function (req, res) {
  const id = req.query.id;
  const news = await articleService.findById(id);
  if (news) {
    const categories = await miscService.getAllCategories();
    res.render('vwArticle/edit-news', {
      news: news,
      categories: categories
    });
  } else {
    res.redirect('/admin/articles');
  }
});

router.post('/edit-news', async function (req, res) {
  const { id, title, content, abstract, CatName } = req.body;
  const news = await articleService.findById(id);
  if (news) {
    await articleService.update(id, { title, content, abstract, CatName });
    res.redirect('/admin/articles');
  } else {
    res.redirect('/admin/articles');
  }
});

router.post('/delete-news', async function (req, res) {
  const id = req.body.id;
  await articleService.delete(id);
  res.redirect('/admin/articles');
});

router.get('/add-news', async function (req, res) {
  const categories = await miscService.getAllCategories();
  res.render('vwArticle/add-news', {
    categories: categories
  });
});

router.post('/add-news', async function (req, res) {
  const { title, content, abstract, CatName, CatID } = req.body;
  await articleService.add({ title, content, abstract, CatName, CatID });
  res.redirect('/admin/articles');
});


export default router;