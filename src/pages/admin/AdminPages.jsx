import * as bootstrap from "bootstrap";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
let loginModal;
let logoutModal;

//登入做好以後刪除
import axios from "axios";
import { admSignin } from "../../api/ApiAdmin";

export default function AdminPages() {
  //登入做好以後刪除
  const [isAuth, setIsAuth] = useState(false);
  const userInfo = {
    username: "greengo@test.com",
    password: "12345678",
  };
  //登入做好以後刪除
  useEffect(() => {
    (async () => {
      const res = await admSignin(userInfo);
      axios.defaults.headers.common["Authorization"] = res.data.token;
      document.cookie = `greengoToken=${res.data.token};expires=${new Date(
        res.data.expired
      )};path=/;`;
      setIsAuth(true);
    })();
  }, []);

  // 管理員按鈕測試
  const [admMode, setAdmMode] = useState(false); // 管理員模式
  const [admPassword, setAdmPassword] = useState(""); // 管理員密碼
  const [pagePath, setpagePath] = useState(""); // navLink 指定的路由
  const loginModalRef = useRef(null);
  const logoutModalRef = useRef(null);
  const toggleBg = useRef(null);
  const toggleCircleL = useRef(null);
  const toggleCircleR = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!admMode) navigate("/admin/order");
    return;
  }, []);

  function handleNavMode(path) {
    if (!admMode) {
      openLoginModal();
      setpagePath(path);
    } else {
      navigate(path);
    }
  }
  function handleToggleMode(path) {
    if (!admMode) {
      openLoginModal();
      setpagePath(path);
    } else {
      openLogoutModal();
    }
  }
  function openLoginModal() {
    loginModal = new bootstrap.Modal(loginModalRef.current);
    loginModal.show();
  }
  function openLogoutModal() {
    logoutModal = new bootstrap.Modal(logoutModalRef.current);
    logoutModal.show();
  }
  function closeLoginModal() {
    document.activeElement?.blur();
    loginModal.hide();
  }
  function closeLogoutModal() {
    document.activeElement?.blur();
    logoutModal.hide();
    navigate("/admin/order");
  }
  function checkAdmPassword() {
    if (admPassword === "0000") {
      setAdmMode(true);
      closeLoginModal();
      navigate(pagePath);
      toggleBg.current.classList.add("mode__bg__show");
      toggleCircleL.current.classList.remove("mode__circle__show");
      toggleCircleR.current.classList.add("mode__circle__show");

      alert("登入成功");
    } else {
      alert("登入失敗");
    }
    setAdmPassword("");
  }
  function logoutMode() {
    setAdmMode(false);
    closeLogoutModal();
    toggleBg.current.classList.remove("mode__bg__show");
    toggleCircleL.current.classList.add("mode__circle__show");
    toggleCircleR.current.classList.remove("mode__circle__show");
    console.log("登出成功");
  }

  if (!isAuth) return;

  return (
    <main className="adm_bg adm-theme">
      <div className="container">
        <nav className=" navbar">
          <div className="container-fluid admNavbar adm__glassbg ">
            <span className="navbar-brand ft-en fw-semibold">
              <img
                src="../../public/circle.svg"
                alt="circle.svg"
                className="me-2"
              />
              GreenGo
            </span>
            <ul className="navbar-nav delete__navbar_nav__glassbg">
              <li className="nav-item">
                <NavLink className="nav-link adm__navbar" to="order">
                  訂單管理
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `d-flex aligns-item-center nav-link adm__navbar ${
                      admMode ? "" : "disable"
                    } ${isActive ? "active" : ""}`
                  }
                  to="stock"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavMode("/admin/stock");
                  }}
                >
                  商品管理
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `d-flex aligns-item-center nav-link adm__navbar ${
                      admMode ? "" : "disable"
                    } ${isActive ? "active" : ""}`
                  }
                  to="blog"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavMode("/admin/blog");
                  }}
                >
                  文章管理
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `d-flex aligns-item-center nav-link adm__navbar ${
                      admMode ? "" : "disable"
                    } ${isActive ? "active" : ""}`
                  }
                  to="report"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavMode("/admin/report");
                  }}
                >
                  報表統整
                </NavLink>
              </li>
            </ul>
            <div className="d-flex align-items-center gap-4">
              {/* 管理員模式-button */}
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="adm__mode__bg"
                  onClick={() => {
                    handleToggleMode("/admin/order");
                  }}
                  ref={toggleBg}
                >
                  <span
                    className="adm__mode__circle mode__circle__show"
                    ref={toggleCircleL}
                  ></span>
                  <span
                    className="adm__mode__circle"
                    ref={toggleCircleR}
                  ></span>
                </button>
                <label htmlFor="admModeToggle">管理員模式</label>
              </div>

              {/* 登入按鈕 */}
              <button
                type="button"
                className="btn adm__Button__primary adm__Button__nav"
              >
                登出
              </button>
            </div>
          </div>
        </nav>
        {/* 管理員模式login-modal */}
        <div className="modal fade" tabIndex="-1" ref={loginModalRef}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content adm__glassbg adm__modal__comfirm">
              <div className="modal-body adm__modal__body">
                <div>
                  <div className="d-flex justify-content-center">
                    <i className="modal-icon bi bi-lock-fill"></i>
                  </div>
                  <h1 className="modal-title fs-5">登入管理員模式</h1>
                  <p>
                    您未擁有此權限，請輸入管理員密碼 <br />
                    密碼提示：0000
                  </p>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="admPasswordInput"
                    placeholder="管理員密碼"
                    value={admPassword}
                    onChange={(e) => {
                      setAdmPassword(e.target.value);
                    }}
                  />
                  <label htmlFor="admPasswordInput" className="label_input">
                    管理員密碼
                  </label>
                </div>
                <div className="d-flex gap-3">
                  <button
                    type="button"
                    className="btn adm__Button__secondary adm__Button__md flex-fill"
                    onClick={closeLoginModal}
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    className="btn adm__Button__primary adm__Button__md flex-fill"
                    onClick={checkAdmPassword}
                  >
                    確定
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" tabIndex="-1" ref={logoutModalRef}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content adm__glassbg adm__modal__comfirm">
              <div className="modal-body adm__modal__body">
                <div>
                  <div className="d-flex justify-content-center">
                    <i className="modal-icon bi bi-unlock-fill"></i>
                  </div>
                  <h1 className="modal-title fs-5">登出管理員模式</h1>
                  <p>確認是否要登出「管理員模式」?</p>
                </div>

                <div className="d-flex gap-3">
                  <button
                    type="button"
                    className="btn adm__Button__secondary adm__Button__md flex-fill"
                    onClick={closeLogoutModal}
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    className="btn adm__Button__primary adm__Button__md flex-fill"
                    onClick={logoutMode}
                  >
                    確定
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
        {/* <div className="row">
          <div className="col-2">
            <ul>
              <li className="nav-item">
                <NavLink className="nav-link" to="order">
                  訂單管理
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="blog">
                  文章管理
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-10">
            <Outlet />
          </div>
        </div> */}
      </div>
    </main>
  );
}
