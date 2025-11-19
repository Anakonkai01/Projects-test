// E_com/FE/src/features/orders/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from './orderService';

const initialState = {
    order: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
    orders: [], 
};

// Async Thunk để tạo đơn hàng
export const createOrder = createAsyncThunk(
    'orders/create',
    async (orderData, thunkAPI) => {
        try {
            return await orderService.createOrder(orderData);
        } catch (error) {
            const message =
                (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const getMyOrders = createAsyncThunk(
    'orders/getMyOrders',
    async (_, thunkAPI) => {
        try {
            return await orderService.getMyOrders();
        } catch (error) {
            const message =
                (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const fetchMyOrderDetails = createAsyncThunk(
    'orders/fetchMyDetails',
    async (orderId, thunkAPI) => {
        try {
            return await orderService.getMyOrderDetails(orderId);
        } catch (error) {
            const message =
                (error.response?.data?.message) ||
                (error.response?.data?.error) || // Bắt cả lỗi từ middleware authorize
                error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const confirmOrderPayment = createAsyncThunk(
    'orders/confirmPayment',
    async (orderId, thunkAPI) => {
        try {
            return await orderService.confirmClientPayment(orderId);
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getMyOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.orders = action.payload;
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(fetchMyOrderDetails.pending, (state) => {
                state.isLoading = true;
                state.order = null; // Xóa order cũ khi load mới
            })
            .addCase(fetchMyOrderDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true; // Có thể set isSuccess nếu cần
                state.order = action.payload; // Lưu chi tiết đơn hàng vào state.order
            })
            .addCase(fetchMyOrderDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.order = null;
            });
    },
});

export const { reset } = orderSlice.actions;
export default orderSlice.reducer;