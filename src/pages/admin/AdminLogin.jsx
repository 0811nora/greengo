export default function AdminLogin() {
    return (
        <>
            <main className="mainBody d-flex align-items-center justify-content-center">

                <div className="card maincard py-4">
                    <div class="card-body d-flex flex-column align-items-center">
                        <h5 class="card-title text-center mb-4">登入
                        </h5>



                        <div className="col-auto mb-3">
                            <label htmlFor="accountInput" className="form-label">帳號</label>
                            <input type="email" id="accountInput" className="form-control" placeholder="請輸入帳號" />

                        </div>



                        <div className="col-auto mb-3">
                            <label htmlFor="passwordInput" className="form-label mt-2">密碼</label>
                            <input type="password" id="passwordInput" className="form-control" placeholder="請輸入密碼" />
                        </div>

                        <a href="#" className="btn btn-primary mt-4 px-3 py-2">送出</a>

                    </div>

                </div>

            </main>

        </>
    )
}
