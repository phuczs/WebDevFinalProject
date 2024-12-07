import db from '../utils/db.js';

export default {
    // Find user by username
    async findByUsername(username) {
        try {
            const user = await db('users').where('username', username).first();
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw new Error('Error finding user by username');
        }
    },

    // Add new user
    async add(entity) {
        if (entity.password) {
            entity.password = bcrypt.hashSync(entity.password, 8); // Ensure password is hashed
        }
        try {
            const [id] = await db('users').insert(entity);
            return await this.findByUsername(entity.username); // Return the full user object
        } catch (error) {
            console.error('Error adding user:', error);
            throw new Error('Error adding user to the database');
        }
    },

    // Update user details
    async update(username, entity) {
        try {
            const result = await db('users').where('username', username).update(entity);
            if (result === 0) {
                throw new Error('No user found to update');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Error updating user');
        }
    },

    // Update only name and email for a user
    async updateProfile(username, { name, email }) {
        const updatedEntity = {};
        if (name) updatedEntity.name = name;
        if (email) updatedEntity.email = email;

        try {
            await this.update(username, updatedEntity);
            return await this.findByUsername(username); // Return the updated user
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw new Error('Error updating user profile');
        }
    },

    // Update only password for a user
    async updatePassword(username, passwordHash) {
        const trx = await db.transaction();
        try {
            const result = await trx('users')
                .where('username', username)
                .update({ password: passwordHash });
            if (result === 0) {
                throw new Error('No user found to update password');
            }
            await trx.commit();
        } catch (error) {
            await trx.rollback();
            console.error('Error updating password:', error);
            throw new Error('Error updating password');
        }
    },
    
};
