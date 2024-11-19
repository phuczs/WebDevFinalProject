import express from 'express';
import articleService from '../services/article.service';

const router = express.Router();

router.get('/', async function (req, res) {
const list = await articleService.findAll();
  res.render('home', {
    atricles: list
  });
});