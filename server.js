'use strict';

const express = require('express');
const body = require('body-parser');
const morgan = require('morgan');
const httpStatus = require('http-status-codes');
const path = require('path');
const compression = require('compression');

const app = express();

app.use(body.json());
app.use(morgan('dev'));
app.use(compression());
app.use(express.static('www'));

const handler = ((req, res) => {
    res.sendFile(path.join(__dirname, './www', 'index.html'));
});

app.get('/', handler);
app.get('/about', handler);
app.get('/game', handler);
app.get('/signin', handler);
app.get('/signup', handler);
app.get('/logout', handler);

app.use((req, res) => {
    res.status(httpStatus.NOT_FOUND)
        .json({'status': 'Not Found'});
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Running on ${port}`));
