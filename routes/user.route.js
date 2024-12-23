import express from 'express';
import userService from '../services/user.service.js';

const router = express.Router();

router.get('/', async function(req, res) {
    const list = await userService.getAllUsers();
    res.render('vwAccount/users', { list:list });
  });

  router.post('/delete', async function(req, res) {
    const id = req.query.id;
    await userService.deleteUser(id);
    res.redirect('/admin/users');
  });

router.post('/extend', async function(req, res) {
    const id = req.query.id;
    const user = await userService.findById(id);
    if (user) {
        await userService.extendActivation(id);
        res.redirect('/admin/users');
    } else {
        res.status(404).send('User not found');
    }
});

router.get('/edit-user', async function(req, res) {
    const id = req.query.id;
    const user = await userService.findById(id);
    if (user) {
        res.render('vwAccount/edit-user', { user: user });
    } else {
        res.redirect('/admin/users');
    }
});

router.post('/edit-user', async function(req, res) {
    const { id, name, email, role, permission } = req.body;
    const user = await userService.findById(id);
    if (user) {
        const updatedEntity = {
            name: name || user.name,
            email: email || user.email,
            role: role || user.role,
            permission: permission || user.permission
        };
        try {
            await userService.update(user.username, updatedEntity);
            res.render('vwAccount/edit-user', { user: { ...user, ...updatedEntity }, successMessage: 'User updated successfully!' });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).send('Error updating user');
        }
    } else {
        res.status(404).send('User not found');
    }
});
export default router;