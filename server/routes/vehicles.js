const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getVehicles,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    uploadImages,
    deleteImage,
    getFeaturedVehicles,
    getVehicleStats
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation rules
const vehicleValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('make').notEmpty().withMessage('Make is required'),
    body('model').notEmpty().withMessage('Model is required'),
    body('year').isInt({ min: 1900 }).withMessage('Valid year is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required')
];

// Public routes
router.get('/', getVehicles);
router.get('/featured', getFeaturedVehicles);
router.get('/stats', protect, authorize('admin', 'staff'), getVehicleStats);
router.get('/:id', getVehicle);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin', 'staff'), vehicleValidation, createVehicle);
router.put('/:id', protect, authorize('admin', 'staff'), updateVehicle);
router.delete('/:id', protect, authorize('admin'), deleteVehicle);

// Image routes
router.post('/:id/images', protect, authorize('admin', 'staff'), upload.array('images', 10), uploadImages);
router.delete('/:id/images/:publicId', protect, authorize('admin', 'staff'), deleteImage);

module.exports = router;
