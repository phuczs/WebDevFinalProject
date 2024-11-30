import express from 'express'

const router = express.Router();

router.get('/register', function(req, res){
    res.render('vwAccount/register');
}); 

import bcrypt from 'bcryptjs';
import userService from '../services/user.service.js';
router.post('/register', async function(req, res){
    const hash_password = bcrypt.hashSync(req.body.raw_password, 8) //big = slow
    const ymd_dob = req.body.raw_dob; // year-month-day
    const entity = {
        username: req.body.username,
        password: hash_password,
        name: req.body.name,
        email: req.body.email,
        dob: ymd_dob,
        permission: 0,
    }
    const ret = await userService.add(entity);
    res.render('vwAccount/register');
});

router.get('/login', function(req, res){
    res.render('vwAccount/login');
});

router.post('/login', function(req, res){

});


router.get('/is-available', async function(req, res) {
    const username = req.query.username;
    const user = await userService.findByUsername(username)
    if (!user) {
        return res.json(true);
    }    
    res.json(false);
});




export default router;