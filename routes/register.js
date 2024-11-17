const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// Database connection configuration
const db = mysql.createConnection({
    host: 'inventas-sslythrrr.h.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_bIfTMJVMVcDguBDRUqI',
    database: 'defaultdb',
});

// Routes
router.get('/', (req, res) => {
    res.render('register');
});

router.post('/', async (req, res) => {
    const { id_admin, email, password } = req.body;

    try {
        // Generate password hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // SQL query to insert new admin
        const sql = 'INSERT INTO admin (id_admin, email, password) VALUES (?, ?, ?)';
        
        db.query(sql, [id_admin, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error adding admin:', err);
                res.render('register', { error: 'Registration failed' });
            } else {
                res.redirect('/login'); // Assuming you have a login route
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.render('register', { error: 'Registration failed' });
    }
});

module.exports = router;