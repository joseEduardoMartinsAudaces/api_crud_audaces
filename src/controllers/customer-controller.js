'use strict';

const md5 = require('md5');
const crypto = require('crypto');

const repository = require('../repository/customer');
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
    const {corporateName , fantasyName, typeOfPerson, cnpjOrCpf, emails, phones, address} = req.body;
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);
        const customer_id = await repository.createCustomer(data.id, corporateName, fantasyName, typeOfPerson, cnpjOrCpf);
        for(let i = 0; i < emails.length; i++){
            await repository.createEmail(customer_id, emails[i]);
        }
        for(let i = 0; i < phones.length; i++){
            await repository.createPhone(customer_id, phones[i]);
        }
        for(let i = 0; i < address.length; i++){
            console.log(address[i])
            await repository.createAddress(customer_id, address[i]);
        }
        res.status(200).send({ data: "Cadastro realizado com sucesso!" });
    } catch (error) {
        res.status(400).send({ message: "Erro ao processar requisição!", error: error});
    }
};