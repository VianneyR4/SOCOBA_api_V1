'use strict';

let jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = "2kfswe35s98jo9045ju62039wjfsdfkj2jwef32r2w323lmax0902nb923nw34123dxn1o23eq0wj0";

module.exports = {
    generateToken: (userData) => {
        return jwt.sign({
                userId: userData.id
            },
            JWT_SECRET_KEY, {
                expiresIn: '1h',
            })
    },
    getUserId: (authorization) => {
        let myUserId = -1;
        let headersToken = (authorization != null) ? authorization.replace('Bearer ', '') : null;
        if (headersToken != null) {
            try {
                // Verif the comming token to the real token ...
                let verifiedToke = jwt.verify(headersToken, JWT_SECRET_KEY);
                if (verifiedToke != null) {
                    myUserId = verifiedToke.userId;
                }
            } catch (err) {}
        }
        return myUserId;
    }
}