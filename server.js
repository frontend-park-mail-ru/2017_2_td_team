'use strict';

const express = require('express');
const body = require('body-parser');
const httpStatus = require('http-status-codes');
const path = require('path');
const expressStaticGzip = require('express-static-gzip');


const app = express();

app.use(body.json());
app.use(expressStaticGzip('www'));

const handler = (req, res) => {
    res.sendFile(path.join(__dirname, './www', 'index.html'));
};

app.get('/', handler);
app.get('/about', handler);
app.get('/game', handler);
app.get('/signin', handler);
app.get('/signup', handler);
app.get('/logout', handler);
app.get('/settings', handler);

app.use((req, res) => {
    res.status(httpStatus.NOT_FOUND)
        .json({'status': 'Not Found'});
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Running on ${port}`));
