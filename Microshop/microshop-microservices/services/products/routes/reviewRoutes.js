const express = require('express');
const {
    createProductReview,
    getProductReviews,
    deleteReview
} = require('../controllers/reviewController');

const { protect, authorize } = require('../middleware/authMiddleware');

// `mergeParams: true` để có thể truy cập `productId` từ `productRoutes`
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getProductReviews)
    .put(protect, createProductReview);

router.route('/:reviewId')
    .delete(protect, authorize('ADMIN'), deleteReview);

module.exports = router;