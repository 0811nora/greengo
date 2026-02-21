import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  // 購物車一開始是空的
  initialState: {
    cartData: { carts: [], total: 0, final_total: 0 },
    isLoading: false,
    isDropdownOpen: false,
    error: null,
    needsRefresh: false, // 處理商品加入購物車後要刷新渲染
  },
  reducers: {
    setCartData: (state, action) => {
      state.cartData = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    // 購物車 dropdown 狀態 （開/關/切換）
    openCart: (state) => {
      state.isDropdownOpen = true;
    },
    closeCart: (state) => {
      state.isDropdownOpen = false;
    },
    toggleCart: (state) => {
      state.isDropdownOpen = !state.isDropdownOpen;
    },
    // 商品加入後刷新渲染購物車
    renderRefresh: (state) => {
      state.needsRefresh = !state.needsRefresh;
    },
  },
});

export const {
  setCartData,
  setLoading,
  setError,
  openCart,
  closeCart,
  toggleCart,
  renderRefresh,
} = cartSlice.actions;

// 取得購物車商品
export const selectCartItems = (state) => state.cart.cartData.carts || [];
// badge 數量總計
export const selectTotalItems = (state) => {
  const carts = state.cart.cartData.carts || [];
  return carts.reduce((total, item) => total + item.qty, 0);
};
// 計算金額總計
export const selectTotalPrice = (state) => {
  const carts = state.cart.cartData.carts || [];
  return carts.reduce((acc, item) => {
    const price = item.customizations?.custom_total
      ? item.customizations.custom_total // 自由配
      : (item.final_total ?? 0); // 固定
    return acc + price * item.qty;
  }, 0);
};
// loading 狀態
export const selectIsLoading = (state) => state.cart.isLoading;
// dropdown 狀態
export const selectIsDropdownOpen = (state) => state.cart.isDropdownOpen;
// needsRefresh 狀態
export const selectNeedsRefresh = (state) => state.cart.needsRefresh;
export default cartSlice.reducer;
