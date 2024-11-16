const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const db = require('/db.js');


const newAdmin = {
  id_admin: 'ms300503',
    email: 'mutiarashakila300503@gmail.com',
    password: '12345'
  };

db.connect(async (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
  console.log('Connected to database');

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newAdmin.password, salt);

    const sql = 'INSERT INTO admin (id_admin, email, password) VALUES (?, ?, ?)';
    
    db.query(sql, [newAdmin.id_admin, newAdmin.email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error adding admin:', err);
      } else {
        console.log('Admin added successfully!');
        console.log('id_admin:', newAdmin.id_admin);
        console.log('Email:', newAdmin.email);
        console.log('Password:', newAdmin.password);
      }
      
      db.end();
    });

  } catch (error) {
    console.error('Error:', error);
    db.end();
  }
});