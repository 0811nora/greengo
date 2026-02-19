import { createSlice } from '@reduxjs/toolkit';
const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLogin: false,
    isModalOpen: false,
    isDropdownOpen: false,
  },
  reducers: {
    // 登入 -> 直接把 isLogin 設為 true
    login: (state) => {
      state.isLogin = true;
      state.isModalOpen = false; // 登入成功就關 modal
    },
    // 登出
    logout: (state) => {
      state.isLogin = false;
      state.isDropdownOpen = false;
    },
    // modal
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    // dropdown
    openUserDropdown: (state) => {
      state.isDropdownOpen = true;
    },
    closeUserDropdown: (state) => {
      state.isDropdownOpen = false;
    },
    toggleUserDropdown: (state) => {
      state.isDropdownOpen = !state.isDropdownOpen;
    },
  },
});

// 判斷是否已登入
export const selectIsLogin = (state) => state.user.isLogin;
// modal 狀態
export const selectIsModalOpen = (state) => state.user.isModalOpen;
// dropdown 狀態
export const selectIsUserDropdownOpen = (state) => state.user.isDropdownOpen;
export const {
  login,
  logout,
  openModal,
  closeModal,
  openUserDropdown,
  closeUserDropdown,
  toggleUserDropdown,
} = userSlice.actions;
export default userSlice.reducer;
