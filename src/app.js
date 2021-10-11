'use strict';

const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const app = express();

//carrega as rotas
const indexRoutes = require('./routes/index-route');
const userRoutes = require('./routes/user-route');
const customerRoutes = require('./routes/customer-route');

app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));

//Habilita o CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, Access-Control-Allow-Headers, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST, DELETE, OPTIONS");
    app.use(cors());
    next();
});

app.use('/', indexRoutes);
app.use('/user', userRoutes);
app.use('/customer', customerRoutes);

module.exports = app;