import express from 'express';

const router = express.Router();

router.get('/tou1', function(req, res) {
    res.render('vwFooter/tou1')
});

router.get('/pp1', function(req, res) {
    res.render('vwFooter/pp1')
});

router.get('/coo1', function(req, res) {
    res.render('vwFooter/coo1')
});


export default router;