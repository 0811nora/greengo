import { NavLink } from "react-router-dom";

export default function Product() {
    return (<>
        <div className="bg-primary text-white">這是菜單頁</div>
        <div>
            <NavLink className="nav-link text-info" to='/custom'>前往自由配的連結</NavLink>
        </div>
    </>
    )
}