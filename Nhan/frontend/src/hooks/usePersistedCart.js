// Nhan/frontend/src/hooks/usePersistedCart.js
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { saveUserCart } from '../features/cart/cartSlice';

// Hook này sẽ tự động lưu cart vào DB khi nó thay đổi
const usePersistedCart = () => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    
    // Dùng useRef để bỏ qua lần chạy đầu tiên (khi cart mới được fetch)
    const isInitialMount = useRef(true);

    useEffect(() => {
        // Chỉ chạy nếu user đã đăng nhập
        if (!user) return;
        
        // Bỏ qua lần render đầu tiên
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Debounce: Chờ 1 giây sau lần thay đổi cuối cùng rồi mới lưu
        // để tránh spam API mỗi lần nhấn nút
        const timer = setTimeout(() => {
            dispatch(saveUserCart(cartItems));
        }, 1000); 

        return () => clearTimeout(timer); // Hủy timer nếu cartItems lại thay đổi
        
    }, [cartItems, user, dispatch]); // Chạy lại mỗi khi cartItems thay đổi
};

export default usePersistedCart;