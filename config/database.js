const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Jemmy.mysql',
    database: 'hyperlink_prep'
});


module.exports = pool;