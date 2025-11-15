const express = require('express');
const {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.route('/')
    .get(getAllProducts)
    .post(protect, authorize('ADMIN'), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, authorize('ADMIN'), updateProduct)
    .delete(protect, authorize('ADMIN'), deleteProduct);

router.use('/:productId/reviews', reviewRouter);

module.exports = router;