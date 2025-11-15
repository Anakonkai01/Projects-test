// Nhan/frontend/src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import cartService from './cartService';

const updateLocalStorage = (cartItems) => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

// --- (Async Thunks: fetchUserCart, saveUserCart, clearCart giữ nguyên) ---

export const fetchUserCart = createAsyncThunk(
    'cart/fetchUserCart',
    async (_, thunkAPI) => {
        try {
            return await cartService.fetchCart();
        } catch (error) {
            return thunkAPI.rejectWithValue('Không thể tải giỏ hàng từ tài khoản.');
        }
    }
);

export const saveUserCart = createAsyncThunk(
    'cart/saveUserCart',
    async (cartItems, thunkAPI) => {
        try {
            return await cartService.saveCart(cartItems);
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi khi lưu giỏ hàng.');
        }
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, thunkAPI) => {
        try {
            await cartService.saveCart([]); 
            return;
        } catch (error) {
            return thunkAPI.rejectWithValue('Lỗi khi dọn dẹp giỏ hàng.');
        }
    }
);

// --- KẾT THÚC ASYNC THUNKS ---

// Helper: Lấy giỏ hàng từ local storage VÀ khởi tạo các key đã chọn
const getCartFromLocalStorage = () => {
    const cartItems = localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [];
    // Mặc định chọn tất cả
    const selectedItemKeys = cartItems.map(item => `${item._id}-${item.variant._id}`);
    return { cartItems, selectedItemKeys };
};

const localCart = getCartFromLocalStorage();

const initialState = {
    cartItems: localCart.cartItems,
    selectedItemKeys: localCart.selectedItemKeys, // <-- THÊM STATE MỚI
    totalQuantity: 0,
    totalAmount: 0,
    isLoading: false, 
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const itemKey = `${newItem._id}-${newItem.variant._id}`; // <-- Key
            const existingItem = state.cartItems.find(
                (item) => item._id === newItem._id && item.variant._id === newItem.variant._id
            );

            if (!existingItem) {
                state.cartItems.push({
                    ...newItem,
                    quantity: newItem.quantity,
                });
                toast.success(`"${newItem.name}" đã được thêm vào giỏ!`);
                state.selectedItemKeys.push(itemKey); // <-- Tự động chọn khi thêm
            } else {
                existingItem.quantity += newItem.quantity;
                toast.info(`Đã cập nhật số lượng cho "${newItem.name}".`);
                // Đảm bảo nó được chọn nếu đã tồn tại
                if (!state.selectedItemKeys.includes(itemKey)) {
                    state.selectedItemKeys.push(itemKey);
                }
            }
            updateLocalStorage(state.cartItems);
        },

        updateQuantity: (state, action) => {
            // ... (Giữ nguyên)
            const { id, variantId, quantity } = action.payload;
            const itemToUpdate = state.cartItems.find(
                (item) => item._id === id && item.variant._id === variantId
            );
            if (itemToUpdate) {
                itemToUpdate.quantity = quantity;
                updateLocalStorage(state.cartItems);
            }
        },

        removeFromCart: (state, action) => {
            const { id, variantId } = action.payload;
            const itemKey = `${id}-${variantId}`; // <-- Key
            const itemToRemove = state.cartItems.find(
                (item) => item._id === id && item.variant._id === variantId
            );

            state.cartItems = state.cartItems.filter(
                (item) => !(item._id === id && item.variant._id === variantId)
            );
            // Xóa khỏi danh sách chọn
            state.selectedItemKeys = state.selectedItemKeys.filter(key => key !== itemKey); 
            
            toast.error(`"${itemToRemove.name}" đã được xóa khỏi giỏ.`);
            updateLocalStorage(state.cartItems);
        },
        
        // THÊM: Action để Bật/Tắt một item
        toggleItemSelection: (state, action) => {
            const itemKey = action.payload; // key
            const index = state.selectedItemKeys.indexOf(itemKey);
            if (index > -1) {
                // Nếu đã có -> Xóa đi (bỏ chọn)
                state.selectedItemKeys.splice(index, 1);
            } else {
                // Nếu chưa có -> Thêm vào (chọn)
                state.selectedItemKeys.push(itemKey);
            }
        },

        // SỬA: getTotals để chỉ tính các mục được chọn
        getTotals: (state) => {
            // Lọc ra các item được chọn trước khi tính tổng
            const selectedItems = state.cartItems.filter(item => 
                state.selectedItemKeys.includes(`${item._id}-${item.variant._id}`)
            );

            const { total, quantity } = selectedItems.reduce( // Dùng selectedItems
                (cartTotal, cartItem) => {
                    const { price, quantity } = cartItem;
                    cartTotal.total += price * quantity;
                    cartTotal.quantity += quantity;
                    return cartTotal;
                },
                { total: 0, quantity: 0 }
            );
            state.totalQuantity = quantity;
            state.totalAmount = total;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload;
                // Mặc định chọn tất cả khi tải từ DB
                state.selectedItemKeys = state.cartItems.map(item => `${item._id}-${item.variant._id}`);
                updateLocalStorage(state.cartItems);
                toast.success("Đã đồng bộ giỏ hàng của bạn!");
            })
            .addCase(fetchUserCart.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload);
            })
            .addCase(clearCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.isLoading = false;
                state.cartItems = [];
                state.selectedItemKeys = []; // <-- Xóa key
                state.totalQuantity = 0;
                state.totalAmount = 0;
                localStorage.removeItem('cartItems');
            })
            // ... (Các case khác giữ nguyên)
            .addCase(clearCart.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload);
            })
            .addCase(saveUserCart.rejected, (state, action) => {
                toast.error(action.payload);
            });
    }
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotals,
    toggleItemSelection, // <-- Export action mới
} = cartSlice.actions;

export default cartSlice.reducer;