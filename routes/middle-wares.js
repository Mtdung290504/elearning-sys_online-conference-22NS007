import Database from '../model/database/database.js';
const db = new Database();

export default {
    requireLogin(req, res, next) {
        if (req.session && req.session.user) {
            return next();
        } else {
            res.redirect('/login');
        }
    },

    async requireClassExistence(req, res, next) {
        try {
            await db.checkClassExistence(req.params.id);
            return next();
        } catch (error) {
            res.send(`<h3 style="color: red">${error.message}</h3>`);
            // res.redirect('/');
        }
    },

    async requireAccessToClass(req, res, next) {
        try {
            await db.checkAccessToClass(req.session.user.id, req.params.id);
            return next();
        } catch (error) {
            res.send(`<h3 style="color: red">${error.message}</h3>`);
            // res.redirect('/');
            // res.json({ e: 'Bạn không có quyền truy cập!', m: null, d: null });
        }
    }
};