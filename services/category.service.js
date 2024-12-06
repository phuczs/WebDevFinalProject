import db from '../utils/db.js';

export default{

  findAll() {
    return db('categories');
  },

  findById(id) {
    return db('categories').where('CatID', id).first();
  },

  add(entity) { // entity : { CatName: '...' }
    return db('categories').insert(entity);
  },
    
  del(id) {
    return db('categories').where('CatID', id).del()
  },
    
  patch(id, entity) {
    return db('categories').where('CatID', id).update(entity);
  }
}