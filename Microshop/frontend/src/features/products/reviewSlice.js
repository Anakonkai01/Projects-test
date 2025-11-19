import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from './reviewService';
import { toast } from 'sonner';

const initialState = {
    reviews: [],
    isLoading: false,
    isError: false,
    message: '',
};

export const getProductReviews = createAsyncThunk('reviews/get', async (productId, thunkAPI) => {
    try {
        return await reviewService.getReviews(productId);
    } catch (error) {
        return thunkAPI.rejectWithValue('Không thể tải đánh giá.');
    }
});

export const createProductReview = createAsyncThunk('reviews/create', async ({ productId, reviewData }, thunkAPI) => {
    try {
        const response = await reviewService.createReview(productId, reviewData);
        toast.success(response.message);
        // Sau khi tạo thành công, gọi lại action để lấy danh sách review mới nhất
        thunkAPI.dispatch(getProductReviews(productId)); 
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Bạn cần đăng nhập để đánh giá.';
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
});

export const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProductReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProductReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews = action.payload;
            })
            .addCase(getProductReviews.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createProductReview.pending, (state) => {
                state.isLoading = true; // Có thể dùng 1 state loading khác cho việc submit
            })
            .addCase(createProductReview.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(createProductReview.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = reviewSlice.actions;
export default reviewSlice.reducer;