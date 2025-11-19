// E_com/FE/src/features/payments/paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentService from './paymentService';

const initialState = {
    paymentUrl: null,
    isLoading: false,
    isError: false,
    message: '',
};

export const createVnpayUrl = createAsyncThunk('payment/createUrl', async (paymentData, thunkAPI) => {
    try {
        return await paymentService.createPaymentUrl(paymentData);
    } catch (error) {
        const message = error.response?.data?.error || 'Không thể tạo yêu cầu thanh toán.';
        return thunkAPI.rejectWithValue(message);
    }
});

export const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        reset: (state) => {
            state.paymentUrl = null;
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createVnpayUrl.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createVnpayUrl.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentUrl = action.payload;
            })
            .addCase(createVnpayUrl.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = paymentSlice.actions;
export default paymentSlice.reducer;