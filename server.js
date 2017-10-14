'use strict';

const express = require('express');
const body = require('body-parser');
const morgan = require('morgan');
const httpStatus = require('http-status-codes');

const app = express();

app.use(express.static('www'));
app.use(express.static('node_modules'));
app.use(body.json());
app.use(morgan('dev'));

app.use((req, res) => {
    res.status(httpStatus.NOT_FOUND)
        .json({'status': 'Not Found'});
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Running on ${port}`));
