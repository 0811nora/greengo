// 先初始化 firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// firebase console 給的資料
const firebaseConfig = {
  apiKey: 'AIzaSyCjbOqakD2gXjACGi_O9n0LvXgnuvWOThM',
  authDomain: 'greengo-practice.firebaseapp.com',
  projectId: 'greengo-practice',
  storageBucket: 'greengo-practice.firebasestorage.app',
  appId: '1:834748771254:web:18d1d6b770a29931376f17',
  messagingSenderId: '834748771254',
  measurementId: 'G-TGXDEDXCKC', // 這是 google 分析用的，忘記取消分析了先留著
};

// 初始化 firebase app
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // 處理帳號密碼
export const db = getFirestore(app); // 處理其他資料
