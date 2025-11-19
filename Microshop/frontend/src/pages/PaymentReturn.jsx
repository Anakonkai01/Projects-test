import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';
import { confirmOrderPayment } from '../features/orders/orderSlice';
const PaymentReturn = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    const responseCode = searchParams.get('vnp_ResponseCode');
    const orderId = searchParams.get('vnp_TxnRef');
    const amount = searchParams.get('vnp_Amount');

    const isSuccess = responseCode === '00';

    useEffect(() => {
        if (isSuccess) {
            dispatch(clearCart());
            dispatch(confirmOrderPayment(orderId));
        }
    }, [isSuccess,orderId, dispatch]);

    return (
        <div className="container mx-auto p-10 text-center flex flex-col items-center">
            {isSuccess ? (
                <>
                    <div className="bg-green-100 text-green-700 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h1 className="text-3xl font-bold text-green-600 mb-4">Thanh toán thành công!</h1>
                    <p className="text-gray-700 mb-2">Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được thanh toán.</p>
                    <p className="text-gray-700">Mã đơn hàng: <span className="font-semibold">{orderId}</span></p>
                    <p className="text-gray-700 mb-6">Số tiền: <span className="font-semibold">{(amount / 100).toLocaleString('vi-VN')} đ</span></p>
                    <Link to={`/order/${orderId}`} className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
                        Xem chi tiết đơn hàng
                    </Link>
                </>
            ) : (
                <>
                    <div className="bg-red-100 text-red-700 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Thanh toán thất bại!</h1>
                    <p className="text-gray-700 mb-6">Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.</p>
                    <Link to="/checkout" className="bg-gray-700 text-white py-2 px-6 rounded-lg hover:bg-gray-800">
                        Thử lại thanh toán
                    </Link>
                </>
            )}
        </div>
    );
};

export default PaymentReturn;