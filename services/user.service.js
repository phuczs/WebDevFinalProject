import db from '../utils/db.js';
import bcrypt from 'bcryptjs';
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

    async findUserByEmail(email) {
        return db('users').where('email', email).first();
    },
    
    async saveOTP(email, otp) {
        return db('users')
            .where('email', email)
            .update({
                otp: otp,
                otp_expiry: db.raw('DATE_ADD(NOW(), INTERVAL 15 MINUTE)')
            });
    },
    
    async verifyOTP(email, otp) {
        return db('users')
            .where('email', email)
            .where('otp', otp)
            .where('otp_expiry', '>', db.fn.now())
            .first();
    },
    
    async updatePasswordWithEmail(email, newPassword) { //Renamed to avoid conflict
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return db('users')
            .where('email', email)
            .update({
                password: hashedPassword,
                otp: null,
                otp_expiry: null
            });
    }
};
