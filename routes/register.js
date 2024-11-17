const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); // Using promise-based version
const bcrypt = require('bcryptjs');

// Database connection configuration
const dbConfig = {
    host: 'inventas-sslythrrr.h.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_bIfTMJVMVcDguBDRUqI',
    database: 'defaultdb',
    port: 13258,
    connectTimeout: 60000,
    connectionLimit: 5
};

// Create connection pool instead of single connection
const pool = mysql.createPool(dbConfig);

// Validation functions
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePassword = (password) => {
    return password.length >= 8;
};

const validateIdAdmin = (id) => {
    const re = /^[A-Za-z0-9]+$/;
    return re.test(id) && id.length >= 3 && id.length <= 20;
};

// Routes
router.get('/', (req, res) => {
    res.render('register');
});

router.post('/', async (req, res) => {
    const { id_admin, email, password } = req.body;

    try {
        // Input validation
        if (!id_admin || !email || !password) {
            return res.render('register', { 
                error: 'All fields are required' 
            });
        }

        if (!validateIdAdmin(id_admin)) {
            return res.render('register', { 
                error: 'Invalid ID format. Use only letters and numbers, 3-20 characters.' 
            });
        }

        if (!validateEmail(email)) {
            return res.render('register', { 
                error: 'Invalid email format' 
            });
        }

        if (!validatePassword(password)) {
            return res.render('register', { 
                error: 'Password must be at least 8 characters long' 
            });
        }

        // Check if email or id_admin already exists
        const [existing] = await pool.execute(
            'SELECT * FROM Admin WHERE email = ? OR id_admin = ?',
            [email, id_admin]
        );

        if (existing.length > 0) {
            return res.render('register', { 
                error: 'Email or ID Admin already exists' 
            });
        }

        // Generate password hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new admin
        await pool.execute(
            'INSERT INTO Admin (id_admin, email, password) VALUES (?, ?, ?)',
            [id_admin, email, hashedPassword]
        );

        // Redirect to login with success message
        res.redirect('/login?registered=true');

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle specific MySQL errors
        if (error.code === 'ECONNREFUSED') {
            return res.render('register', { 
                error: 'Unable to connect to database. Please try again later.' 
            });
        }
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.render('register', { 
                error: 'This email or ID is already registered' 
            });
        }

        res.render('register', { 
            error: 'Registration failed. Please try again later.' 
        });
    }
});

module.exports = router;