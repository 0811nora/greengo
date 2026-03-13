import { createSlice } from '@reduxjs/toolkit';
const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLogin: false,
    isModalOpen: false,
    isDropdownOpen: false,

    // 會員資料
    uid: null,
    email: null,
    displayName: null,
    phone: null,
    photoURL: null,
    address: null,
  },
  reducers: {
    // 登入 -> 直接把 isLogin 設為 true
    login: (state, action) => {
      state.isLogin = true;
      state.isModalOpen = false; // 登入成功就關 modal
      // action.payload 就是 { uid...那串 }
      if (action.payload) {
        state.uid = action.payload.uid;
        state.email = action.payload.email;
        state.displayName = action.payload.displayName;
        state.phone = action.payload.phone;
        state.photoURL = action.payload.photoURL ?? null;
      }
    },
    // 登出
    logout: (state) => {
      state.isLogin = false;
      state.isDropdownOpen = false;
      // logout 就清除會員資料
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.phone = null;
      state.photoURL = null;
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
    // 更新會員資料
    updateUser: (state, action) => {
      // action.payload 是 { displayName, phone, address }
      if (action.payload.displayName !== undefined) {
        state.displayName = action.payload.displayName;
      }
      if (action.payload.phone !== undefined) {
        state.phone = action.payload.phone;
      }
      if (action.payload.address !== undefined) {
        state.address = action.payload.address;
      }
    },
  },
});

// 判斷是否已登入
export const selectIsLogin = (state) => state.user.isLogin;
// modal 狀態
export const selectIsModalOpen = (state) => state.user.isModalOpen;
// dropdown 狀態
export const selectIsUserDropdownOpen = (state) => state.user.isDropdownOpen;
// 抓取會員資料
export const selectUser = (state) => state.user;

export const {
  login,
  logout,
  openModal,
  closeModal,
  openUserDropdown,
  closeUserDropdown,
  toggleUserDropdown,
  updateUser,
} = userSlice.actions;
export default userSlice.reducer;
