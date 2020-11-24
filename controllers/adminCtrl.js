'use strict';

let bcrypt = require('bcrypt');
let asyncLib = require('async');
let jwt = require('../token/jwt');
let models = require('../models');
const admin = require('../models/admin');
const { json } = require('body-parser');

// Regex Lib ...
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{6,16}$/;

module.exports = {
    register: (req, res) => {

        // Params ...
        let fname = req.body.fname;
        let lname = req.body.lname;
        let phone = req.body.phone;
        let email = req.body.email;
        let password = req.body.password;
        let isActive = 1;

        // Verif ...
        if (fname == null || lname == null || phone == null || email == null || password == null || isActive == null) {
            return res.status(400).json({ 'error': 'missing parameters...' });
        } else if (fname.length >= 13 || fname.length <= 3) {
            return res.status(400).json({ 'error': 'First Name must contain betwen 4 and 12 chars!' });
        } else if (lname.length >= 13 || lname.length <= 3) {
            return res.status(400).json({ 'error': 'Last Name must contain betwen 4 and 12 chars!' });
        } else if (phone.length <= 9) {
            return res.status(400).json({ 'erro': 'Phone Number must contain 10 number min' })
        } else if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'Invalid Mail!' });
        } else if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'Password must contain between 6 and 16 digits long and include at least one numeric digit' })
        }

        // Authantification with waterfall ...
        asyncLib.waterfall([
            (done) => {
                models.admin.findOne({
                        attributes: ['email'],
                        where: { email: email }
                    })
                    .then((adminFound) => {
                        done(null, adminFound);
                    })
                    .catch((err) => {
                        return res.status(500).json({ 'error': 'Unable to verif user!' })
                    });
            },
            (adminFound, done) => {
                if (!adminFound) {
                    bcrypt.hash(password, 5, (err, bcryptedPassword) => {
                        done(null, bcryptedPassword);
                    });

                } else {
                    return res.status(409).json({ 'error': 'user already exist' });
                }
            },
            (bcryptedPassword, done) => {
                let newAdmin = models.admin.create({
                        fname: fname,
                        lname: lname,
                        phone: phone,
                        email: email,
                        password: bcryptedPassword,
                        isActive: isActive
                    })
                    .then((newAdmin) => {
                        done(null, newAdmin);
                    })
                    .catch((err) => {
                        return res.status(500).json({
                            'error': 'cant add user'
                        })
                    })
            },
            (newAdmin) => {
                if (newAdmin) {
                    return res.status(201).json({
                        'msg': 'User added successfully',
                        'adminId': newAdmin.id
                    });
                } else {
                    return res.status(500).json({
                        'error': 'cannot add user'
                    })
                }
            }

        ], (err) => {
            return res.status(400).json({ 'error': 'An arror has occured when added user...' });
        });

    },
    login: (req, res) => {

        // Params ...
        let email = req.body.email;
        let password = req.body.password;

        if (email == null || password == null) {
            return res.status(400).json({
                'error': 'missing parameters...'
            });
        }

        // Authantification with waterfall ...
        asyncLib.waterfall([
            (done) => {
                models.admin.findOne({
                        where: { email: email }
                    })
                    .then((adminFound) => {
                        done(null, adminFound);
                    })
                    .catch((err) => {
                        return res.status(500).json({ 'error': 'Unable to verif user!' })
                    })
            },
            (adminFound, done) => {
                if (adminFound) {
                    bcrypt.compare(password, adminFound.password, (errBcrypt, resultBcrypt) => {
                        done(null, resultBcrypt, adminFound);
                    });
                } else {
                    return res.status(404).json({ 'error': 'Email not found!' })
                }
            },
            (resultBcrypt, adminFound) => {
                if (resultBcrypt) {
                    return res.status(200).json({
                        'msg': 'login successfully!',
                        'AdminId': adminFound.id,
                        'token': jwt.generateToken(adminFound),
                    })
                } else {
                    return res.status(404).json({
                        'error': 'Invalid password!'
                    })
                }
            }
        ], (err) => {
            if (!err) {
                return res.status(200).json({ 'msg': 'User connected successfully!' });
            } else {
                return res.status(400).json({ 'error': 'An arror has occured while the user connexion...' });
            }
        });
    },
    getUserProfile: (req, res) => {
        // Params ...
        let headerAuth = req.headers['authorization'];
        let myUserId = jwt.getUserId(headerAuth);

        if (myUserId < 0) {
            return res.status(400).json({ 'error': 'You must be connected first...' });
        }

        // Authantification with waterfall ...
        asyncLib.waterfall([
            (done) => {
                models.admin.findOne({
                        attributes: ['id', 'fname', 'lname', 'phone', 'email', 'isActive'],
                        where: {
                            id: myUserId
                        }
                    })
                    .then((adminData) => {
                        if (adminData) {
                            done(null, adminData);
                        } else {
                            return res.status(400).json({ 'error': 'User not found!' });
                        }
                    })
                    .catch((err) => {
                        return res.status(500).json({ 'error': 'An arror has occured while fetching data...' });
                    })
            },
            (adminData) => {
                return res.status(200).json(adminData);
            }
        ])

    },
    updateUserProfile: (req, res) => {
        let headersAuth = req.headers['authorization'];
        let userId = jwt.getUserId(headersAuth);

        let newFname = req.body.fname;
        let newLname = req.body.lname;
        let newPhone = req.body.phone;

        if (userId < 0) {
            return res.status(400).json({ 'error': 'You mast be connected first...' });
        }

        asyncLib.waterfall([
            (done) => {
                models.admin.findOne({
                        attributes: ['id', 'fname', 'lname', 'phone'],
                        where: { id: userId }
                    })
                    .then((adminProfile) => {
                        done(null, adminProfile);
                    })
                    .catch((err) => {
                        return res.status(500).json({ 'error': 'User not found!' });
                    });
            },
            (adminProfile, done) => {
                if (adminProfile) {
                    adminProfile.update({
                            fname: (newFname ? newFname : adminProfile.fname),
                            lname: (newLname ? newLname : adminProfile.lname),
                            phone: (newPhone ? newPhone : adminProfile.phone)
                        })
                        .then(() => {
                            done(null, adminProfile);
                        })
                        .catch((err) => {
                            return res.status(400).json({ 'error': 'Failed to update!' });
                        })
                } else {
                    return res.status(404).json({ 'error': 'User not found!' });
                }
            },
            (adminProfile) => {
                if (adminProfile) {
                    return res.status(201).json(adminProfile);
                } else {
                    return res.status(500).json({ 'error': 'Failed to update!' });
                }
            }
        ], (err) => {
            if (!err) {
                return res.status(200).json({ 'msg': 'User connected successfully!' });
            } else {
                return res.status(400).json({ 'error': 'An arror has occured while the user connexion...' });
            }
        });
    }
}