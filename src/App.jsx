import axios from 'axios';
// import { useEffect } from "react";
import { Outlet } from 'react-router-dom';
// import Navbar from './components/Navbar';
import Header from './layout/Header.jsx';
import Footer from './layout/Footer.jsx';
// import { CartProvider } from './context/CartContext.jsx';
import ScrollToTop from './components/home/ScrollToTop.jsx'; // 頁面切換時 自動回到頂端

// 處理 header 購物車
import { Provider } from 'react-redux';
import store from './store';

// 處理登入狀太
import useAuthInit from './hooks/useAuthInit.js';

const token = document.cookie
  .split('; ')
  .find((row) => row.startsWith('greenToken'))
  ?.split('=')[1];
if (token) {
  axios.defaults.headers.common['Authorization'] = token;
}

const AppContent = () => {
  useAuthInit();
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </>
  );
}

export default App;
