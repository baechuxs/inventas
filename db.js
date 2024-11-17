const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'inventas-sslythrrr.h.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_bIfTMJVMVcDguBDRUqI',
  database: 'defaultdb',
  port: 13258,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

module.exports = pool;