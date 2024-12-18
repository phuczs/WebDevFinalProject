import express from 'express'

const router = express.Router();

router.get('/nk1', function (req, res) {
    res.render('vwBreakNews/nk1')
});

router.get('/rodman1', function (req, res) {
    res.render('vwBreakNews/rodman1')
});

router.get('/cos1', function (req, res) {
    res.render('vwBreakNews/cos1')
});

router.get('/tik1', function(req, res) {
    res.render('vwBreakNews/tik1')
});

export default router;