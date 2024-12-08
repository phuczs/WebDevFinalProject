import db from '../utils/db.js';

export default {
    // Find user by username
    findByUsername(username) {
        return db('users').where('username', username).first();
    },

    // Add new user
     add(entity) {
        return db('users').insert(entity);
    },

    // Update user details
    async update(username, entity) {
        try {
            await db('users').where('username', username).update(entity);
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Error updating user');
        }
    },

    // New function to update user profile
    async updateProfile(username, { name, email }) {
        const updatedEntity = {};
        if (name) updatedEntity.name = name;
        if (email) updatedEntity.email = email;

        return await this.update(username, updatedEntity);
    },

    // Update only password for a user
    async updatePassword(username, passwordHash) {
        const trx = await db.transaction();
        try {
            await trx('users')
                .where('username', username)
                .update({ password: passwordHash });
            await trx.commit();
        } catch (error) {
            await trx.rollback();
            console.error('Error updating password:', error);
            throw new Error('Error updating password');
        }
    },
    
};