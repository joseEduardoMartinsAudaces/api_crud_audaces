'use strict';

const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const { host, port, user, pass} = require("../config/mail.json");

module.exports = class email{
    static submitEmail(email, subject, text) {
        const transport = nodemailer.createTransport({
            host,
            port,
            auth: {
                user,
                pass
            }
        });
        const emailBody = {
            to: email,
            from: 'jose.martins@audaces.com',
            subject: subject,
            text: text,
            template: 'email'
        }
        transport.sendMail(emailBody, (err, info) => {
            if(err){
                console.log(err)
            }
        })
    }
}