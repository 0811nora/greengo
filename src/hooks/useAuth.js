import { useSelector, useDispatch } from 'react-redux';
import {
  selectUser,
  selectIsLogin,
  logout,
  openModal,
} from '../store/slices/userSlice';
import { logoutUser } from '../service/authService';

const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLogin = useSelector(selectIsLogin);

  // 登出
  const handleLogout = async () => {
    const result = await logoutUser();
    console.log('登出結果：', result);
    if (result.success) {
      dispatch(logout());
    }
  };

  // { uid, email, displayName, phone, photoURL }
  return {
    // 確認狀態
    isLogin,

    // user 資料
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    phone: user.phone,
    photoURL: user.photoURL,

    // 登出、modal
    logout: handleLogout,
    openLoginModal: () => dispatch(openModal()),
  };
};
export default useAuth;
