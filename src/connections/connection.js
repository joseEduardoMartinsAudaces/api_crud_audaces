'use strict';

const mysql = require('mysql');

const connection = mysql.createPool({
   connectionLimit : 100, //important
   host     : "",
   user     : "",
   password : "",
   database : "",
   debug    :  false
});
module.exports = connection;