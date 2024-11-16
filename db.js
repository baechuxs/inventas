const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'mysql.railway.internal',
  user: 'root',
  password: 'ztXDFhClrTWixpHDOGcUaFXQyXXEwRGX',
  database: 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

module.exports = pool;
