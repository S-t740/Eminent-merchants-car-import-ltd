const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');

/**
 * TEMPORARY ROUTE - Remove after admin is created!
 * Creates admin user by visiting: /api/setup-admin
 */
router.get('/setup-admin', async (req, res) => {
    try {
        // Check if admin already exists
        const adminExists = await User.findOne({ where: { email: 'staff@gmail.com' } });

        if (adminExists) {
            return res.json({
                success: true,
                message: 'Admin user already exists',
                email: 'staff@gmail.com'
            });
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('staff123', 12);

        const admin = await User.create({
            name: 'Admin',
            email: 'staff@gmail.com',
            password: hashedPassword,
            role: 'admin',
            isActive: true
        });

        res.json({
            success: true,
            message: 'Admin user created successfully!',
            email: 'staff@gmail.com',
            password: 'staff123',
            warning: 'Please delete this route after creating admin! Remove routes/setup.js and the route mount in server_recovered.js'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating admin user',
            error: error.message
        });
    }
});

module.exports = router;
