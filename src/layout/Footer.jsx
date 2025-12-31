import { NavLink } from "react-router-dom";


export default function Footer(){
    return (
        <footer className="bg-success text-center text-white">
            <div className="text-center p-3">
                <p>我是footer</p>
                <NavLink className="nav-link d-inline p-0" to='/'>回首頁連結</NavLink>
            </div>
        </footer>
    )
}