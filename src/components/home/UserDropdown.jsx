import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  logout,
  openModal,
  openUserDropdown,
  closeUserDropdown,
  toggleUserDropdown,
  selectIsLogin,
  selectIsUserDropdownOpen,
} from '../../store/slices/userSlice';

const UserDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const isLogin = useSelector(selectIsLogin);
  const isOpen = useSelector(selectIsUserDropdownOpen);

  const closeTimer = useRef(null);

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

  // Hover 控制
  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    dispatch(openUserDropdown());
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      dispatch(closeUserDropdown());
    }, 300);
  };

  // Timer cleanup
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // 登出
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // 未登入
  if (!isLogin) {
    return (
      <button
        className='btn btn-outline-primary-300 rounded-pill'
        onClick={() => dispatch(openModal())}
      >
        登入 / 註冊
      </button>
    );
  }

  // 已登入
  return (
    <div
      className='position-relative'
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type='button'
        className=' p-0 text-decoration-none header__defaultBtn'
        onClick={() => dispatch(toggleUserDropdown())}
      >
        <i className='bi bi-person-circle fs-4'></i>
      </button>

      {/* dropdown */}
      {isOpen && (
        <div
          className='header__dropdown position-absolute end-0 mt-2 rounded-3 shadow d-none d-lg-flex flex-column'
          style={{
            marginTop: '8px',
            width: '150px',
            zIndex: 1050,
          }}
        >
          <button
            type='button'
            className='btn btn-link w-100 text-start text-decoration-none text-gray-600 px-3 py-2'
            onMouseDown={(e) => {
              e.stopPropagation(); // 阻止冒泡事件
              navigate('/member');
              dispatch(closeUserDropdown());
            }}
          >
            <i className='bi bi-person me-2'></i>
            會員中心
          </button>
          <button
            type='button'
            className='btn btn-link w-100 text-start text-decoration-none text-error px-3 py-2'
            onMouseDown={(e) => {
              e.stopPropagation(); // 阻止冒泡事件
              handleLogout();
            }}
          >
            <i className='bi bi-box-arrow-right me-2'></i>
            登出
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
