import express from 'express'

const router = express.Router();

router.get('/cn1', function (req, res) {
    res.render('vwTop10/cn1')
});

router.get('/assad1', function (req, res) {
    res.render('vwTop10/assad1')
});

router.get('/wal1', function (req, res) {
    res.render('vwTop10/wal1')
});

router.get('/tech1', function(req, res) {
    res.render('vwTop10/tech1')
});

router.get('/dance1', function(req, res) {
    res.render('vwTop10/dance1')
});

router.get('/happy1', function(req, res) {
    res.render('vwTop10/happy1')
});

router.get('/f1', function(req, res) {
    res.render('vwTop10/f1')
});

router.get('/game1', function(req, res) {
    res.render('vwTop10/game1')
});

router.get('/hp', function(req, res) {
    res.render('vwTop10/hp')
});


export default router;