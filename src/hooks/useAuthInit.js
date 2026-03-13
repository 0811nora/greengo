// 判斷登入狀態
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/userSlice';
import { getUserProfile } from '../service/authService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // 去 firestore 撈完整資料 -> 再重新存到 redux 裡
        const result = await getUserProfile(firebaseUser.uid);
        if (result.success) {
          dispatch(
            login({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: result.data?.displayName ?? null,
              phone: result.data?.phone ?? null,
              photoURL: result.data?.photoURL ?? null,
            }),
          );
        }
      }
      // firebaseUser 是 null 的話：沒有登入，什麼都不做，redux 維持初始狀態
    });

    // cleanup
    return () => unsubscribe();
  }, [dispatch]); // dispatch 不會變 + 避免空著
};

export default useAuthInit;
