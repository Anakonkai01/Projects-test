// E_com/FE/src/features/discounts/discountSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import discountService from './discountService';
import { toast } from 'sonner';

const initialState = {
    // Thông tin mã giảm giá hợp lệ sẽ được lưu ở đây
    appliedDiscount: null, 
    isLoading: false,
    isError: false,
    message: '',
};

export const validateDiscountCode = createAsyncThunk('discounts/validate', async (code, thunkAPI) => {
    try {
        const discount = await discountService.validateDiscount(code);
        toast.success("Áp dụng mã giảm giá thành công!");
        return discount;
    } catch (error) {
        const message = error.response?.data?.error || 'Mã giảm giá không hợp lệ hoặc đã hết hạn.';
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
});

export const discountSlice = createSlice({
    name: 'discounts',
    initialState,
    reducers: {
        // Action để xóa mã giảm giá đã áp dụng khi người dùng muốn thay đổi
        resetDiscount: (state) => {
            state.appliedDiscount = null;
            state.isError = false;
            state.isLoading = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(validateDiscountCode.pending, (state) => {
                state.isLoading = true;
                state.appliedDiscount = null; // Xóa mã cũ khi thử mã mới
            })
            .addCase(validateDiscountCode.fulfilled, (state, action) => {
                state.isLoading = false;
                state.appliedDiscount = action.payload;
            })
            .addCase(validateDiscountCode.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.appliedDiscount = null;
            });
    }
});

export const { resetDiscount } = discountSlice.actions;
export default discountSlice.reducer;