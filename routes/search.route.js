import express from 'express';
import db from '../utils/db.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('search');
});

router.post('/search', async (req, res) => {
    const { query } = req.body;

    try {
      // Perform the search query using Knex.js
      const results = await db('articles')
        .select('*')
        .whereRaw(
          'MATCH(Title, Abstract, Content) AGAINST(? IN BOOLEAN MODE)', 
          [query]
        );
    
      res.render('search', { results, query });
    } catch (error) {
      console.error('Error executing search query:', error);
      res.render('search', { error: 'An error occurred while searching' });
    }
});
export default router;