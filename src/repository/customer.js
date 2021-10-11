'use strict';

const db = require('../connections/audaces-connection');

module.exports = class Customer{
    //select
    static getAll(){
        return new Promise((resolve, reject) => {
            db.query('select * from customer',
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }
    //insert
    static createCustomer(user_id, name , cnpj, number) {
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO customer (user_id, name, cnpj, number) VALUES (?, ?, ?, ?);",
            [user_id, name, cnpj, number],
            (err, result) => {
                return err ? reject(err) : resolve(result.insertId);
            });
        });
    }
    //update
    static updateCustomer(customer){
        return new Promise((resolve, reject) => {
            db.query('UPDATE customer SET name = ?, cnpj = ?, number = ? WHERE customer_id= ?',
            [customer.customer_id, customer.name, customer.cnpj, customer.number],
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }

    //delete
    static deleteObj(id){
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM customer WHERE companyid = ?',
            [id],
            (err, result) => {
                return err ? reject(err) : resolve(result.insertId);
            });
        });
    }
};