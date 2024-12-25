import db from '../utils/db.js';

export default{
    findAll(){
        return db('articles');
    },
    findById(id) {
        return db('articles').where('NewsID', id).first();
      },
    
    findByCatId(catId) {
        return db('articles').where('CatID', catId);
      },
    
    findPageByCatId(catId, limit, offset) {
        return db('articles').where('CatID', catId).limit(limit).offset(offset);
      },
    findByTagId(tagId) {
        return db('articles').where('tag_id', tagId);
      },
    
    findPageByTagId(tagId, limit, offset) {
        return db('articles').where('tag_id', tagId).limit(limit).offset(offset);
      },
    countByTagId(tagId) {
        return db('articles').where('tag_id', tagId).count('* as total').first();
      },

      countByCatId(catId) {
        return db('articles').where('CatID', catId).count('* as total').first();
      },

      update(id, entity) {
        return db('articles').where('NewsID', id).update(entity);
      },

      delete(id) {
        return db('articles').where('NewsID', id).del();
      },

      add(entity) {
        return db('articles').insert(entity);
      }
}