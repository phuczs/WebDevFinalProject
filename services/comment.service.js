import db from '../utils/db.js';

export default{

    findAllComments() {
        return db('comments');
      },
    
    
    findCommentById(id) {
        return db('comments').where('NewsID', id).first();
      },

    add(entity) { // entity : { CatName: '...' }
        return db('comments').insert(entity);
      },

}