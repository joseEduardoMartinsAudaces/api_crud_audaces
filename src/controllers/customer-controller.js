'use strict';

const md5 = require('md5');
const crypto = require('crypto');

const repository = require('../repository/user');
const ValidationContract = require('../validators/validator');
const authService = require('../services/auth-service');
const emailService = require('../services/email-service');

const config = require("../config/config");

//methods get
exports.getAll = async (req, res, next) => {
    try {
        const ret = await repository.getAll();
        res.json({ data: ret });
    } catch (error) {
        res.json({ mensagem: error });
    }
};

//methods post
exports.createCustomer = async (req, res, next) => {
    try {
        const {user_id, name , cnpj, number} = req.body;
        console.log("olamundo")
        const ret = await repository.createCustomer(user_id, name , cnpj, number);
        console.log("olamundoooooooooooo")
        res.json({ data: ret });
    } catch (error) {
        res.status(400).send({ message: "Erro ao processar requisição!", error: error});
    }
};
