'use strict';

let bcrypt = require('bcrypt');
let asyncLib = require('async');
let jwt = require('../token/jwt');
let models = require('../models');
const subscribers = require('../models/subscribers');
const { json } = require('body-parser');

// Regex Lib ...
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{6,16}$/;

module.exports = {
    register: (req, res) => {

        // Params ...
        let fname = req.body.fname;
        let sname = req.body.sname;
        let lname = req.body.lname;
        let gender = req.body.gender;
        let rollNumber = req.body.rollNumber;
        let email = req.body.email;
        let isActive = 1;

        // Verif ...
        if (fname == null || lname == null || sname == null || gender == null || isActive == null) {
            return res.status(400).json({ 'error': 'missing parameters...' });
        } else if (fname.length >= 13 || fname.length <= 3) {
            return res.status(400).json({ 'error': 'First Name must contain betwen 4 and 12 chars!' });
        } else if (sname.length >= 13 || sname.length <= 3) {
            return res.status(400).json({ 'error': 'Second Name must contain betwen 4 and 12 chars!' });
        } else if (lname.length >= 13 || lname.length <= 3) {
            return res.status(400).json({ 'error': 'Last Name must contain betweb 4 and 12 chars!' });
        } else if (gender != 'M' && gender != 'F') {
            return res.status(400).json({ 'error': 'Select the gender!' })
        } else if (rollNumber == null && email == null) {
            return res.status(400).json({ 'error': 'missing important parameters(You must have a rollNumber or an Email address)...' });
        } else if (rollNumber != null) {
            // if (rollNumber)
        } else if (email != null) {
            if (!EMAIL_REGEX.test(email)) {
                return res.status(400).json({ 'error': 'Invalid Mail!' });
            }
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
                        'message': 'User added successfully',
                        'adminId': newAdmin.id
                    });
                } else {
                    return res.status(500).json({
                        'error': 'cannot add user'
                    })
                }
            }

        ], (err) => {
            if (!err) {
                return res.status(200).json({ 'msg': 'User added successfully!' });
            } else {
                return res.status(400).json({ 'error': 'An arror has occured when added user...' });
            }
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
                    return res.status(404).json({ 'error': 'Email not found' })
                }
            },
            (resultBcrypt, adminFound) => {
                if (resultBcrypt) {
                    return res.status(200).json({
                        'AdminId': adminFound.id,
                        'token': jwt.generateToken(adminFound),
                    })
                } else {
                    return res.status(404).json({
                        'error': 'Invalid password'
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
            return res.status(400).json({ 'error': 'Wrong Token!' });
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
                            return res.status(400).json({ 'msg': 'User not found!' });
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
        let headerAuth = req.headers['authorization'];
        let userId = jwt.getUserId(headerAuth);

        let newFname = req.body.fname;
        let newLname = req.body.lname;
        let newPhone = req.body.phone;

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