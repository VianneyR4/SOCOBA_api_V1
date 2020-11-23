let express = require('express');
let adminCtrl = require('../controllers/adminCtrl');

// router ...
exports.router = (() => {
    let apiRouter2 = express.Router();

    // Student  router ...
    // apiRouter2.route('/Student/me/').get(adminCtrl.getUserProfile);

    return apiRouter2;
})();