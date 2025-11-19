// E_com/FE/src/features/admin/adminOrderSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminOrderService from './adminOrderService';

const initialState = {
    orders: [],
    order: null, // Dùng để lưu chi tiết 1 đơn hàng
    pagination: {},
    isLoading: false,
    isError: false,
    message: '',
};

// Lấy danh sách đơn hàng
export const getAdminOrders = createAsyncThunk('adminOrders/getAll', async (queryParams, thunkAPI) => {
    try {
        return await adminOrderService.getOrders(queryParams);
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Lấy chi tiết một đơn hàng
export const getAdminOrderById = createAsyncThunk('adminOrders/getById', async (orderId, thunkAPI) => {
    try {
        return await adminOrderService.getOrderById(orderId);
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Cập nhật trạng thái đơn hàng
export const updateAdminOrderStatus = createAsyncThunk('adminOrders/updateStatus', async (data, thunkAPI) => {
    try {
        return await adminOrderService.updateOrderStatus(data);
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const adminOrderSlice = createSlice({
    name: 'adminOrders',
    initialState,
    reducers: {
        // Reset state loading/error mà không xóa dữ liệu đang hiển thị
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Orders
            .addCase(getAdminOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAdminOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(getAdminOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            .addCase(getAdminOrderById.pending, (state) => {
                state.isLoading = true;
                state.order = null; // Xóa đơn hàng cũ khi tải đơn hàng mới
            })
            .addCase(getAdminOrderById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.order = action.payload;
            })
            .addCase(getAdminOrderById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Update Order Status
            .addCase(updateAdminOrderStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.order = action.payload; // Cập nhật lại chi tiết đơn hàng với trạng thái mới
                // Cập nhật trạng thái trong danh sách orders (nếu có)
                const index = state.orders.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(updateAdminOrderStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
            

    },
});

export const { reset } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;