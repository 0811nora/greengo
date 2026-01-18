import axios from 'axios';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';


//登入做好以後刪除
import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { admSignin } from "../../api/ApiAdmin";



export default function AdminPages() {

    const navigate = useNavigate();

    //芋頭修改
    useEffect(() => {
        const greenCookie = document.cookie.replace(
            /(?:(?:^|.*;\s*)greenToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1",
        );
        //戳check API
        if (!greenCookie) {
            navigate('/admin/login');
        }

    }, [navigate]);

    //芋頭修改結束

    // //登入做好以後刪除
    // const [isAuth, setIsAuth] = useState(false);
    // const userInfo = {
    //     username: "greengo@test.com",
    //     password: "12345678"
    // }
    // //登入做好以後刪除
    // useEffect( () => {
    //     (async()=>{
    //         const res = await admSignin(userInfo);
    //         axios.defaults.headers.common['Authorization'] = res.data.token;
    //         document.cookie = `greengoToken=${res.data.token};expires=${new Date(res.data.expired)};path=/;`;
    //         setIsAuth(true);
    //     })()
    // },[])

    // if (!isAuth) return ;


    return (
        <main className='adm_bg'>
            <div className='container'>
                <div className="row">
                    <div className="col-2">
                        <ul>
                            <li className="nav-item">
                                <NavLink className="nav-link" to='order'>訂單管理</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to='blog'>文章管理</NavLink>
                            </li>

                        </ul>
                    </div>
                    <div className='col-10'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </main>
    )
};
