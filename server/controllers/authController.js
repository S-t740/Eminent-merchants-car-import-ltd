const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public (first admin) / Private (subsequent)
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if any users exist (first user becomes admin)
        const userCount = await User.count();
        const userRole = userCount === 0 ? 'admin' : (role || 'staff');

        // Only admin can create new users after first
        if (userCount > 0 && !req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to create users'
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: userRole
        });

        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            data: {
                user,
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        const token = generateToken(user.id);

        res.json({
            success: true,
            data: {
                user,
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        res.json({
            success: true,
            data: req.user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findByPk(req.user.id);

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        user.password = newPassword;
        await user.save();

        const token = generateToken(user.id);

        res.json({
            success: true,
            data: { token }
        });
    } catch (error) {
        next(error);
    }
};
