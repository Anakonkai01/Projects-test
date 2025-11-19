import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminDiscountService from './adminDiscountService';
import { toast } from 'sonner';

const initialState = {
    discounts: [],
    isLoading: false,
    isError: false,
    message: '',
};

export const getAdminDiscounts = createAsyncThunk('adminDiscounts/getAll', async (_, thunkAPI) => {
    try {
        return await adminDiscountService.getDiscounts();
    } catch (error) {
        return thunkAPI.rejectWithValue('Không thể tải danh sách mã giảm giá.');
    }
});

export const createAdminDiscount = createAsyncThunk('adminDiscounts/create', async (discountData, thunkAPI) => {
    try {
        return await adminDiscountService.createDiscount(discountData);
    } catch (error) {
        const message = error.response?.data?.error || 'Tạo mã thất bại. Mã có thể đã tồn tại.';
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteAdminDiscount = createAsyncThunk('adminDiscounts/delete', async (id, thunkAPI) => {
    try {
        return await adminDiscountService.deleteDiscount(id);
    } catch (error) {
        return thunkAPI.rejectWithValue('Xóa mã thất bại.');
    }
});


export const adminDiscountSlice = createSlice({
    name: 'adminDiscounts',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAdminDiscounts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAdminDiscounts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.discounts = action.payload;
            })
            .addCase(getAdminDiscounts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(createAdminDiscount.fulfilled, (state, action) => {
                state.discounts.push(action.payload);
                toast.success('Tạo mã giảm giá thành công!');
            })
            .addCase(createAdminDiscount.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(deleteAdminDiscount.fulfilled, (state, action) => {
                state.discounts = state.discounts.filter(d => d._id !== action.payload);
                toast.success('Xóa mã giảm giá thành công!');
            })
            .addCase(deleteAdminDiscount.rejected, (state, action) => {
                toast.error(action.payload);
            });
    }
});

export const { reset } = adminDiscountSlice.actions;
export default adminDiscountSlice.reducer;