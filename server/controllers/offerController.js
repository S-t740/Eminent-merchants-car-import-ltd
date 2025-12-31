const { Op } = require('sequelize');
const { Offer, Vehicle } = require('../models');

// @desc    Get all offers
// @route   GET /api/offers
// @access  Public
exports.getOffers = async (req, res, next) => {
    try {
        const { active } = req.query;

        const where = {};

        if (active === 'true') {
            where.isActive = true;
            where.startDate = { [Op.lte]: new Date() };
            where.endDate = { [Op.gte]: new Date() };
        }

        const offers = await Offer.findAll({
            where,
            include: [{
                model: Vehicle,
                as: 'vehicle',
                attributes: ['id', 'title', 'make', 'model', 'year', 'price', 'images', 'status']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: offers
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single offer
// @route   GET /api/offers/:id
// @access  Public
exports.getOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findByPk(req.params.id, {
            include: [{
                model: Vehicle,
                as: 'vehicle'
            }]
        });

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer not found'
            });
        }

        res.json({
            success: true,
            data: offer
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create offer
// @route   POST /api/offers
// @access  Private/Admin
exports.createOffer = async (req, res, next) => {
    try {
        const { vehicleId } = req.body;

        // Check if vehicle exists
        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        const offer = await Offer.create(req.body);

        // Fetch with vehicle data
        const offerWithVehicle = await Offer.findByPk(offer.id, {
            include: [{
                model: Vehicle,
                as: 'vehicle'
            }]
        });

        res.status(201).json({
            success: true,
            data: offerWithVehicle
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
exports.updateOffer = async (req, res, next) => {
    try {
        let offer = await Offer.findByPk(req.params.id);

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer not found'
            });
        }

        offer = await offer.update(req.body);

        // Fetch with vehicle data
        const offerWithVehicle = await Offer.findByPk(offer.id, {
            include: [{
                model: Vehicle,
                as: 'vehicle'
            }]
        });

        res.json({
            success: true,
            data: offerWithVehicle
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
exports.deleteOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findByPk(req.params.id);

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer not found'
            });
        }

        await offer.destroy();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
