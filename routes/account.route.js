import express from 'express'

const router = express.Router();

router.get('/register', function(req, res){
    res.render('vwAccount/register');
}); 

import bcrypt from 'bcryptjs';
import moment from 'moment';
import userService from '../services/user.service.js';
router.post('/register', async function(req, res){
    const hash_password = bcrypt.hashSync(req.body.raw_password, 8) //big = slow
    const ymd_dob = moment(req.body.raw_dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
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

router.post('/login',async function(req, res){
    const user = await userService.findByUsername(req.body.username);
    if (!user) {
      return res.render('vwAccount/login', {
        showErrors: true,
      });
    }
    const ret = bcrypt.compareSync(req.body.raw_password, user.password);
    if (!ret) {
      return res.render('vwAccount/login', {
        showErrors: true,
      });
    }
    req.session.auth = true;
    req.session.authUser = user;
    const retUrl=req.session.retUrl||'/';
    req.session.retUrl=null;
    res.redirect(retUrl);
});

router.post('/logout', function(req, res){
    req.session.auth = false;
    req.session.authUser = null;
    res.redirect('/');
});

function isAuth(req,res,next){
    if(!req.session.auth){
      req.session.retUrl=req.originalUrl;  //luu lai trc khi kick user
      return res.redirect('/account/login');
    }
    next();
  }

router.get('/profile', isAuth, function(req, res){
    res.render('vwAccount/profile', {
        user: req.session.authUser,
    });

});

router.get('/change-password', isAuth, async function (req, res) {
  res.render('vwAccount/change-password')
});

router.post('/change-password', isAuth, async function(req, res) {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = req.session.authUser;

  // Check if oldPassword is defined
  if (!oldPassword) {
    return res.render('vwAccount/change-password', {
      errorMessage: 'Current password is required.'
    });
  }

  try {
    // Compare the old password with the stored hash
    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      return res.render('vwAccount/change-password', {
        errorMessage: 'Old password does not match!'
      });
    }

    // Update the password only if the new password is different from the old password
    if (oldPassword === newPassword) {
      return res.render('vwAccount/change-password', {
        errorMessage: 'New password cannot be the same as the old password!'
      });
    }

    const updatedEntity = { password: bcrypt.hashSync(newPassword, 8) };

    // Update the user's password in the database
    await userService.update(user.username, updatedEntity);

    // Redirect to profile or show a success message
    res.render('vwAccount/change-password', {
      successMessage: 'Your password has been updated successfully!'
    });

  } catch (error) {
    console.error('Error updating password:', error);
    return res.render('vwAccount/change-password', {
      errorMessage: 'There was an error updating your password. Please try again.'
    });
  }
});


router.get('/is-available', async function(req, res) {
  const username = req.query.username;
  const user = await userService.findByUsername(username);
  if (!user) {
    return res.json(true);
  }
  return res.json(false);
});



export default router;