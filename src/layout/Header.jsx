import { NavLink } from "react-router-dom";

export default function Header(){
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <NavLink className="nav-link" to='/'>GreenGo</NavLink>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to='/product'>菜單頁</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to='/about'>關於我們頁</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}