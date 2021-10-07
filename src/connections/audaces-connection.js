'use strict';

const mysql = require('mysql');

const connection_dbTopTech = mysql.createPool({
   connectionLimit : 100, //important
   host     : "127.0.0.2",
   user     : "root",
   password : "root",
   database : "db_top_tech",
   debug    :  false
});
module.exports = connection_dbTopTech;
