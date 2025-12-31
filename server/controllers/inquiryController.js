const { validationResult } = require('express-validator');
const { Inquiry, Vehicle } = require('../models');

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
exports.getInquiries = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const where = {};
        if (status) where.status = status;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows: inquiries } = await Inquiry.findAndCountAll({
            where,
            include: [{
                model: Vehicle,
                as: 'vehicle',
                attributes: ['id', 'title', 'make', 'model', 'year']
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset
        });

        res.json({
            success: true,
            data: inquiries,
            pagination: {
                total: count,
                page: parseInt(page),
                pages: Math.ceil(count / parseInt(limit)),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create inquiry (contact form)
// @route   POST /api/inquiries
// @access  Public
exports.createInquiry = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, phone, message, vehicleId } = req.body;
        console.log('📩 New Inquiry Request:', { name, email, phone, vehicleId });

        // If vehicleId provided, verify it exists
        if (vehicleId) {
            const vehicle = await Vehicle.findByPk(vehicleId);
            if (!vehicle) {
                console.log('⚠️ Vehicle not found for inquiry:', vehicleId);
                return res.status(404).json({
                    success: false,
                    message: 'Vehicle not found'
                });
            }
        }

        const inquiry = await Inquiry.create({
            name,
            email: email || null,
            phone,
            message,
            vehicleId
        });

        res.status(201).json({
            success: true,
            data: inquiry,
            message: 'Thank you for your inquiry. We will contact you shortly.'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private/Admin
exports.updateInquiry = async (req, res, next) => {
    try {
        let inquiry = await Inquiry.findByPk(req.params.id);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        inquiry = await inquiry.update(req.body);

        res.json({
            success: true,
            data: inquiry
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
exports.deleteInquiry = async (req, res, next) => {
    try {
        const inquiry = await Inquiry.findByPk(req.params.id);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        await inquiry.destroy();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get inquiry stats
// @route   GET /api/inquiries/stats
// @access  Private/Admin
exports.getInquiryStats = async (req, res, next) => {
    try {
        const total = await Inquiry.count();
        const newInquiries = await Inquiry.count({ where: { status: 'new' } });
        const contacted = await Inquiry.count({ where: { status: 'contacted' } });
        const closed = await Inquiry.count({ where: { status: 'closed' } });

        res.json({
            success: true,
            data: {
                total,
                new: newInquiries,
                contacted,
                closed
            }
        });
    } catch (error) {
        next(error);
    }
};
