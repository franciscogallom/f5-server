"use strict";
require("dotenv").config();
const mysql = require("mysql");
module.exports = mysql.createConnection({
    user: process.env.REACT_NATIVE_DB_USER,
    host: process.env.REACT_NATIVE_DB_HOST,
    password: process.env.REACT_NATIVE_DB_PASSWORD,
    database: process.env.REACT_NATIVE_DB,
});
