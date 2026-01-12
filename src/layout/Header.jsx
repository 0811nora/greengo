import { NavLink } from "react-router-dom";
// import React, { useState } from "react";

const NavbarData = {
  brand: {
    title: "GreenGo",
    url: "/",
  },
  mainLinks: [
    { title: "首頁", url: "/" },
    { title: "精選菜單", url: "/product" },
    { title: "自由搭配", url: "/custom" },
    { title: "關於綠果", url: "/about" },
    { title: "綠果專欄", url: "/article" },
  ],
};

export default function Header() {
  return (
    <>
      <header className="header">
        <nav className="navbar">
          <div className="container navbar-container">
            {/* Logo 區 */}
            <NavLink
              className="navbar-brand ft-en fw-semibold"
              to={NavbarData.brand.url}
            >
              {NavbarData.brand.title}
            </NavLink>

            {/* 主要導航列 */}
            {/* desktop */}
            <ul className="navbar-nav desktop-nav mb-2 mb-lg-0">
              {NavbarData.mainLinks.map((link) => (
                <li key={link.url}>
                  <NavLink
                    to={link.url}
                    className={({ isActive }) =>
                      `nav-mainLink ${isActive ? "active" : ""}`
                    }
                  >
                    <span className="link-text">{link.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* 購物車 + 登入區 */}
            <div className="d-flex align-items-center gap-3">
              <button
                type="button"
                className="btn btn-outline-gray-400 rounded-pill border-none"
              >
                <i class="bi bi-bag"></i>
              </button>
              <button className="btn btn-outline-primary-300 rounded-pill">
                登入 / 註冊
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
