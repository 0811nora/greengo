import axios from "axios";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
// import Navbar from './components/Navbar';
import Header from "./layout/Header.jsx";
import Footer from "./layout/Footer.jsx";

// 等token確認存到cookie後，請打開這邊的程式碼，將cookie名稱輸入上去
// const token = document.cookie.split("; ").find((row) => row.startsWith("{存cookie的名稱}"))?.split("=")[1];
// if (token) {axios.defaults.headers.common['Authorization'] = token}

function App() {
  // 這一段是為了確認，載入axios套件有成功，可以刪除
  useEffect(() => {
    async () => {
      const res = await axios.get("https://randomuser.me/api");
      console.log(res);
    };
  });

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


