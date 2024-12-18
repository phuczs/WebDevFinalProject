import express from 'express'
import nodemailer from 'nodemailer';

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
        permission: 1,
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

import {isAuth} from '../middlewares/auth_mdw.js';

router.get('/profile', isAuth, function(req, res){
    res.render('vwAccount/profile', {
        user: req.session.authUser,
    });

});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure:false,
  auth: {
    user: 'phuchasprovt@gmail.com',
    pass: 'xaho derz qmqa qieg'
  }
});

router.get('/forgot-password', (req, res) => {
  res.render('vwAccount/forgot-password');
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    // Check if user exists
    const user = await userService.findUserByEmail(email);
    
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Save OTP to database
    await userService.saveOTP(email, otp);

    // Send OTP via email
    await transporter.sendMail({
      from: 'phuchasprovt@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      text: `Dear User!Your OTP for password reset is: ${otp}.This code will expired in 15 minutes after this email was sent!`
    });
    res.render('vwAccount/verify-otp', { 
      email,
      message: 'OTP sent to your email',
      messageType: 'success'
    });

    res.render('vwAccount/verify-otp', { email });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Verify OTP route
router.post('/verify-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Verify OTP
    const user = await userService.verifyOTP(email, otp);

    if (!user) {
      return res.status(400).send('Invalid or expired OTP');
    }

    // Update password and clear OTP
    await userService.updatePasswordWithEmail(email, newPassword);

    res.render('vwAccount/verify-otp', { 
      message: 'Password updated successfully. You can now log in with your new password.',
      messageType: 'success'
    });
  } catch (error) {
    console.error(error);
    res.render('vwAccount/verify-otp', { 
      email,
      message: 'Server error, please try again',
      messageType: 'danger'
    });
  }
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

router.post('/profile', isAuth, async function(req, res) {
    const { name, email } = req.body;
    const user = req.session.authUser;

    console.log('Profile update request received:', { name, email }); // Log the incoming data

    // Create an updated entity with the new values
    const updatedEntity = {
        name: name || user.name, // Use existing name if not provided
        email: email || user.email // Use existing email if not provided
    };

    try {
        // Update the user's profile in the database
        await userService.update(user.username, updatedEntity);
        console.log('Profile updated in database:', updatedEntity); // Log successful update

        // Update the session user data
        req.session.authUser = { ...user, ...updatedEntity };

        // Redirect to profile with a success message
        res.render('vwAccount/profile', {
            user: req.session.authUser,
            successMessage: 'Your profile has been updated successfully!'
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.render('vwAccount/profile', {
            user: req.session.authUser,
            errorMessage: 'There was an error updating your profile. Please try again.'
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