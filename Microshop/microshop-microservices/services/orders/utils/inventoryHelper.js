// microshop-microservices/services/orders/utils/inventoryHelper.js
const axios = require('axios');

/**
 * Validate và reserve inventory trước khi tạo order
 * @param {Array} orderItems - Danh sách items trong order
 * @returns {Promise<Object>} - { success: boolean, error?: string }
 */
async function validateAndReserveInventory(orderItems) {
    try {
        const PRODUCTS_URL = process.env.PRODUCTS_URL || 'http://localhost:8002';

        // Gọi API validate-stock của Products service
        const response = await axios.post(
            `${PRODUCTS_URL}/products_ser/validate-stock`,
            { items: orderItems },
            { timeout: 5000 } // 5s timeout
        );

        return response.data;
    } catch (error) {
        console.error('❌ Error validating inventory:', error.response?.data || error.message);

        if (error.response?.status === 400) {
            // Lỗi từ Products service (out of stock, etc.)
            return {
                success: false,
                error: error.response.data.error || 'Không đủ hàng trong kho'
            };
        }

        // Lỗi network hoặc timeout
        return {
            success: false,
            error: 'Không thể kết nối với hệ thống quản lý kho. Vui lòng thử lại sau.'
        };
    }
}

/**
 * Rollback inventory nếu order creation thất bại
 * @param {Array} orderItems - Danh sách items cần rollback
 */
async function rollbackInventory(orderItems) {
    try {
        const PRODUCTS_URL = process.env.PRODUCTS_URL || 'http://localhost:8002';

        await axios.post(
            `${PRODUCTS_URL}/products_ser/rollback-stock`,
            { items: orderItems },
            { timeout: 5000 }
        );

        console.log('✅ Inventory rollback successful');
    } catch (error) {
        console.error('❌ CRITICAL: Failed to rollback inventory:', error.message);
        // Log chi tiết để admin có thể manual rollback
        console.error('Items that need manual rollback:', JSON.stringify(orderItems));
    }
}

module.exports = {
    validateAndReserveInventory,
    rollbackInventory
};
