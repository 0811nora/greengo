import * as bootstrap from "bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import AdminHeader from "../../layout/AdminHeader";
import { AdmModal_confirm, AdmModal_password } from "../../component/AdmModal";
import { ADM_MODE_LOGOUT } from "../../config/confirmModal";

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

  const [admMode, setAdmMode] = useState(false); // 管理員模式
  const [admPassword, setAdmPassword] = useState(""); // 管理員密碼
  const [pagePath, setpagePath] = useState(""); // navLink 指定的路由
  const loginModalRef = useRef(null);
  const logoutModalRef = useRef(null);
  const navigate = useNavigate();

  // 重新整理都指向訂單管理
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
  function cancelModal() {
    document.activeElement?.blur();
    logoutModal.hide();
  }
  function checkAdmPassword() {
    if (admPassword === "0000") {
      handlePasswordSuccess();
    } else {
      alert("登入失敗");
    }
    setAdmPassword("");
  }
  function handlePasswordSuccess() {
    setAdmMode(true);
    closeLoginModal();
    navigate(pagePath);
    alert("登入成功");
  }
  function logoutMode() {
    setAdmMode(false);
    closeLogoutModal();
    console.log("登出成功");
  }
  ////////////////
  // function toggleModal(path) {
  //   if (!admMode) {
  //     setIsShowLoginModal(true); // loginModal的class變成show
  //     setpagePath(path);
  //   } else {
  //     setIsShowLogoutModal(true);
  //   }
  // }
  // function admLogin() {
  //   if (admPassword === "0000") {
  //     setAdmMode(true);
  //     setIsShowLoginModal(false);
  //     navigate(pagePath);
  //     alert("登入成功");
  //   } else {
  //     alert("登入失敗");
  //   }
  //   setAdmPassword("");
  // }
  // function admLogout() {
  //   setAdmMode(false);
  //   setIsShowLogoutModal(false);
  //   console.log("登出成功");
  // }

  ////////////////

  if (!isAuth) return;

  return (
    <main className="adm_bg adm-theme">
      <div className="container">
        <AdminHeader
          admMode={admMode}
          handleToggleMode={handleToggleMode}
          handleNavMode={handleNavMode}
        />
        <AdmModal_password
          loginModalRef={loginModalRef}
          admPassword={admPassword}
          setAdmPassword={setAdmPassword}
          onCancelBtn={() => {
            closeLoginModal();
          }}
          onConfirmBtn={() => {
            checkAdmPassword();
          }}
        />
        <AdmModal_confirm
          logoutModalRef={logoutModalRef}
          onCancelBtn={() => {
            cancelModal();
          }}
          onConfirmBtn={() => {
            logoutMode();
          }}
          icon={ADM_MODE_LOGOUT.icon}
          title={ADM_MODE_LOGOUT.title}
          content={ADM_MODE_LOGOUT.content}
          confirmText={ADM_MODE_LOGOUT.confirmText}
          cancelText={ADM_MODE_LOGOUT.cancelText}
        />

        <Outlet />
      </div>
    </main>
  );
}
