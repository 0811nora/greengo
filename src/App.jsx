import axios from "axios";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
// import Navbar from './components/Navbar';
import Header from "./layout/Header.jsx";
import Footer from "./layout/Footer.jsx";

// 等token確認存到cookie後，請打開這邊的程式碼，將cookie名稱輸入上去
// const token = document.cookie.split("; ").find((row) => row.startsWith("greengoToken"))?.split("=")[1];
// if (token) {axios.defaults.headers.common['Authorization'] = token}

function App() {


  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;


