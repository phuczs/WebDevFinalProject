import db from '../utils/db.js';

async function getAllDrafts() {
    return await db('draft').select('NewsID', 'Title', 'Abstract', 'PublishDate');
}

async function getDraftById(id) {
    return await db('draft').where('NewsID', id).first();
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
        await db('articles').insert(draft);
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
    getAllCatId
};