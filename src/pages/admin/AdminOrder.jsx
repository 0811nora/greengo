import axios from "axios";
import { useEffect } from "react";
import {
  Outlet,
  useNavigate,
  NavLink,
  useOutletContext,
} from "react-router-dom";

export default function AdminOrder() {
  const navigate = useNavigate();

  // 透過 hook 將 Outlet 的 props 傳入，再解構使用
  const { admMode, handleNavMode } = useOutletContext();

  // checkLogin
  useEffect(() => {
    const greenCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)greenToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    axios.defaults.headers.common["Authorization"] = greenCookie;
    const checkLogin = async () => {
      try {
        const res = await admUserCheck();
        console.log(res.data);
        navigate("/admin/order/today");
      } catch (error) {
        console.log(error.message);
        navigate("/admin/login");
      }
    };
    checkLogin();
  }, [navigate]);

  return (
    <main className="container-fluid px-0 order-page">
      <div className="order-navbar">
        <div className="d-flex align-items-center gap-2">
          <NavLink
            className={({ isActive }) =>
              `navbar-title ${isActive ? "active" : ""}`
            }
            to={"today"}
          >
            今日訂單
          </NavLink>
          <span>/</span>
          <NavLink
            className={({ isActive }) =>
              `navbar-title ${admMode ? "" : "disable"} ${isActive ? "active" : ""}`
            }
            to={admMode ? "history" : "#"}
            onClick={() => {
              handleNavMode("/admin/order/history");
            }}
          >
            歷史訂單
          </NavLink>
        </div>
      </div>
      <Outlet />
    </main>
  );
}
