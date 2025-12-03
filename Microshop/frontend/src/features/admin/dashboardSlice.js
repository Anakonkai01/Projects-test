// E_com/FE/src/features/admin/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from './dashboardService';

const initialState = {
    stats: {
        totalUsers: 0,
        newUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        bestSellers: [],
    },
    salesData: [],
    isLoadingSales: false,
    isLoading: false,
    isError: false,
    message: '',
};

// Thunk để lấy tất cả dữ liệu thống kê cùng lúc
export const fetchDashboardStats = createAsyncThunk('dashboard/fetchStats', async (_, thunkAPI) => {
    try {
        // Gọi song song cả 3 API để tăng tốc độ
        const [userStats, orderStats, productStats] = await Promise.all([
            dashboardService.getUserStats(),
            dashboardService.getOrderStats(),
            dashboardService.getProductStats(),
        ]);

        console.log('📊 Dashboard Stats Received:');
        console.log('User Stats:', userStats);
        console.log('Order Stats:', orderStats);
        console.log('Product Stats:', productStats);

        return { ...userStats, ...orderStats, ...productStats };
    } catch (error) {
        console.error('❌ Error fetching dashboard stats:', error);
        const message = error.response?.data?.error || 'Không thể tải dữ liệu dashboard.';
        return thunkAPI.rejectWithValue(message);
    }
});
export const fetchSalesStats = createAsyncThunk('dashboard/fetchSales', async (params, thunkAPI) => {
    try {
        return await dashboardService.getSalesStats(params);
    } catch (error) {
        const message = error.response?.data?.error || 'Không thể tải dữ liệu biểu đồ.';
        return thunkAPI.rejectWithValue(message);
    }
});

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(fetchSalesStats.pending, (state) => {
                state.isLoadingSales = true;
            })
            .addCase(fetchSalesStats.fulfilled, (state, action) => {
                state.isLoadingSales = false;
                state.salesData = action.payload;
            })
            .addCase(fetchSalesStats.rejected, (state, action) => {
                state.isLoadingSales = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;