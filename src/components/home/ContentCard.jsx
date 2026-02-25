import { NavLink } from 'react-router-dom';

const ContentCard = ({
  subTitle, // 英文標題
  title, // 中文標題
  description, // 內文
  buttonText, // 按鈕
  to, // link
  hasBorder = false, // 有無線框
  bgColor = 'white', // 背景色
  textPosition = 'text-center', // 文字位置
  contentPosition = 'align-items-center', // 內容位置
  contentPadding = 'py-5',
  children,
}) => {
  const bgColors = {
    white: 'bg-white',
    primary: 'bg-primary-100',
    transparent: 'bg-transparent',
  };
  const cardClass = `
    content-card 
    ${bgColors[bgColor] || bgColors.white} 
    ${hasBorder ? 'border border-gray-200 shadow' : ''}
    ${textPosition} 
    ${contentPosition}
    ${contentPadding}
  `.trim();

  return (
    <div className={cardClass}>
      {subTitle && (
        <h4 className='text-gray-200 fs-6 fs-md-4 fw-semibold mb-2 mb-md-5'>
          {subTitle}
        </h4>
      )}
      <h2 className='fs-3 fs-md-1 fw-bold mb-2 mb-md-5'>{title}</h2>
      {description && (
        <p className='text-gray-300 mb-2 mb-md-7'>{description}</p>
      )}
      {children && <div className='my-4 w-100'>{children}</div>}
      {buttonText && to && (
        <NavLink
          to={to}
          className='home__btn-primary fw-medium text-decoration-none d-inline-block mt-3'
        >
          {buttonText}
        </NavLink>
      )}
    </div>
  );
};
export default ContentCard;
