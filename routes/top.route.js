import express from 'express';

const router = express.Router();

router.get('/us1', function (req, res) {
    res.render('vwTop/us1')
});

router.get('/ind1', function (req, res) {
    res.render('vwTop/ind1')
});

router.get('/rus1', function (req, res) {
    res.render('vwTop/rus1')
});

router.get('/hts1', function(req, res) {
    res.render('vwTop/hts1')
});

router.get('/pal1', function(req, res) {
    res.render('vwTop/pal1')
});

router.get('/euro1', function(req, res) {
    res.render('vwTop/euro1')
});

router.get('/chel1', function(req, res) {
    res.render('vwTop/chel1')
});

router.get('/mouse1', function(req, res) {
    res.render('vwTop/mouse1')
});

router.get('/food1', function(req, res) {
    res.render('vwTop/food1')
});

export default router;