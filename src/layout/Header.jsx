import { NavLink, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// header cart + login
import CartDropdown from '../components/home/CartDropdown';
import LoginModal from '../components/home/LoginModal';
import UserDropdown from '../components/home/UserDropdown';
import { logout, selectIsLogin } from '../store/slices/userSlice';

const NavbarData = {
  brand: {
    title: 'GreenGo',
    url: '/',
  },
  mainLinks: [
    { title: '首頁', url: '/' },
    { title: '精選菜單', url: '/product' },
    { title: '自由搭配', url: '/custom' },
    { title: '關於綠果', url: '/about' },
    { title: '綠果專欄', url: '/article' },
  ],
  mobileLinks: { title: '購物車', url: '/cart' },
};

export default function Header() {
  // mobile menu setting
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = useSelector(selectIsLogin);

  // 點外面就關閉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className='front__header' ref={headerRef}>
        <nav className='navbar'>
          <div className='container'>
            {/* desktop */}
            <div className='header__container d-none d-lg-flex'>
              <NavLink
                className='header__brand ft-en fw-semibold text-decoration-none'
                to={NavbarData.brand.url}
              >
                {NavbarData.brand.title}
              </NavLink>
              <ul className='navbar-nav mb-0'>
                {NavbarData.mainLinks.map((link) => (
                  <li key={link.url}>
                    <NavLink
                      to={link.url}
                      className={({ isActive }) =>
                        `header__link ${isActive ? 'header__link--active' : ''}`
                      }
                    >
                      <span className='header__link-text'>{link.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>

              {/* cart + login */}
              <div
                className='d-flex justify-content-end align-items-center gap-5'
                style={{ width: '180px' }}
              >
                <CartDropdown />
                <UserDropdown />
              </div>
            </div>

            {/* mobile */}
            <div className='d-lg-none w-100'>
              <div
                className={`mobile-container ${
                  isMobileMenuOpen ? 'mobile-container--open' : ''
                }`}
              >
                <div className='mobile-container__header'>
                  <NavLink
                    className='header__brand ft-en fw-semibold text-decoration-none'
                    to={NavbarData.brand.url}
                    onClick={closeMenu}
                  >
                    {NavbarData.brand.title}
                  </NavLink>

                  <div className='d-flex align-items-center gap-2'>
                    <Link
                      className='btn btn-outline-gray-400 rounded-pill border-none'
                      to={NavbarData.mobileLinks.url}
                    >
                      <i className='bi bi-cart'></i>
                    </Link>
                    <button
                      type='button'
                      className='btn btn-outline-gray-400 rounded-pill border-none'
                      onClick={toggleMenu}
                    >
                      <i
                        className={`bi ${
                          isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>

                {/* dropdown*/}
                <div
                  className={`mobile-container__dropdown ${
                    isMobileMenuOpen ? 'mobile-container__dropdown--open' : ''
                  }`}
                >
                  <nav className='mobile-container__nav '>
                    {NavbarData.mainLinks.map((link) => (
                      <NavLink
                        key={link.url}
                        to={link.url}
                        className={({ isActive }) =>
                          `mobile-container__link ${
                            isActive ? 'mobile-container__link--active ' : ''
                          }`
                        }
                        onClick={closeMenu}
                      >
                        {link.title}
                      </NavLink>
                    ))}
                  </nav>

                  <div className='mobile-container__footer'>
                    <UserDropdown />
                    {isLogin && (
                      <button
                        className='btn btn-outline-danger w-100 rounded-pill mt-3'
                        onClick={() => {
                          dispatch(logout());
                          closeMenu();
                          navigate('/');
                        }}
                      >
                        <i className='bi bi-box-arrow-right me-2'></i>
                        登出
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* mobile 版開啟 dropdown 的遮罩 */}
      {/* 點背景就關閉選單 */}
      <div
        className={`mobile-overlay ${
          isMobileMenuOpen ? 'mobile-overlay--active' : ''
        }`}
        onClick={closeMenu}
      ></div>
      <LoginModal />
    </>
  );
}
