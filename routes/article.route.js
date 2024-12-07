import express from 'express';
import articleService from '../services/article.service.js';

const router = express.Router();

router.get('/', async function (req, res) {
const list = await articleService.findAll();
  res.render('vwArticle/list', {
    list: list
  });
});

export default router;