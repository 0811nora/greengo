
import { Outlet, NavLink } from 'react-router-dom';


//登入做好以後刪除
import { useEffect } from 'react';
import axios from 'axios';
import { admSignin } from "../../api/ApiAdmin";



export default function AdminPages() {
    
    //登入做好以後刪除
    const userInfo = {
        username: "greengo@test.com",
        password: "12345678"
    }
    //登入做好以後刪除
    useEffect( () => {
        (async()=>{
            const res = await admSignin(userInfo);
            axios.defaults.headers.common['Authorization'] = res.data.token;
            document.cookie = `greengoToken=${res.data.token};expires=${new Date(res.data.expired)};path=/;"`;
        })()
    },[])

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
