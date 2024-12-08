import db from '../utils/db.js';

export default {
    // Find user by username
    async findByUsername(username) {
        const user = await db('users').where('username', username).first();
        if (!user) {
            throw new Error('User not found');
        }
        return user;
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