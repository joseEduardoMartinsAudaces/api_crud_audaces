'use strict';

const md5 = require('md5');
const crypto = require('crypto');

const repository = require('../repository/user');
const ValidationContract = require('../validators/validator');
const authService = require('../services/auth-service');
const emailService = require('../services/email-service');

const config = require("../config/config");

//methods get
// function to search user by email
// disuse
exports.getByEmail = async (req, res, next) => {
    try {
        const ret = await repository.getByEmail(req.body.email);
        res.json({ data: ret });
    } catch (error) {
        res.json({ mensagem: error });
    }
};

//methods post
// function to authenticate user and generete token to login
exports.authenticateUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await repository.getByEmail(email);

        if (!user || user.password !== md5(password + global.SALT_KEY))
            return res.status(400).send({ message: 'Usuário ou senha inválidos' });

        if(!user.user_status){
            const link = "http://localhost:3000/user/register/authenticate?email=" + email;
            emailService.submitEmail(email, "email confirmation", link);
            return res.status(400).send({code: 10, message: 'Email não autenticado, por favor verificar seu email' });
        }

        const token = await authService.generateToken({
            id: user.user_id,
            email: user.email
        });

        res.status(200).send({ token: token });
    } catch (e) {
        res.status(400).send({ message: 'Falha ao processar sua requisição' });
    }
};
// funtion to create user and submit email for him
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

        res.status(200).send({"message": "Enviamos um email de confirmação para você"});
    } catch (error) {
        res.status(400).send({"code": 10, "message": "Erro ao cadastrar usuario!", "error": error});
    }
};
// function to validation token and refresh him
exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const user = await repository.getById(data.id);

        if (!user)
            return res.status(400).send({ message: 'Cliente não encontrado' });

        const tokenData = await authService.generateToken({
            id: user.user_id,
            email: user.email
        });

        res.status(200).send({
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
        res.status(400).send({message: 'Falha ao processar sua requisição'});
    }
};
// function to email submit with token and validate email to reset password
exports.forgotPassword = async (req, res, next) => {
    const email = req.body.email
    try {
        const user = await repository.getByEmail(email);
        
        if (!user) 
            return res.status(400).send({message: 'Email invalido'});

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await repository.resetTokenExperes(user.user_id, token, now);

        emailService.submitEmail(email, "Resetar senha", token);

        res.status(200).send({message: 'Email enviado'});
    } catch (error) {
        res.status(400).send({message: 'Falha ao processar sua requisição', error});
    }
}
// function to get token and check if user exists and verify if the tokens are the same
exports.resetPassword = async (req, res, next) => {
    const {email, token, password} = req.body;
    try {
        const user = await repository.getByEmail(email);

        if (!user)
            return res.status(400).send({message: 'Usuario invalido'});
        
        if(!user.user_status)
            await repository.updateUserStatus(email);

        
        if (token !== user.token)
            return res.status(400).send({message: 'Codigo invalido'});

        const now = new Date();
        if (now > user.experesToken)
            return res.status(400).send({message: 'Codigo expirado, gere outro'});

        await repository.updateUserResetPassword(user.user_id, md5(password + global.SALT_KEY), null, null);

        res.status(200).send({message: 'Senha modificada'});
    } catch (error) {
        res.status(400).send({message: 'Falha ao processar sua requisição', error});
    }
}
// function to check if email exist and redirect for page login
exports.authenticateEmail = async (req, res, next) => {
    try {
        await repository.updateUserStatus(req.query.email)
        res.redirect('http://127.0.0.1:5500/src/pages/examples/login.html')
    } catch (error) {
        res.status(400).send({message: 'Falha ao processar sua requisição', error});
    }
}
