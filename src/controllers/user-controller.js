'use strict';

const md5 = require('md5');
const crypto = require('crypto');

const repository = require('../repository/user');
const ValidationContract = require('../validators/validator');
const authService = require('../services/auth-service');
const emailService = require('../services/email-service');

const config = require("../config/config");

//methods get
exports.getByEmail = async (req, res, next) => {
    try {
        const ret = await repository.getByEmail(req.body.email);
        res.json({ data: ret });
    } catch (error) {
        res.json({ mensagem: error });
    }
};

//methods post
exports.authenticateUser = async (req, res, next) => {
    try {
        const user = await repository.getByEmail(req.body.email);
        if (!user || user.password !== md5(req.body.password + global.SALT_KEY))
            return res.status(400).send({ message: 'Usuário ou senha inválidos' });
        
        if(!user.user_status)
            return res.status(400).send({ message: 'Usuário ou senha inválidos' });

        const token = await authService.generateToken({
            id: user.user_id,
            email: user.email
        });

        res.status(201).send({ token: token });
    } catch (e) {
        res.status(404).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.createUser = async (req, res, next) => {
    const {namePeople, nameCompany, cpf, number, email, password, confirmPassword} = req.body;
    // data validation
    let contract = new ValidationContract();
    contract.isCpf(cpf, 'cpf invalido!');
    contract.isPhoneNumber(number, 'Numero de telefeone invalido!');
    contract.isEmail(email, 'email invalido!');
    contract.isEqualFields(password, confirmPassword, 'As senhas estão diferentes!');
    contract.isPassword(password, 'Senhas invalidas!');
    // if invalid data
    if (!contract.isValid())
        return res.status(400).send({"code": 20, "message": contract.errors()}).end();

    try {
        await repository.createUser({namePeople, nameCompany, cpf, number, email, password: md5(password + global.SALT_KEY)});

        const token = await authService.generateToken({ email });

        const link = "http://localhost:3000/user/register/authenticate?email=" + email;

        emailService.submitEmail(email, "email confirmation", link);

        res.status(201).send({"message": "usuario cadastrado com sucesso"});
    } catch (error) {
        res.status(404).send({"code": 10, "message": "Erro ao cadastrar usuario!", "error": error});
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const user = await repository.getById(data.id);

        if (!user) {
            res.status(404).send({
                message: 'Cliente não encontrado'
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: user.user_id,
            email: user.email
        });

        res.status(201).send({
            token: tokenData,
            data: {
                namePeople: user.namePeople,
                nameCompany: user.nameCompany,
                cpf: user.cpf,
                number: user.number,
                email: user.email
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.forgotPassword = async (req, res, next) => {
    const email = req.body.email
    try {
        const user = await repository.getByEmail(email);
        
        if (!user) 
            return res.status(400).send({ message: 'Email invalido' });

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await repository.resetTokenExperes(user.user_id, token, now);

        emailService.submitEmail(email, "reset password", token);

        res.status(200).send({message: 'Email enviado'});
    } catch (error) {
        res.status(400).send({message: 'Falha ao processar sua requisição', error});
    }
}

exports.resetPassword = async (req, res, next) => {
    const {email, token, password} = req.body;
    try {
        const user = await repository.getByEmail(email);

        if (!user)
            return res.status(400).send({message: 'User not found'});
        
        if (token !== user.token)
            return res.status(400).send({message: 'Token not found'});

        const now = new Date();
        if (now > user.experesToken)
            return res.status(400).send({message: 'Token expired, generate a new one'});

        await repository.updateUserResetPassword(user.user_id, md5(password + global.SALT_KEY), null, null);

        res.status(200).send({message: 'Password reseted'});
    } catch (error) {
        res.status(400).send({message: 'Falha ao processar sua requisição', error});
    }
}

exports.authenticateEmail = async (req, res, next) => {
    try {
        await repository.updateUserStatus(req.query.email)
        res.redirect('http://127.0.0.1:5500/src/index.html')
    } catch (error) {
        res.status(400).send({message: 'Falha ao processar sua requisição', error});
    }
}