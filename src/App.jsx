import axios from "axios";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
// import Navbar from './components/Navbar';
import Header from "./layout/Header.jsx";
import Footer from "./layout/Footer.jsx";


const token = document.cookie.split("; ").find((row) => row.startsWith("greenToken"))?.split("=")[1];
if (token) {axios.defaults.headers.common['Authorization'] = token}

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


