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

exports.getById = async (req, res, next) => {
    try {
        const {customer_id} = req.query;
        let customer = await repository.getCustomer(customer_id);
        customer = customer[0];
        const emails = await repository.getEmail(customer_id);
        const phones = await repository.getPhone(customer_id);
        const address = await repository.getAddress(customer_id);
        res.json({ data: { customer, emails, phones, address }});
    } catch (error) {
        res.json({ mensagem: error });
    }
};

//methods post
exports.create = async (req, res, next) => {
    const {customer, emails, phones, address} = req.body;
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);
        
        let contract = new ValidationContract();
        
        for(let i = 0; i < phones.length; i++){
            contract.isPhoneNumber(phones[i], 'Numero de telefeone invalido!');
        }
        for(let i = 0; i < emails.length; i++){
            contract.isEmail(emails[i], 'Email invalido!');
        }

        contract.isCpfOrCnpj(customer.cnpjOrCpf, 'cpf ou cnpj invalido!');

        // if invalid data
        if (!contract.isValid())
            return res.status(400).send({message: contract.errors()}).end();

        const customer_id = await repository.createCustomer(data.id, customer);

        for(let i = 0; i < emails.length; i++){
            await repository.createEmail(customer_id, emails[i]);
        }
        
        for(let i = 0; i < phones.length; i++){
            const number = phones[i].replace(" ", "").replace("(", "").replace(")", "").replace("-", "");
            await repository.createPhone(customer_id, number);
        }
        
        for(let i = 0; i < address.length; i++){
            await repository.createAddress(customer_id, address[i]);
        }
        res.status(200).send({ message: "Cadastro realizado com sucesso!" });
    } catch (error) {
        res.status(400).send({ message: "Erro ao processar requisição!", error: error});
    }
};

//methods put
exports.update = async (req, res, next) => {
    const {customer, emails, phones, address} = req.body;
    console.log(customer);
    try {
        const customer_id = await repository.updateCustomer(customer)
        console.log(customer_id);
        res.status(200).send({ message: "Cliente removido com sucesso!" });
    } catch (error) {
        res.status(400).send({ message: "Erro ao processar requisição!", error: error});
    }
}

//methods delete
exports.delete = async (req, res, next) => {
    const {customer_id} = req.body;
    try {
        await repository.deleteAddress(customer_id);
        await repository.deleteEmail(customer_id);
        await repository.deletePhone(customer_id);
        await repository.deleteCustomer(customer_id);
        res.status(200).send({ message: "Cliente removido com sucesso!" });
    } catch (error) {
        res.status(400).send({ message: "Erro ao processar requisição!", error: error});
    }
}