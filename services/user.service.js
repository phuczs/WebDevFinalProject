import db from '../utils/db.js';

export default {
    add(entity) {
        return db('users').insert(entity);
    }
}