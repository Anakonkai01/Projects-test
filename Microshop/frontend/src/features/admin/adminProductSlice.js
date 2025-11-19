import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminProductService from './adminProductService';

const initialState = {
    products: [],
    product: null,
    isLoading: false,
    isError: false,
    message: '',
    categories: [],
    pagination: {},
};

// Async Thunks
export const getAdminProducts = createAsyncThunk('adminProducts/getAll', async (queryParams, thunkAPI) => {
    try {
        // Truyền queryParams vào service
        return await adminProductService.getProducts(queryParams);
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteAdminProduct = createAsyncThunk('adminProducts/delete', async (id, thunkAPI) => {
    try {
        return await adminProductService.deleteProduct(id);
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getAdminProductById = createAsyncThunk('adminProducts/getById', async (id, thunkAPI) => {
    try {
        return await adminProductService.getProductById(id);
    } catch (error) {
        const message = error.response?.data?.error || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// **MỚI: Tạo sản phẩm**
export const createAdminProduct = createAsyncThunk('adminProducts/create', async (productData, thunkAPI) => {
    try {
        return await adminProductService.createProduct(productData);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// **MỚI: Cập nhật sản phẩm**
export const updateAdminProduct = createAsyncThunk('adminProducts/update', async ({ id, productData }, thunkAPI) => {
    try {
        return await adminProductService.updateProduct({ id, productData });
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});


export const adminProductSlice = createSlice({
    name: 'adminProducts',
    initialState,
    reducers: {
        reset: (state) => initialState,
        resetProduct: (state) => { // <-- THÊM: để xóa dữ liệu form khi cần
            state.product = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Products
            .addCase(getAdminProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAdminProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload.data; // <-- Cập nhật
                state.pagination = action.payload.pagination; // <-- Cập nhật
            })
            .addCase(getAdminProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete Product
            .addCase(deleteAdminProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteAdminProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = state.products.filter(p => p._id !== action.payload);
            })
            .addCase(deleteAdminProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAdminProductById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAdminProductById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.product = action.payload;
            })
            .addCase(getAdminProductById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createAdminProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createAdminProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products.push(action.payload); // Thêm sản phẩm mới vào danh sách
            })
            .addCase(createAdminProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateAdminProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateAdminProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                // Cập nhật sản phẩm trong danh sách
                const index = state.products.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateAdminProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
            
    }
});

export const { reset, resetProduct } = adminProductSlice.actions;
export default adminProductSlice.reducer;