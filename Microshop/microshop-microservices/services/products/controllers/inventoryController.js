// microshop-microservices/services/products/controllers/inventoryController.js
const Product = require('../models/productModel');
const mongoose = require('mongoose');

/**
 * Validate và reserve stock ATOMICALLY
 * @route POST /products_ser/validate-stock
 * @body { items: [{ variant: String, quantity: Number }] }
 */
exports.validateAndReserveStock = async (req, res) => {
    const { items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Không có sản phẩm nào để validate' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Validate từng item
        for (const item of items) {
            const { variant, quantity } = item;

            if (!variant || !quantity || quantity <= 0) {
                throw new Error('Thông tin sản phẩm không hợp lệ');
            }

            // Tìm product chứa variant này và check stock
            const product = await Product.findOne(
                { "variants._id": variant },
                { "variants.$": 1 }
            ).session(session);

            if (!product) {
                throw new Error(`Không tìm thấy sản phẩm với variant ${variant}`);
            }

            const variantData = product.variants[0];

            // Kiểm tra stock
            if (variantData.stock < quantity) {
                throw new Error(
                    `Sản phẩm "${variantData.name}" chỉ còn ${variantData.stock} sản phẩm, không đủ để đáp ứng yêu cầu ${quantity} sản phẩm`
                );
            }

            // === ATOMIC OPERATION: Reserve stock (trừ luôn) ===
            const updateResult = await Product.updateOne(
                {
                    "variants._id": variant,
                    "variants.stock": { $gte: quantity } // Đảm bảo stock đủ (double check)
                },
                {
                    $inc: {
                        "variants.$.stock": -quantity,
                        "variants.$.sold": quantity,
                        "sold": quantity
                    }
                }
            ).session(session);

            // Nếu không update được (stock đã bị trừ bởi transaction khác)
            if (updateResult.modifiedCount === 0) {
                throw new Error(`Sản phẩm "${variantData.name}" vừa hết hàng hoặc không đủ số lượng`);
            }

            console.log(`✅ Reserved ${quantity} units for variant ${variant}`);
        }

        // Commit transaction nếu tất cả items đều ok
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: 'Đã reserve inventory thành công'
        });

    } catch (error) {
        // Rollback transaction nếu có lỗi
        await session.abortTransaction();
        session.endSession();

        console.error('❌ Validate and reserve stock failed:', error.message);

        res.status(400).json({
            success: false,
            error: error.message || 'Không thể reserve inventory'
        });
    }
};

/**
 * Rollback stock nếu order creation thất bại
 * @route POST /products_ser/rollback-stock
 * @body { items: [{ variant: String, quantity: Number }] }
 */
exports.rollbackStock = async (req, res) => {
    const { items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Không có sản phẩm nào để rollback' });
    }

    try {
        for (const item of items) {
            const { variant, quantity } = item;

            if (!variant || !quantity || quantity <= 0) {
                console.error(`Invalid rollback item:`, item);
                continue;
            }

            // Hoàn trả stock (cộng lại)
            await Product.updateOne(
                { "variants._id": variant },
                {
                    $inc: {
                        "variants.$.stock": quantity,
                        "variants.$.sold": -quantity,
                        "sold": -quantity
                    }
                }
            );

            console.log(`✅ Rollback ${quantity} units for variant ${variant}`);
        }

        res.status(200).json({
            success: true,
            message: 'Đã rollback inventory thành công'
        });

    } catch (error) {
        console.error('❌ Rollback stock failed:', error.message);

        res.status(500).json({
            success: false,
            error: 'Không thể rollback inventory'
        });
    }
};
