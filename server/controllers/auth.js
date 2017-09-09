'use strict';

const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const httpStatus = require('http-status-codes');

const shared = require('../shared/shared');

class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}

const signupHandler = (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (!(username && email && password)) {
        res.status(httpStatus.BAD_REQUEST)
            .json({"status": "bad request"});
        return
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err !== undefined) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({"status": "internal server error"});
            return
        }
        const user = new User(username, email, hash);
        const uuid = uuidv4();
        shared.users.set(username, user);
        shared.sessions.set(uuid, user);
        res.cookie('user', uuid);
        res.json({uuid});
    });
};

const signinHandler = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!(username && password)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({"status": "bad request"});
        return
    }

    if (!shared.users.has(username)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({"status": "bad request"});
        return
    }

    const user = shared.users.get(username);
    const correctHash = user.password;

    bcrypt.compare(password, correctHash, (err, status) => {
        if (err !== undefined) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({"status": "internal error"});
            return
        }
        if (!status) {
            res.status(httpStatus.UNAUTHORIZED)
                .json({"status": "unauthorized"});
            return
        }
        const uuid = uuidv4();
        shared.sessions.set(uuid, user);
        res.cookie("user", uuid);
        res.json({uuid});
    });
};

const logoutHandler = (req, res) => {
    const session = req.cookies.user;
    if (!session) {
        res.status(httpStatus.BAD_REQUEST)
           .json({"status": "bad request"});
        return
    }
    shared.sessions.delete(session);
    res.json({"status": "ok"})
};


module.exports.signUp = signupHandler;
module.exports.signIn = signinHandler;
module.exports.logout = logoutHandler;
