import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // user
import adminReducer from '../features/admin/adminSlice'; // admin
import productReducer from '../features/products/productSlice'; // products
import adminProductReducer from '../features/admin/adminProductSlice'; // admin
import cartReducer from '../features/cart/cartSlice'; // cart
import orderReducer from '../features/orders/orderSlice';
import adminOrderReducer from '../features/admin/adminOrderSlice'; 
import adminDiscountReducer from '../features/admin/adminDiscountSlice'; 
import discountReducer from '../features/discounts/discountSlice';
import reviewReducer from '../features/products/reviewSlice'; // review 
import paymentReducer from '../features/payments/paymentSlice';
import dashboardReducer from '../features/admin/dashboardSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        admin: adminReducer,
        products: productReducer,
        adminProducts: adminProductReducer,
        cart: cartReducer,
        order: orderReducer,
        adminOrders: adminOrderReducer,
        adminDiscounts: adminDiscountReducer,
        discounts: discountReducer,
        reviews: reviewReducer,
        payment: paymentReducer,
        dashboard: dashboardReducer,
    }
}); 