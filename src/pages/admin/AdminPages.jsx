import * as bootstrap from "bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import AdminHeader from "../../layout/AdminHeader";
import { AdmModal_confirm, AdmModal_password } from "../../component/AdmModal";
import { ADM_MODE_LOGOUT } from "../../config/confirmModal";

let loginModal;
let logoutModal;

export default function AdminPages() {
  const [admMode, setAdmMode] = useState(false); // 管理員模式
  const [admPassword, setAdmPassword] = useState(""); // 管理員密碼
  const [pagePath, setpagePath] = useState(""); // navLink 指定的路由
  const loginModalRef = useRef(null);
  const logoutModalRef = useRef(null);
  const navigate = useNavigate();

  // 把管理員模式設定傳到order頁
  const contextValue = { admMode, handleNavMode };

  useEffect(() => {
    const greenCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)greenToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    //戳check API
    if (!greenCookie) {
      navigate("/admin/login");
    }
  }, [navigate]);

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

  return (
    <main className="adm-theme adm__bg-gray ">
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

        {/* 把管理員模式設定傳到order頁 */}
        <Outlet context={contextValue} />
      </div>
    </main>
  );
}
