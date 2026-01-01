const express = require('express');
const router = express.Router();
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
            // Delete existing admin and create new one with correct password
            await adminExists.destroy();
            console.log('Deleted existing admin user to recreate with correct password');
        }

        // Create admin user - the User model will hash the password automatically
        const admin = await User.create({
            name: 'Admin',
            email: 'staff@gmail.com',
            password: 'staff123',  // Plain password - model will hash it
            role: 'admin',
            isActive: true
        });

        res.json({
            success: true,
            message: 'Admin user created successfully!',
            email: 'staff@gmail.com',
            password: 'staff123',
            warning: 'Please delete this route after creating admin!'
        });

    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating admin user',
            error: error.message
        });
    }
});

module.exports = router;
