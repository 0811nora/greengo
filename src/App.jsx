import axios from 'axios';
// import { useEffect } from "react";
import { Outlet } from 'react-router-dom';
// import Navbar from './components/Navbar';
import Header from './layout/Header.jsx';
import Footer from './layout/Footer.jsx';
import { CartProvider } from './context/CartContext.jsx';
// 頁面切換時 自動回到頂端
import ScrollToTop from './components/home/ScrollToTop.jsx';

const token = document.cookie
  .split('; ')
  .find((row) => row.startsWith('greenToken'))
  ?.split('=')[1];
if (token) {
  axios.defaults.headers.common['Authorization'] = token;
}

function App() {
  return (
    <>
      <CartProvider>
        <ScrollToTop />
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </CartProvider>
    </>
  );
}

export default App;
