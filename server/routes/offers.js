const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getOffers,
    getOffer,
    createOffer,
    updateOffer,
    deleteOffer
} = require('../controllers/offerController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const offerValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('vehicleId').notEmpty().withMessage('Vehicle is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required')
];

// Public routes
router.get('/', getOffers);
router.get('/:id', getOffer);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin', 'staff'), offerValidation, createOffer);
router.put('/:id', protect, authorize('admin', 'staff'), updateOffer);
router.delete('/:id', protect, authorize('admin'), deleteOffer);

module.exports = router;
