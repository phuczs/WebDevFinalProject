import db from '../utils/db.js';

async function getAllDrafts() {
    return await db('draft').select('NewsID', 'Title', 'Abstract', 'PublishDate');
}

async function getDraftById(id) {
    return await db('draft').where('NewsID', id).first();
}
async function findByCatId(catId) {
    return db('draft').where('CatID', catId);
  }

async function updateDraft(id, draft) {
    return await db('draft').where('NewsID', id).update(draft);
}

async function getAllCategories() {
    return await db('categories').select('CatName');
}

async function getAllCatId() {
    return await db('categories').select('CatID');
}

async function moveDraftToArticles(id) {
    const draft = await db('draft').where('NewsID', id).first();
    if (draft) {
        const updatedDraft = {
            NewsID: draft.NewsID,
            Title: draft.Title,
            Abstract: draft.Abstract,
            PublishDate: draft.PublishDate,
            CatID: draft.CatID,
            is_premium: draft.is_premium
        };
        await db('articles').insert(updatedDraft);
        await db('draft').where('NewsID', id).del();
    }
}

async function rejectDraft(id) {
    return await db('draft').where('NewsID', id).update({ status: 'rejected' });
}

async function getDraftStatus(id) {
    const draft = await db('draft').where('NewsID', id).select('status').first();
    return draft ? draft.status : null;
}


export default {
    getAllDrafts,
    getDraftById,
    updateDraft,
    getAllCategories,
    moveDraftToArticles,
    rejectDraft,
    getDraftStatus,
    getAllCatId,
    findByCatId
};