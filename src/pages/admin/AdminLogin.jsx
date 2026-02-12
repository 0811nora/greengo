import axios from 'axios';
import { notify } from '../../components/Notify';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { admSignin, admUserCheck } from '../../api/ApiAdmin';

export default function AdminLogin() {
  const [accountLogin, setAccountLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  // const [greenGoToken, setGreenGoToken] = useState("");
  const navigate = useNavigate();

  const Login = async () => {
    const userInfo = {
      username: accountLogin,
      password: passwordLogin,
    };
    try {
      const res = await admSignin(userInfo);
      // console.log(res);
      // setGreenGoToken(res.data.token);
      const { token, expired } = res.data;

      document.cookie = `greenToken=${token}; expires=${new Date(expired)}; path=/`;
      axios.defaults.headers.common['Authorization'] = token;
      notify('success', '登入成功');
      navigate('/admin/order');
    } catch (error) {
      console.error(error);
      notify('error', '登入失敗');

      //alert(`登入失敗：${error.message}`);
    }
  };

  // mini改的地方：----------------->
  // login不驗證token是否可用，只判斷有沒有token，所以把驗證的程式碼註解，
  // 將有token後的路由改成'/admin/order/today'
  useEffect(() => {
    const greenCookie = document.cookie.replace(/(?:(?:^|.*;\s*)greenToken\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    if (greenCookie) {
      navigate('/admin/order/today');
    }
  }, [navigate]);

  // useEffect(() => {
  //   const greenCookie = document.cookie.replace(
  //     /(?:(?:^|.*;\s*)greenToken\s*\=\s*([^;]*).*$)|^.*$/,
  //     "$1",
  //   );
  //   axios.defaults.headers.common["Authorization"] = greenCookie;
  //   const checkLogin = async () => {
  //     try {
  //       const res = await admUserCheck();
  //       console.log(res.data);
  //       navigate("/admin/order/today");
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };
  //   if (greenCookie) {
  //     checkLogin();
  //   }
  // }, [navigate]);

  //--------------------------------------->

  const getAccount = e => {
    setAccountLogin(e.target.value);
  };

  const getPassword = e => {
    setPasswordLogin(e.target.value);
  };

  return (
    <>
      <main className="mainBody d-flex align-items-center justify-content-center">
        <div className="card maincard py-4">
          <div className="card-body d-flex flex-column align-items-center">
            <h5 className="card-title text-center mb-4">登入</h5>

            <div className="col-auto mb-3">
              <label htmlFor="accountInput" className="form-label">
                帳號
              </label>
              <input
                value={accountLogin}
                onChange={getAccount}
                type="email"
                id="accountInput"
                className="input_login form-control px-4 py-2"
                placeholder="請輸入帳號"
              />
            </div>

            <div className="col-auto mb-3">
              <label htmlFor="passwordInput" className="form-label mt-2">
                密碼
              </label>
              <input
                value={passwordLogin}
                onChange={getPassword}
                type="password"
                id="passwordInput"
                className="form-control input_login  px-4 py-2"
                placeholder="請輸入密碼"
              />
            </div>
            <button type="button" className="btn btn-primary mt-4 px-5 py-2 btn_login_color" onClick={Login}>
              送出
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
