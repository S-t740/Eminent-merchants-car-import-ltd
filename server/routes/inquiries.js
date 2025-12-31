const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getInquiries,
    createInquiry,
    updateInquiry,
    deleteInquiry,
    getInquiryStats
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const inquiryValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('message').notEmpty().withMessage('Message is required')
];

// Public routes
router.post('/', inquiryValidation, createInquiry);

// Protected routes (Admin only)
router.get('/', protect, authorize('admin', 'staff'), getInquiries);
router.get('/stats', protect, authorize('admin', 'staff'), getInquiryStats);
router.put('/:id', protect, authorize('admin', 'staff'), updateInquiry);
router.delete('/:id', protect, authorize('admin'), deleteInquiry);

module.exports = router;
