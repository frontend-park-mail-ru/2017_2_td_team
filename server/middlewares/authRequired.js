'use strict';

const shared = require('../shared/shared');
const httpStatus = require('http-status-codes');

const authRequired = (req, res, next) => {
    const session = req.cookies.user;

    if (session === null || session === undefined) {
        res.status(httpStatus.FORBIDDEN)
            .json({"status": "Forbidden"});
        return
    }

    if (!shared.sessions.has(session)) {
        res.status(httpStatus.FORBIDDEN)
            .json({"status": "Forbidden"});
        return
    }
    next()
};

module.exports.authRequired = authRequired;
