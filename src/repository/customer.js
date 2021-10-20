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
    static getCustomer(customer_id){
        return new Promise((resolve, reject) => {
            db.query('select * from customer where customer_id = ?',
            [customer_id],
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }
    static getEmail(customer_id){
        return new Promise((resolve, reject) => {
            db.query('select email from email where customer_id = ?',
            [customer_id],
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }
    static getPhone(customer_id){
        return new Promise((resolve, reject) => {
            db.query('select number from phone where customer_id = ?',
            [customer_id],
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }
    static getAddress(customer_id){
        return new Promise((resolve, reject) => {
            db.query('select * from address where customer_id = ?',
            [customer_id],
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }

    //insert
    static createCustomer(user_id, customer) {
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO customer (user_id, corporateName, fantasyName, typeOfPerson, cnpjOrCpf) VALUES (?, ?, ?, ?, ?);",
            [user_id, customer.corporateName, customer.fantasyName, customer.typeOfPerson, customer.cnpjOrCpf],
            (err, result) => {
                return err ? reject(err) : resolve(result.insertId);
            });
        });
    }
    static createEmail(customer_id, email) {
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO email (customer_id, email) VALUES (?, ?);",
            [customer_id, email],
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }
    static createPhone(customer_id, number) {
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO phone (customer_id, number) VALUES (?, ?);",
            [customer_id, number],
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }
    static createAddress(customer_id, address) {
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO address (customer_id, typeAddress, municipality, country, zip, state, city, district, street, number, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [customer_id, address.typeAddress, address.municipality, address.country, address.zip, address.state, address.city, address.district, address.street, address.number, address.details],
            (err, result) => {
                return err ? reject(err) : resolve(result);
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
    static updateDeleteCustomer(customer_id){
        return new Promise((resolve, reject) => {
            db.query('UPDATE customer SET status = ? WHERE customer_id= ?',
            [0, customer_id],
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }

    //delete
    static deleteCustomer(customer_id){
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM customer WHERE customer_id = ?',
            [customer_id],
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }
    static deleteEmail(customer_id){
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM email WHERE customer_id = ?',
            [customer_id],
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }
    static deletePhone(customer_id){
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM phone WHERE customer_id = ?',
            [customer_id],
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }
    static deleteAddress(customer_id){
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM address WHERE customer_id = ?',
            [customer_id],
            (err, result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }
};