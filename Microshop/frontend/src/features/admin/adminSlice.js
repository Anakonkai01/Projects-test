import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from './adminService';

const initialState = {
    users: [],
    isLoading: false,
    isError: false,
    message: '',
    pagination: {},
};

// Async Thunks
export const getUsers = createAsyncThunk('admin/getUsers', async (queryParams, thunkAPI) => {
    try {
        return await adminService.getUsers(queryParams);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});
export const updateUser = createAsyncThunk('admin/updateUser', async (data, thunkAPI) => {
    try {
        return await adminService.updateUser(data);
    } catch (error) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
    
});
export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, thunkAPI) => {
    try {
        return await adminService.deleteUser(id);
    } catch (error) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
    
});

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: { /* ... */ },
    extraReducers: (builder) => {
    builder
        // Get Users
        .addCase(getUsers.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            // Đảm bảo users luôn là array
            state.users = Array.isArray(action.payload.data) ? action.payload.data : [];
            state.pagination = action.payload.pagination || {}; // Lấy thông tin phân trang
        })
        .addCase(getUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        // Update User
        .addCase(updateUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.users = state.users.map(user =>
                user._id === action.payload._id ? action.payload : user
            );
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        // Delete User
        .addCase(deleteUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.users = state.users.filter(user => user._id !== action.payload);
        })
        .addCase(deleteUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });
}
});

export default adminSlice.reducer;