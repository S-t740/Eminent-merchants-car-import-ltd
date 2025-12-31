const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const { Vehicle, Offer } = require('../models');
const fs = require('fs');
const path = require('path');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Public
exports.getVehicles = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 12,
            make,
            model,
            yearMin,
            yearMax,
            priceMin,
            priceMax,
            transmission,
            fuelType,
            status,
            featured,
            sort = 'createdAt',
            order = 'DESC',
            search
        } = req.query;

        // Build where clause
        const where = {};

        // Use Op.like with LOWER for SQLite compatibility (case-insensitive)
        if (make) {
            where[Op.and] = [
                ...(where[Op.and] || []),
                sequelize.where(sequelize.fn('LOWER', sequelize.col('make')), 'LIKE', `%${make.toLowerCase()}%`)
            ];
        }
        if (model) {
            where[Op.and] = [
                ...(where[Op.and] || []),
                sequelize.where(sequelize.fn('LOWER', sequelize.col('model')), 'LIKE', `%${model.toLowerCase()}%`)
            ];
        }
        if (transmission) where.transmission = transmission;
        if (fuelType) where.fuelType = fuelType;
        if (status) where.status = status;
        if (featured === 'true') where.featured = true;

        if (yearMin || yearMax) {
            where.year = {};
            if (yearMin) where.year[Op.gte] = parseInt(yearMin);
            if (yearMax) where.year[Op.lte] = parseInt(yearMax);
        }

        if (priceMin || priceMax) {
            where.price = {};
            if (priceMin) where.price[Op.gte] = parseFloat(priceMin);
            if (priceMax) where.price[Op.lte] = parseFloat(priceMax);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            where[Op.or] = [
                sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', `%${searchLower}%`),
                sequelize.where(sequelize.fn('LOWER', sequelize.col('make')), 'LIKE', `%${searchLower}%`),
                sequelize.where(sequelize.fn('LOWER', sequelize.col('model')), 'LIKE', `%${searchLower}%`)
            ];
        }

        // Calculate offset
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Allowed sort fields
        const allowedSortFields = ['createdAt', 'price', 'year', 'mileage', 'views'];
        const sortField = allowedSortFields.includes(sort) ? sort : 'createdAt';
        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const { count, rows: vehicles } = await Vehicle.findAndCountAll({
            where,
            order: [[sortField, sortOrder]],
            limit: parseInt(limit),
            offset
        });

        res.json({
            success: true,
            data: vehicles,
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

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Public
exports.getVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id, {
            include: [{
                model: Offer,
                as: 'offers',
                where: {
                    isActive: true,
                    startDate: { [Op.lte]: new Date() },
                    endDate: { [Op.gte]: new Date() }
                },
                required: false
            }]
        });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        // Increment views
        await vehicle.increment('views');

        res.json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create vehicle
// @route   POST /api/vehicles
// @access  Private/Admin
exports.createVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.create(req.body);

        res.status(201).json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
exports.updateVehicle = async (req, res, next) => {
    try {
        let vehicle = await Vehicle.findByPk(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        vehicle = await vehicle.update(req.body);

        res.json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
exports.deleteVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        // Delete images from local filesystem
        if (vehicle.images && vehicle.images.length > 0) {
            for (const image of vehicle.images) {
                if (image.publicId) {
                    const filePath = path.join(__dirname, '../uploads/vehicles', image.publicId);
                    if (fs.existsSync(filePath)) {
                        fs.unlink(filePath, err => {
                            if (err) console.error('Error deleting file:', err);
                        });
                    }
                }
            }
        }

        await vehicle.destroy();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload vehicle images
// @route   POST /api/vehicles/:id/images
// @access  Private/Admin
// @desc    Upload vehicle images
// @route   POST /api/vehicles/:id/images
// @access  Private/Admin
exports.uploadImages = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);

        if (!vehicle) {
            // Delete uploaded files if vehicle not found
            if (req.files) {
                req.files.forEach(file => {
                    fs.unlink(file.path, err => {
                        if (err) console.error('Error deleting file:', err);
                    });
                });
            }
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please upload at least one image'
            });
        }

        const uploadedImages = req.files.map(file => ({
            url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/vehicles/${file.filename}`,
            publicId: file.filename
        }));

        // Append to existing images
        const currentImages = vehicle.images || [];
        vehicle.images = [...currentImages, ...uploadedImages];
        await vehicle.save();

        res.json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        // Delete uploaded files on error
        if (req.files) {
            req.files.forEach(file => {
                fs.unlink(file.path, err => {
                    if (err) console.error('Error deleting file:', err);
                });
            });
        }
        next(error);
    }
};

// @desc    Delete vehicle image
// @route   DELETE /api/vehicles/:id/images/:publicId
// @access  Private/Admin
exports.deleteImage = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        const publicId = req.params.publicId;

        // Delete from local filesystem
        const filePath = path.join(__dirname, '../uploads/vehicles', publicId);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remove from vehicle images array
        vehicle.images = vehicle.images.filter(img => img.publicId !== publicId);
        await vehicle.save();

        res.json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        next(error);
    }
};


// @desc    Get featured vehicles
// @route   GET /api/vehicles/featured
// @access  Public
exports.getFeaturedVehicles = async (req, res, next) => {
    try {
        const vehicles = await Vehicle.findAll({
            where: {
                featured: true,
                status: 'available'
            },
            limit: 6,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: vehicles
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get vehicle statistics
// @route   GET /api/vehicles/stats
// @access  Private/Admin
exports.getVehicleStats = async (req, res, next) => {
    try {
        const totalVehicles = await Vehicle.count();
        const availableVehicles = await Vehicle.count({ where: { status: 'available' } });
        const reservedVehicles = await Vehicle.count({ where: { status: 'reserved' } });
        const soldVehicles = await Vehicle.count({ where: { status: 'sold' } });

        // Get makes for filter
        const makes = await Vehicle.findAll({
            attributes: ['make'],
            group: ['make'],
            raw: true
        });

        res.json({
            success: true,
            data: {
                total: totalVehicles,
                available: availableVehicles,
                reserved: reservedVehicles,
                sold: soldVehicles,
                makes: makes.map(m => m.make)
            }
        });
    } catch (error) {
        next(error);
    }
};
