'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const httpStatus = require('http-status-codes');

const authControllers = require('./controllers/auth');
const authMiddleware = require('./middlewares/authRequired');

const app = express();

app.use(express.static('www'));
app.use(express.static('node_modules'));
app.use(body.json());
app.use(cookie());
app.use(morgan('dev'));

//app.use(/^\/(?!signin|signup).*$/, authMiddleware.authRequired);

app.post('/signup', authControllers.signUp);
app.post('/signin', authControllers.signIn);
app.post('/logout', authControllers.logout);

app.use((req, res, next) => {
    res.status(httpStatus.NOT_FOUND)
        .json({"status": "Not Found"});
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Running on ${port}`));
