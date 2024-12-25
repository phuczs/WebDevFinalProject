import db from '../utils/db.js';

export default {
    findAll() {
        return db('article_tags');
    },
    findById(id) {
        return db('article_tags').where('tag_id', id).first();
    },
    add(entity) {
        return db('article_tags').insert(entity);
    },
    del(id) {
        return db('article_tags').where('tag_id', id).del();
    },
    patch(id, entity) {
        return db('article_tags').where('tag_id', id).update(entity);
    }
}
