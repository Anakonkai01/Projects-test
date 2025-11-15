// Nhan/frontend/src/components/Cart/CartDrawer.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// SỬA: Bỏ Link, thêm useNavigate
import { useNavigate } from 'react-router-dom'; 
import { IoMdClose } from 'react-icons/io';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa'; 
// SỬA: Thêm toggleItemSelection
import { getTotals, updateQuantity, removeFromCart, toggleItemSelection } from '../../features/cart/cartSlice';
import { toast } from 'sonner'; // <-- THÊM

const CartDrawer = ({ isOpen, toggleDrawer }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // <-- THÊM
    // SỬA: Lấy thêm selectedItemKeys
    const { cartItems, totalAmount, selectedItemKeys } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(getTotals());
    // SỬA: Thêm selectedItemKeys vào dependency
    }, [cartItems, selectedItemKeys, dispatch]); 

    const handleQuantityChange = (item, newQuantity) => {
        // ... (Giữ nguyên)
        if (newQuantity >= 1) {
            dispatch(updateQuantity({ id: item._id, variantId: item.variant._id, quantity: newQuantity }));
        }
    };

    const handleRemove = (item) => {
        // ... (Giữ nguyên)
        dispatch(removeFromCart({ id: item._id, variantId: item.variant._id }));
    };
    
    // THÊM: Hàm xử lý khi nhấn checkbox
    const handleToggleSelect = (itemKey) => {
        dispatch(toggleItemSelection(itemKey));
    };

    // THÊM: Hàm xử lý khi nhấn "Tiến hành thanh toán"
    const handleCheckout = () => {
        // 1. Lọc ra các sản phẩm đã chọn
        const selectedItems = cartItems.filter(item => 
            selectedItemKeys.includes(`${item._id}-${item.variant._id}`)
        );

        // 2. Kiểm tra
        if (selectedItems.length === 0) {
            toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
            return;
        }

        // 3. Điều hướng đến checkout với các item đã chọn (dùng key 'items' SỐ NHIỀU)
        navigate('/checkout', { state: { items: selectedItems } });
        toggleDrawer(); // Đóng giỏ hàng
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        <>
            {/* Lớp nền mờ (giữ nguyên) */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleDrawer}
            ></div>

            {/* Ngăn kéo giỏ hàng */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header (giữ nguyên) */}
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-semibold">Giỏ Hàng</h2>
                        <button onClick={toggleDrawer}>
                            <IoMdClose size={24} />
                        </button>
                    </div>

                    {/* Danh sách sản phẩm (SỬA) */}
                    <div className="flex-grow overflow-y-auto p-4">
                        {cartItems.length === 0 ? (
                            <p className="text-center text-gray-500">Giỏ hàng của bạn đang trống.</p>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map(item => {
                                    // Tạo key cho item
                                    const itemKey = `${item._id}-${item.variant._id}`;
                                    const isSelected = selectedItemKeys.includes(itemKey);

                                    return (
                                        // SỬA: Bọc trong div để thêm checkbox
                                        <div key={itemKey} className="flex items-start gap-3">
                                            {/* THÊM: Checkbox */}
                                            <input 
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleToggleSelect(itemKey)}
                                                className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                            <div className="flex-grow">
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.variant.name}</p>
                                                <p className="text-red-600">{formatPrice(item.price)}</p>
                                                
                                                {/* Phần tăng/giảm số lượng (giữ nguyên) */}
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center border rounded">
                                                        <button 
                                                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                            disabled={item.quantity <= 1}
                                                            aria-label="Giảm số lượng"
                                                        >
                                                            <FaMinus size={12} />
                                                        </button>
                                                        <span className="px-3 py-1 text-center font-medium w-12">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                                            aria-label="Tăng số lượng"
                                                        >
                                                            <FaPlus size={12} />
                                                        </button>
                                                    </div>
                                                    <button onClick={() => handleRemove(item)} className="ml-4 text-red-500 hover:text-red-700" aria-label="Xóa sản phẩm">
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer (SỬA) */}
                    {cartItems.length > 0 && (
                        <div className="p-4 border-t">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold">Tổng cộng (đã chọn):</span>
                                {/* SỬA: Dùng totalAmount từ Redux (đã được tính toán) */}
                                <span className="text-xl font-bold text-red-600">{formatPrice(totalAmount)}</span>
                            </div>
                            {/* SỬA: Đổi <Link> thành <button> */}
                            <button 
                                onClick={handleCheckout} 
                                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                disabled={selectedItemKeys.length === 0} // Vô hiệu hóa nếu chưa chọn gì
                            >
                                Tiến hành thanh toán ({selectedItemKeys.length})
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartDrawer;