import { Outlet, NavLink } from 'react-router-dom';

export default function AdminPages() {
    return (
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
    )
}

