const Order = require('../models/orderModel');
const axios = require('axios');
const { publisher } = require('../redis');
const Discount = require('../models/discountModel');

exports.createOrder = async (req, res) => {
    const { orderItems, shippingInfo, paymentInfo, discountCode, pointsToRedeem = 0, guestEmail, guestName } = req.body;
    
    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ success: false, error: 'Giỏ hàng trống' });
    }

    try {
        let userId;

        // Logic xác định userId (giữ nguyên)
        if (req.user) {
            userId = req.user.id;
        } else if (guestEmail) {
            try {
                const { data } = await axios.post(`${process.env.USERS_URL}/internal/find-or-create-user`, {
                    email: guestEmail,
                    name: guestName || 'Khách hàng' 
                });
                userId = data.userId;
            } catch (err) {
                console.error("Lỗi khi tìm hoặc tạo guest user:", err.response?.data || err.message);
                return res.status(500).json({ success: false, error: 'Không thể xử lý thông tin khách hàng.' });
            }
        } else {
            return res.status(400).json({ success: false, error: 'Yêu cầu thiếu thông tin người dùng.' });
        }

        const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const taxPrice = 0.1 * itemsPrice;
        const shippingPrice = itemsPrice > 2000000 ? 0 : 50000;
        let couponDiscountPrice = 0;
        let pointsDiscountPrice = 0;
        let finalTotalPrice = itemsPrice + taxPrice + shippingPrice;

        // === BẮT ĐẦU SỬA LỖI LOGIC DISCOUNT ===

        let validDiscount = null; // 1. Khai báo 'let' ở ngoài

        if (discountCode) {
            validDiscount = await Discount.findOne({ code: discountCode }); // 2. Tìm 1 LẦN DUY NHẤT

            if (validDiscount && validDiscount.timesUsed < validDiscount.usageLimit) {
                couponDiscountPrice = validDiscount.discountType === 'percentage' 
                    ? (itemsPrice * validDiscount.value) / 100 
                    : validDiscount.value;
                
                // 3. KHÔNG CỘNG 'timesUsed' ở đây
            } else {
                return res.status(400).json({ success: false, error: 'Mã giảm giá không hợp lệ hoặc đã hết lượt' });
            }
        }

        // === KẾT THÚC SỬA LỖI LOGIC DISCOUNT ===


        // Logic đổi điểm (giữ nguyên)
        if (pointsToRedeem > 0) {
            try {
                if (!req.user) {
                    return res.status(400).json({ success: false, error: 'Chỉ có thành viên mới được sử dụng điểm thưởng.' });
                }
                await axios.post(`${process.env.USERS_URL}/internal/update-points`, { userId: userId, points: -pointsToRedeem });
                pointsDiscountPrice = pointsToRedeem * 1000;
            } catch (err) {
                const errorMessage = err.response?.data?.error || 'Không đủ điểm hoặc lỗi khi đổi điểm.';
                return res.status(400).json({ success: false, error: errorMessage });
            }
        }
        
        finalTotalPrice = finalTotalPrice - couponDiscountPrice - pointsDiscountPrice;
        if (finalTotalPrice < 0) finalTotalPrice = 0;

        const order = await Order.create({
            orderItems, shippingInfo, paymentInfo, itemsPrice, taxPrice, shippingPrice,
            discountPrice: couponDiscountPrice,
            redeemedPoints: pointsToRedeem,
            pointsDiscountPrice,
            totalPrice: finalTotalPrice,
            user: userId,
            orderStatusHistory: [{ status: 'Pending' }]
        });
        
        // === SỬA LỖI: Cập nhật và lưu discount sau khi đã tạo order
        if (validDiscount) { // 4. Kiểm tra đối tượng 'validDiscount'
            validDiscount.timesUsed += 1; // 5. Cập nhật 'timesUsed'
            validDiscount.ordersApplied.push(order._id); // 6. Cập nhật 'ordersApplied'
            await validDiscount.save(); // 7. LƯU LẠI
        }

        // Phát sự kiện trừ kho (giữ nguyên)
        if (publisher.isReady) {
            const eventPayload = {
                type: 'ORDER_CREATED',
                payload: { items: order.orderItems },
            };
            await publisher.publish('order-events', JSON.stringify(eventPayload));
        }

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        console.error("Lỗi tại createOrder:", error);
        res.status(500).json({ success: false, error: 'Lỗi Server' });
    }
};
// @desc    Lấy các đơn hàng của người dùng hiện tại
// @route   GET /api/v1/orders/me
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Lỗi Server' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const resultsPerPage = 10;
        const page = Number(req.query.page) || 1;

        const totalOrders = await Order.countDocuments();

        const orders = await Order.find({})
            .sort({ createdAt: -1 }) // Sắp xếp đơn hàng mới nhất lên đầu
            .limit(resultsPerPage)
            .skip(resultsPerPage * (page - 1));

        res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                total: totalOrders,
                perPage: resultsPerPage,
                totalPages: Math.ceil(totalOrders / resultsPerPage),
                currentPage: page
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Admin lấy chi tiết một đơn hàng
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
    try {
        // Populate 'user' để lấy tên và email của người mua
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy đơn hàng' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
exports.getMyOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy đơn hàng' });
        }

        // --- KIỂM TRA QUYỀN SỞ HỮU ---
        // So sánh ID user trong token với ID user của đơn hàng
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Bạn không có quyền xem đơn hàng này' });
        }
        // --- KẾT THÚC KIỂM TRA ---

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Lỗi Server' });
    }
};

// @desc    Admin cập nhật trạng thái đơn hàng
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy đơn hàng' });
        }

        // Thêm trạng thái mới vào lịch sử thay vì thay thế
        order.orderStatusHistory.push({ status });

        if (status === 'Delivered') {
            order.deliveredAt = Date.now();
        }

        // validateBeforeSave: false để không bị lỗi validation khi chỉ cập nhật status
        await order.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.confirmClientPayment = async (req, res) => {
    try {
        // Tìm và cập nhật nguyên tử một đơn hàng CHƯA có trường paidAt
        const updatedOrder = await Order.findOneAndUpdate(
            { 
                _id: req.params.id, 
                paidAt: { $exists: false } // Điều kiện chính: chỉ cập nhật nếu chưa được thanh toán
            }, 
            {
                $set: {
                    'paymentInfo.status': 'succeeded',
                    paidAt: new Date()
                }
            },
            {
                new: true // Trả về document sau khi đã được cập nhật
            }
        );

        // Nếu updatedOrder là null, nghĩa là đơn hàng không tồn tại hoặc đã được xử lý thanh toán trước đó
        if (!updatedOrder) {
            console.log(`Ngăn chặn xử lý thanh toán trùng lặp cho đơn hàng: ${req.params.id}`);
            // Lấy lại đơn hàng đã cập nhật để trả về cho client
            const alreadyUpdatedOrder = await Order.findById(req.params.id);
            if (!alreadyUpdatedOrder) {
                 return res.status(404).json({ success: false, error: 'Không tìm thấy đơn hàng' });
            }
            return res.status(200).json({ success: true, data: alreadyUpdatedOrder });
        }

        // Nếu cập nhật thành công (đây là lần đầu tiên), tiến hành gửi sự kiện cộng điểm
        if (updatedOrder.totalPrice > 0 && publisher.isReady) {
            const eventPayload = {
                type: 'PAYMENT_SUCCESSFUL',
                payload: {
                    userId: updatedOrder.user,
                    totalPrice: updatedOrder.totalPrice
                }
            };
            await publisher.publish('payment-events', JSON.stringify(eventPayload));
            console.log(`Đã gửi sự kiện PAYMENT_SUCCESSFUL cho đơn hàng ${updatedOrder._id}`);
        }
        if (publisher.isReady) {
            const emailEvent = {
                type: 'SEND_ORDER_CONFIRMATION',
                payload: {
                    userId: updatedOrder.user,
                    // Gửi đi một object đơn hàng đã được đơn giản hóa
                    order: {
                        _id: updatedOrder._id.toString(),
                        totalPrice: updatedOrder.totalPrice,
                        createdAt: updatedOrder.createdAt,
                        shippingInfo: updatedOrder.shippingInfo,
                        orderItems: updatedOrder.orderItems.map(item => ({
                            name: item.name,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                }
            };
            await publisher.publish('email-events', JSON.stringify(emailEvent));
            console.log(`Đã gửi sự kiện SEND_ORDER_CONFIRMATION cho đơn hàng ${updatedOrder._id}`);
        }

        res.status(200).json({ success: true, data: updatedOrder });

    } catch (error) {
        console.error("Lỗi khi client xác nhận thanh toán:", error);
        res.status(500).json({ success: false, error: 'Lỗi Server' });
    }
};