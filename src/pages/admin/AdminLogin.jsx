import axios from "axios";
import { useState } from "react";

export default function AdminLogin() {

    const url = "https://ec-course-api.hexschool.io/v2/";


    const [accountLogin, setAccountLogin] = useState("");
    const [passwordLogin, setPasswordLogin] = useState("");
    const [greenGoToken, setGreenGoToken] = useState("");

    const Login = async () => {
        try {
            const res = await axios.post(`${url}admin/signin`, {
                username: accountLogin,
                password: passwordLogin
            });
            // console.log(res);
            setGreenGoToken(res.data.token);
            document.cookie = `greenToken=${greenGoToken}; expires=${new Date(res.data.expired)};`;
        } catch (error) {

            console.error(error);

        }
    };

    const getAccount = (e) => {
        setAccountLogin(e.target.value)
    }

    const getPassword = (e) => {
        setPasswordLogin(e.target.value)
    }


    return (
        <>
            <main className="mainBody d-flex align-items-center justify-content-center">

                <div className="card maincard py-4">
                    <div className="card-body d-flex flex-column align-items-center">
                        <h5 className="card-title text-center mb-4">登入
                        </h5>

                        <div className="col-auto mb-3">
                            <label htmlFor="accountInput" className="form-label">帳號</label>
                            <input value={accountLogin}
                                onChange={getAccount} type="email" id="accountInput" className="input_login form-control px-4 py-2" placeholder="請輸入帳號" />

                        </div>

                        <div className="col-auto mb-3">
                            <label htmlFor="passwordInput" className="form-label mt-2">密碼</label>
                            <input value={passwordLogin}
                                onChange={getPassword} type="password" id="passwordInput" className="form-control input_login  px-4 py-2" placeholder="請輸入密碼" />
                        </div>
                        <button type="button" className="btn btn-primary mt-4 px-5 py-2 btn_login_color" onClick={Login}>送出</button>

                    </div>

                </div>

            </main>

        </>
    )
}
