// E_com/BE/services/orders/controllers/paymentController.js
const { sortObject, moment } = require('../utils/vnpay');
const Order = require('../models/orderModel');
const crypto = require('crypto');
const querystring = require('qs');
const { publisher } = require('../redis');

exports.createPaymentUrl = async (req, res) => {
    try {
        let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        if (ipAddr === '::1') {
            ipAddr = '127.0.0.1';
        }
        
        const tmnCode = process.env.VNP_TMNCODE;
        const secretKey = process.env.VNP_HASHSECRET;
        let vnpUrl = process.env.VNP_URL;
        const returnUrl = process.env.VNP_RETURNURL;

        const { amount, orderId } = req.body;
        const createDate = moment(new Date()).format('YYYYMMDDHHmmss');

        if (!amount || !orderId) {
            return res.status(400).json({ success: false, error: 'Thiếu thông tin số tiền hoặc mã đơn hàng' });
        }

        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;

        vnp_Params = sortObject(vnp_Params);

        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        vnp_Params['vnp_SecureHash'] = secureHash;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        res.status(200).json({ success: true, data: vnpUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.vnpayIpn = async (req, res) => {
    res.status(200).json({ RspCode: '00', Message: 'Success' });
};