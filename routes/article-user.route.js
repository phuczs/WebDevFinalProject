import express from 'express';
import articleService from '../services/article.service.js';
import commentService from '../services/comment.service.js';

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

  router.get('/comment', function(req, res) {
    res.render('vwArticle/comment');
} )

  // router.get('/comment', async function (req, res) {
  //   // const comment = await commentService.findAllComments();
  //   res.render('vwArticle/comment');
  //   //   list:list,
  //   // });
  // });

  // // Handle new comment submission
  // router.post('/comment', async function (req, res) {
  //   // console.log(req.body);
  //   const ret = await commentService.add(req.body);
  //   // console.log(ret); // insertId
  //   res.render('vwArticle/');
  // });
  
  export default router;