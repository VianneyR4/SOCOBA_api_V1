'use strict';

let asyncLib = require('async');
let modeles = require('../models');
let jwt = require('../token/jwt');
const { sequelize } = require('../models');


module.exports = {
    addItems: (req, res) => {
        let headersAuth = req.headers['authorization'];
        let currentUser = jwt.getUserId(headersAuth);
        // Params ...
        let itemName = req.body.itemName;
        let quantity = req.body.quantity;
        let qttAlert = req.body.qttAlert;
        let qttType = req.body.qttType;
        let unitePrice = req.body.unitePrice;
        let currency = req.body.currency;
        let isActive = true;

        // Verif ...
        if (currentUser < 0) {
            return res.status(400).json({ 'error': 'You mast be connected first...' });
        } else if (itemName == null || quantity == null || qttAlert == null || qttType == null || unitePrice == null || currency == null) {
            return res.status(400).json({ 'error': 'missing parameters...' });
        } else if (itemName.lenght <= 4 && itemName.lenght >= 24) {
            return res.status(400).json({ 'error': 'Item name must contain betwen 4 and 24 chars!' });
        }

        // Authantification with waterfall ...
        asyncLib.waterfall([
            (done) => {
                modeles.stock.findOne({
                        attributes: ['id', 'itemName', 'quantity', 'qttAlert', 'qttType', 'unitePrice', 'currency'],
                        where: { itemName: itemName }
                    })
                    .then((existedItem) => {
                        done(null, existedItem);
                    })
                    .catch((err) => {
                        return res.status(500).json({ 'error': 'An error has occured from server while verifying the existing item...' });
                    })
            },
            (existedItem, done) => {
                if (!existedItem) {
                    modeles.stock.create({
                            itemName: itemName,
                            quantity: quantity,
                            qttAlert: qttAlert,
                            qttType: qttType,
                            unitePrice: unitePrice,
                            currency: currency,
                            isActive: isActive
                        })
                        .then((newItem) => {
                            done(null, newItem);
                        })
                        .catch((err) => {
                            return res.status(500).json({ 'error': err });
                        })
                } else {
                    return res.status(409).json({ 'error': 'Item already exist!' });
                }
            },
            (newItem) => {
                if (newItem) {
                    return res.status(201).json({ newItem });
                } else {
                    return res.status(400).json({ 'error': 'added failed!' });
                }
            }
        ], (err) => {
            if (!err) {
                return res.status(200).json({ 'msg': 'Item added successfully!' });
            } else {
                return res.status(400).json({ 'error': 'An arror has occured while adding item...' });
            }
        });
    },
    getItems: (req, res) => {
        let headersAuth = req.headers['authorization'];
        let currentUser = jwt.getUserId(headersAuth);

        if (currentUser < 0) {
            return res.status(400).json({ 'error': 'You mast be connected first..' });
        }

        asyncLib.waterfall([
            (done) => {
                modeles.stock.findAll({
                        where: { isActive: true },
                        order: [
                            ['itemName', 'ASC'],
                            // [sequelize.fn('itemName', sequelize.col('itemName')), 'ASC']
                        ]
                    })
                    .then((items) => {
                        done(null, items);
                    })
                    .catch((err) => {
                        return res.status(500).json({ 'error': err })
                    })
            },
            (items) => {
                if (items) {
                    return res.status(200).json({ items });
                } else {
                    return res.status(403).json({ 'error': 'Failed to fetch data for items!' });
                }
            }
        ], (err) => {

        })
    }
}