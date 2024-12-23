import express from 'express';

const router = express.Router();

router.get('/c1', function (req, res) {
    res.render('vwLatest/c1')
});

router.get('/oscars', function (req, res) {
    res.render('vwLatest/oscars')
});

router.get('/trump', function (req, res) {
    res.render('vwLatest/trump')
});

router.get('/openai', function(req, res) {
    res.render('vwLatest/openai')
});

router.get('/worlds', function(req, res) {
    res.render('vwLatest/worlds')
});

router.get('/robotsur', function(req, res) {
    res.render('vwLatest/robotsur')
});

router.get('/kimmich', function(req, res) {
    res.render('vwLatest/kimmich')
});

router.get('/israel', function(req, res) {
    res.render('vwLatest/israel')
});

router.get('/hp', function(req, res) {
    res.render('vwLatest/hp')
});

router.get('/sk', function(req, res) {
    res.render('vwLatest/sk')
});

router.get('/tik', function(req, res) {
    res.render('vwLatest/tik')
});

router.get('/book', function(req, res) {
    res.render('vwLatest/book')
});

export default router;