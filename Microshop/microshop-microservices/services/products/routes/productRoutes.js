const express = require('express');
const {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllBrands
} = require('../controllers/productController');
const { validateAndReserveStock, rollbackStock } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Inventory management routes (phải đặt trước các route khác)
router.post('/validate-stock', validateAndReserveStock);
router.post('/rollback-stock', rollbackStock);

// Route để lấy danh sách brands - phải đặt trước route /:id
router.get('/brands/all', getAllBrands);

router.route('/')
    .get(getAllProducts)
    .post(protect, authorize('ADMIN'), upload.array('images', 10), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, authorize('ADMIN'), upload.array('images', 10), updateProduct)
    .delete(protect, authorize('ADMIN'), deleteProduct);

router.use('/:productId/reviews', reviewRouter);

module.exports = router;