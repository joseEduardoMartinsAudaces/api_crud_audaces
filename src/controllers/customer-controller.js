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
    const {customer, emails, phones, address} = req.body;
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        let contract = new ValidationContract();
        contract.isCpfOrCnpj(customer.cnpjOrCpf, 'cpf invalido!');
        contract.isPhoneNumber(customer.number, 'Numero de telefeone invalido!');
        contract.isEmail(customer.email, 'email invalido!');
        // if invalid data
        if (!contract.isValid())
            return res.status(400).send({code: 20, message: contract.errors()}).end();

        const customer_id = await repository.createCustomer(data.id, customer);

        console.log(customer, emails, phones, address)
        for(let i = 0; i < emails.length; i++){
            await repository.createEmail(customer_id, emails[i]);
        }
        console.log("1")
        for(let i = 0; i < phones.length; i++){
            const number = phones[i].replace(" ", "");
            await repository.createPhone(customer_id, number);
        }
        console.log("2")
        for(let i = 0; i < address.length; i++){
            await repository.createAddress(customer_id, address[i]);
        }
        console.log("3")
        res.status(200).send({ message: "Cadastro realizado com sucesso!" });
    } catch (error) {
        res.status(400).send({ message: "Erro ao processar requisição!", error: error});
    }
};