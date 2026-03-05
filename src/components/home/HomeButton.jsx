import { NavLink } from 'react-router-dom';

const HomeButton = ({
  to, // router
  isNavLink = false, // 判斷是不是 NavLink
  type = 'primary', // 有無背景
  className = '', // 其他樣式
  children, // 文字內容
  ...rest // 接收其他內容，例如 onClick, type="submit"...
}) => {
  const baseStyle = type === 'primary' ? 'home__btn-primary' : 'home__btn-link';
  const combinedStyle = `${baseStyle} ${className}`.trim();

  // NavLink 款 + active
  if (to) {
    if (isNavLink) {
      return (
        <NavLink
          to={to}
          className={({ isActive }) =>
            isActive ? `${combinedStyle} active` : combinedStyle
          }
          {...rest}
        >
          {children}
        </NavLink>
      );
    }
    // Link 款
    return (
      <Link to={to} className={combinedStyle} {...rest}>
        {children}
      </Link>
    );
  }
  // 基本款
  return (
    <button className={combinedStyle} {...rest}>
      {children}
    </button>
  );
};
export default HomeButton;
