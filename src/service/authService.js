// 處理 firebase
// 挖寶區 https://firebase.google.com/docs/reference/js/auth.md#auth_package
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

// 挖寶區 https://firebase.google.com/docs/reference/js/firestore.md#firestore_package
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

// 把 firebase 跳的錯誤通知轉成中文
const getErrorMessage = (code) => {
  const messages = {
    'auth/email-already-in-use': '此電子信箱已被註冊',
    'auth/invalid-email': '電子信箱格式不正確',
    'auth/weak-password': '密碼請至少使用 8 個字',
    'auth/user-not-found': '查無此帳號，請確認電子信箱是否正確',
    'auth/wrong-password': '密碼錯誤',
    'auth/invalid-credential': '帳號或密碼錯誤',
    'auth/too-many-requests': '失敗次數過多，請稍後再試',
  };
  // 如果 code 不在上面的清單裡，就統一回傳
  return messages[code] || '發生錯誤，請稍後再試';
};

// 登入
export const loginUser = async ({ email, password }) => {
  try {
    // firebase auth 驗證帳號密碼
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    // 用 uid 去 firestore 撈其他資料（名字、電話等）
    const profileResult = await getUserProfile(user.uid);
    // 把 user + firestore 的資料一起回傳
    return {
      success: true,
      data: {
        user,
        profile: profileResult.success ? profileResult.data : null,
      },
    };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
};

//  註冊
export const registerUser = async ({ email, password, displayName, phone }) => {
  // 處理 error code
  try {
    // 建立帳號
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user; // user 物件包含 { uid, email, ... }，uid 由 firebase 提供

    // 建立 user 資料
    // doc(db, 'users', user.uid) → 指向 users/uid 這個位置（還沒寫入）
    // setDoc → 把資料寫進去
    await setDoc(doc(db, 'users', user.uid), {
      displayName,
      phone,
      email,
      photoURL: null,
      createdAt: serverTimestamp(), // 用 firebase 提供的時間
    });
    // 回傳 firebase 的 user 物件（裡面有 uid、email）
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
};

// 登出
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
};

// 撈 firestore 的 user 資料
export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    }
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
};

// 更新 user 資料
export const updateUserProfile = async (uid, data) => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...data, // 包含傳進來的資料
      updatedAt: serverTimestamp(), // 順便記錄更新時間
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
};
