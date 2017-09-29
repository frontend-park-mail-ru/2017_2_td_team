'use strict';

const shared = require('../shared/shared');
const httpStatus = require('http-status-codes');

const authRequired = (req, res, next) => {
    const session = req.cookies.user;

    if (session === null || session === undefined) {
        res.status(httpStatus.UNAUTHORIZED)
            .json({'status': 'unauthorized'});
        return
    }

    if (!shared.sessions.has(session)) {
        res.status(httpStatus.UNAUTHORIZED)
            .json({'status': 'unauthorized'});
        return
    }
    next()
};

module.exports.authRequired = authRequired;
