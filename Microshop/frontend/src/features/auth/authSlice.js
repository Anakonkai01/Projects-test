import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { fetchUserCart } from '../cart/cartSlice';
// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        // 1. Đăng nhập để lấy thông tin user
        const userData = await authService.login(user);

        // 2. Ngay sau khi đăng nhập, gọi action để lấy giỏ hàng
        // Chỉ gọi nếu đăng nhập thành công
        if (userData) {
            thunkAPI.dispatch(fetchUserCart(userData.role));
        }

        // 3. Trả về thông tin user
        return userData;
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout();
});

// Get user info
export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
    try {
        return await authService.getMe();
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update user details
export const updateDetails = createAsyncThunk('auth/updateDetails', async (userData, thunkAPI) => {
    try {
        return await authService.updateDetails(userData);
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update password
export const updatePassword = createAsyncThunk('auth/updatePassword', async (passwordData, thunkAPI) => {
    try {
        return await authService.updatePassword(passwordData);
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, thunkAPI) => {
        try {
            return await authService.forgotPassword(email);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (data, thunkAPI) => {
        try {
            return await authService.resetPassword(data);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const addAddress = createAsyncThunk('auth/addAddress', async (addressData, thunkAPI) => {
    try {
        return await authService.addAddress(addressData);
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const updateAddress = createAsyncThunk('auth/updateAddress', async (data, thunkAPI) => {
    try {
        return await authService.updateAddress(data);
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }

});
export const deleteAddress = createAsyncThunk('auth/deleteAddress', async (addressId, thunkAPI) => {
    try {
        return await authService.deleteAddress(addressId);
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }

});

export const authSlice = createSlice({
    name: 'auth',
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
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.user = { ...state.user, ...action.payload };
            })
            .addCase(updateDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = { ...state.user, ...action.payload };
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;

            })
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(addAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const updatedUser = { ...state.user, ...action.payload };
                state.user = updatedUser;
                localStorage.setItem('user', JSON.stringify(updatedUser));
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update Address
            .addCase(updateAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const updatedUser = { ...state.user, ...action.payload };
                state.user = updatedUser;
                localStorage.setItem('user', JSON.stringify(updatedUser));
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete Address
            .addCase(deleteAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const updatedUser = { ...state.user, ...action.payload };
                state.user = updatedUser;
                localStorage.setItem('user', JSON.stringify(updatedUser));
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            ;
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer; 