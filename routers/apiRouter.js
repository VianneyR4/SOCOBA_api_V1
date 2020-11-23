'use strict';

let express = require('express');
let adminCtrl = require('../controllers/adminCtrl');
const stockCtrl = require('../controllers/stockCtrl');

// router ...
exports.router = (() => {
    let apiRouter = express.Router();

    // admin router ...
    apiRouter.route('/admin/register').post(adminCtrl.register);
    apiRouter.route('/admin/login').post(adminCtrl.login);
    apiRouter.route('/admin/profile').get(adminCtrl.getUserProfile);
    apiRouter.route('/admin/profile/update').put(adminCtrl.updateUserProfile);

    // stock router ...
    apiRouter.route('/admin/stock/add').post(stockCtrl.addItems);
    apiRouter.route('/admin/stock').get(stockCtrl.getItems);

    return apiRouter;
})();