'use strict';

const db = require('../connections/audaces-connection');

module.exports = class User{
    //select
    static getById(id){
        return new Promise((resolve, reject) => {
            db.query('select * from user where user_id = ?',
            [id],
            (err, result) => {
                return err ? reject(err) : resolve(result[0]);
            });
        });
    }
    static getByEmail(email){
        return new Promise((resolve, reject) => {
            db.query('select * from user where email = ?',
            [email],
            (err, result) => {
                return err ? reject(err) : resolve(result[0]);
            });
        }); 
    }
    //insert
    static createUser(user) {
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO user (namePeople, nameCompany, cpf, number, email, password, user_status) VALUES (?, ?, ?, ?, ?, ?, ?);",
            [user.namePeople, user.nameCompany, user.cpf, user.number, user.email, user.password, 0],
            (err, result) => {
                return err ? reject(err) : resolve(result.insertId);
            });
        });
    }
    //update
    static updateUserStatus(email){
        return new Promise((resolve, reject) => {
            db.query('UPDATE user SET user_status = ? WHERE email= ?',
            [1, email],
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }

    static updateUserResetPassword(id, password, token, experesToken){
        return new Promise((resolve, reject) => {
            db.query('UPDATE user SET password = ?, token = ?, experesToken = ? WHERE user_id = ?',
            [password, token, experesToken, id],
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }

    static resetTokenExperes(id, token, experesToken){
        return new Promise((resolve, reject) => {
            db.query('UPDATE user SET token = ?, experesToken = ? WHERE user_id = ?',
            [token, experesToken, id],
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }

    //delete
    static deleteObj(id){
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM user WHERE user_id = ?',
            [id],
            (err, result) => {
                return err ? reject(err) : resolve(result.insertId);
            });
        });
    }
};