import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  // logout,
  openModal,
  closeModal,
  openUserDropdown,
  closeUserDropdown,
  toggleUserDropdown,
  selectIsLogin,
  selectIsUserDropdownOpen,
} from '../../store/slices/userSlice';

import useAuth from '../../hooks/useAuth';

const UserDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const isLogin = useSelector(selectIsLogin);
  const isOpen = useSelector(selectIsUserDropdownOpen);

  const closeTimer = useRef(null);
  const { displayName, photoURL } = useAuth();

  // 點擊外部關閉
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        dispatch(closeUserDropdown());
      }
    };
    if (isOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, dispatch]);

  // hover 控制
  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    dispatch(openUserDropdown());
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      dispatch(closeUserDropdown());
    }, 500);
  };

  // timer cleanup
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // 登出
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // 未登入
  if (!isLogin) {
    return (
      <button
        type='button'
        className='btn btn-outline-primary-300 rounded-pill w-100'
        onClick={() => dispatch(openModal())}
      >
        登入 / 註冊
      </button>
    );
  }

  // 已登入
  return (
    <>
      <div
        className='position-relative d-none d-lg-block'
        ref={dropdownRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          type='button'
          className=' p-0 text-decoration-none header__defaultBtn'
          onClick={() => dispatch(toggleUserDropdown())}
          aria-label='展開選單'
        >
          <img
            className='rounded-5'
            width={'32px'}
            height={'32px'}
            src={
              photoURL
                ? photoURL
                : `${import.meta.env.BASE_URL}img/items/profilePic.webp`
            }
            alt='會員頭貼'
          />
        </button>
        {/*  桌機版 dropdown */}
        {isOpen && (
          <div
            className='header__dropdown position-absolute end-0 rounded-3 shadow d-none d-lg-flex flex-column'
            style={{
              marginTop: '8px',
              width: '200px',
              zIndex: 1050,
            }}
          >
            <div className=' d-flex flex-column justify-content-start align-items-center py-2 px-3'>
              <p className='text-brown-300 text-start w-100 px-2 py-1'>
                <span className='fw-semibold'>{displayName}</span>，歡迎回來！
              </p>
              <button
                type='button'
                className='header__userDropdown-btn'
                onMouseDown={(e) => {
                  e.stopPropagation(); // 阻止冒泡事件
                  navigate('/member');
                  dispatch(closeUserDropdown());
                }}
              >
                <img
                  className='rounded-5 me-1'
                  width={'28px'}
                  height={'28px'}
                  src={
                    photoURL
                      ? photoURL
                      : `${import.meta.env.BASE_URL}img/items/profilePic.webp`
                  }
                  alt=''
                />
                會員中心
              </button>
              <button
                type='button'
                className='header__userDropdown-btn text-error'
                onMouseDown={(e) => {
                  e.stopPropagation(); // 阻止冒泡事件
                  handleLogout();
                }}
              >
                <i
                  className='bi bi-box-arrow-right mx-2'
                  aria-hidden='true'
                ></i>
                登出
              </button>
            </div>
          </div>
        )}
      </div>
      {/* 手機版 dropdown */}
      <p className='text-brown-300 text-start w-100 px-2 py-1 d-lg-none'>
        <span className='fw-semibold'>{displayName}</span>，歡迎回來！
      </p>
      <button
        type='button'
        className='header__userDropdown-btn d-lg-none'
        onClick={() => {
          navigate('/member');
          dispatch(closeUserDropdown());
          dispatch(closeModal());
        }}
      >
        <img
          className='rounded-5 me-1'
          width={'28px'}
          height={'28px'}
          src={
            photoURL
              ? photoURL
              : `${import.meta.env.BASE_URL}img/items/profilePic.webp`
          }
          alt=''
        />
        <span className='ms-1 text-gray-400'>會員中心</span>
      </button>
    </>
  );
};
export default UserDropdown;
