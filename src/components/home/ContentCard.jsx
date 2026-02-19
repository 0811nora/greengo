import { NavLink } from 'react-router-dom';

const ContentCard = ({
  subTitle, // 英文標題
  title, // 中文標題
  description, // 內文
  buttonText, // 按鈕文字
  to, // link
}) => {
  return (
    <div className='content-card bg-white shadow'>
      <h4 className='text-gray-200 fs-6 fs-md-4 fw-semibold mb-2 mb-md-5'>
        {subTitle}
      </h4>
      <h2 className='fs-3 fs-md-1 fw-bold mb-2 mb-md-5'>{title}</h2>
      <p className='text-gray-300 mb-2 mb-md-5'>{description}</p>
      <NavLink
        to={to}
        className='home__btn-primary text-center fw-medium text-decoration-none mx-auto mx-lg-0'
      >
        {buttonText}
      </NavLink>
    </div>
  );
};

export default ContentCard;
