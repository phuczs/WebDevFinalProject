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


router.get('/forgot-password', function(req, res) {
  res.render('vwAccount/forgot-password');
})

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
  }

  try {
      const user = await findUserByEmail(email); // Your function to find user by email
      if (!user) {
          return res.status(404).json({ message: 'Email not found.' });
      }

      const otp = generateOtp(); // Your function to generate an OTP
      await sendOtpEmail(email, otp); // Your function to send email with the OTP

      // Store OTP for verification (consider hashing it for security)
      storeOtpForUser(user.id, otp); // Store the OTP temporarily, might be in-memory or database

      return res.status(200).json({ data: 'Your OTP has been sent to your email.' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while sending OTP.' });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  try {
      const user = await findUserByEmail(email); // Check if the user exists

      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      const isValidOtp = await verifyOtpForUser(user.id, otp); // Your function to verify the stored OTP
      if (!isValidOtp) {
          return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
      }

      // Optionally, clear/delete the stored OTP from wherever it is saved after successful verification.
      clearStoredOtpForUser(user.id);

      return res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while verifying OTP.' });
  }
});

router.get('/reset-password', function(req, res) {
  res.render('/vwAccount/reset-password');
});

router.post('/reset-password', async function (req, res, next) {
  const { email, otp, newPassword } = req.body;

  connection.execute("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Database error.' });
      }

      const user = results[0];
      if (!user) {
          return res.status(400).json({ message: "User does not exist." });
      }

      // Check the OTP and its expiration
      if (user.otp !== otp) {
          return res.status(400).json({ message: "Invalid OTP." });
      }

      if (new Date() > new Date(user.otpExpire)) {
          return res.status(400).json({ message: "OTP has expired." });
      }

      // Hash the new password and update it in the database
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      connection.execute("UPDATE users SET password = ?, otp = NULL, otpExpire = NULL WHERE email = ?", [hashedPassword, email], (err) => {
          if (err) {
              return res.status(500).json({ message: 'Error updating password.' });
          }
          return res.status(200).json({ message: "Password reset successfully." });
      });
  });
});


export default router;