import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from './productService';

const initialState = {
    products: [],       // Dùng cho trang danh sách sản phẩm chung
    newProducts: [],
    bestSellers: [],
    laptops: [],
    phones: [],
    product: null,      // Sửa thành null, vì chỉ lưu 1 sản phẩm chi tiết
    isLoading: false,
    isError: false,
    pagination: {},
    message: ''
};

// Action để fetch nhiều sản phẩm theo danh mục
export const fetchProducts = createAsyncThunk(
    'products/fetch',
    async ({ query, type }, thunkAPI) => {
        try {
            const response = await productService.getProducts(query);
            return { response, type };
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getProductById = createAsyncThunk('products/getById', async (id, thunkAPI) => {
    try {
        return await productService.getProductById(id);
    } catch (error) {
        const message = 
        error.response?.data?.error ||
        (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        // Action để reset state khi cần, ví dụ khi rời khỏi trang chi tiết sản phẩm
        resetProduct: (state) => {
            state.product = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý fetchProducts
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                const { response, type } = action.payload;

                state[type] = response.data;

                if (type === 'products') {
                    state.pagination = response.pagination;
                }
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Xử lý getProductById
            .addCase(getProductById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.product = action.payload;
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { resetProduct } = productSlice.actions;
export default productSlice.reducer;