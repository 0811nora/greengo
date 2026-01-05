import { Outlet , NavLink } from 'react-router-dom';

export default function AdminPages() {
    return (
        <div>
            <div className="row">
                <div className="col-4">
                    <ul>
                        <li className="nav-item">
                            <NavLink className="nav-link" to='order'>訂單管理</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to='blog'>部落格管理</NavLink>
                        </li>
                    </ul>
                </div>
                <div className='col-8'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

