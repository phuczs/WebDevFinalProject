import express from 'express'

const router = express.Router();

router.get('/register', function(req, res){
    res.render('vwAccount/register');
}); 

router.post('/register', function(req, res){

});

router.get('/login', function(req, res){
    res.render('vwAccount/login');
});

router.post('/login', function(req, res){

});

export default router;