import { Outlet, NavLink } from "react-router-dom";

//登入做好以後刪除
import { useEffect, useState } from "react";
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
  const [isAdmMode, setIsAdmMode] = useState(false);
  const [admModePasseord, setAdmModePasseord] = useState(false);

  function AuthAdmPassword() {}

  if (!isAuth) return;

  return (
    <main className="adm_bg">
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
                <NavLink className="nav-link " aria-disabled="true" to="order">
                  訂單管理
                </NavLink>
              </li>
              <li className="nav-item">
                <a className="nav-link " aria-disabled="true" href="#">
                  商品管理
                </a>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link disable"
                  aria-disabled="true"
                  to="blog"
                >
                  文章管理
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link adm__navbar--disable d-flex aligns-item-center"
                  aria-disabled="true"
                  to="report"
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
                  data-bs-toggle="modal"
                  data-bs-target="#admModePasswordModal"
                >
                  <span className="adm__mode__circle adm__mode__show"></span>
                  <span className="adm__mode__circle"></span>
                </button>
                <p>管理員模式</p>
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
        {/* 管理員模式-modal */}
        <div
          className="modal fade"
          id="admModePasswordModal"
          tabIndex="-1"
          aria-labelledby="passwordModalTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content adm__glassbg adm__modal__comfirm">
              <div className="modal-body">
                <div className="d-flex justify-content-center">
                  <i class="modal-icon bi bi-lock-fill"></i>
                </div>
                <h1 className="modal-title fs-5" id="passwordModalTitle">
                  管理員模式
                </h1>
                <p>
                  您未擁有此權限，請輸入管理員密碼 <br />
                  密碼提示：0000
                </p>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="admPasswordInput"
                    placeholder="管理員密碼"
                  />
                  <label htmlFor="admPasswordInput" className="label_input">
                    管理員密碼
                  </label>
                </div>

                <div className="d-flex gap-3">
                  <button
                    type="button"
                    className="btn adm__Button__secondary adm__Button__md flex-fill"
                    data-bs-dismiss="modal"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    className="btn adm__Button__primary adm__Button__md flex-fill"
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
