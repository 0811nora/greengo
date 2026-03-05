import { Link } from 'react-router-dom';
import { PageLinks, TroubleCards } from '../../data/homeData';

const FeatureCard = ({
  to,
  imgSrc,
  bubbleClass,
  tagText,
  tagIcon,
  title,
  description,
  linkText,
}) => {
  return (
    <Link to={to} className='text-decoration-none d-block h-100'>
      <div className='home__nur-card py-5'>
        <div className='row align-items-center'>
          <div className='col-md-6 mb-5 mb-md-0 position-relative'>
            <div className={bubbleClass}>
              <img src={imgSrc} alt={title} className='position-absolute' />
            </div>
          </div>
          <div className='col-md-6 mb-5 mb-md-0'>
            <div className='badge tag-item p-2 mb-3'>
              {tagText} <i className={`bi ${tagIcon}`}></i>
            </div>
            <h2 className='fs-4 text-gray-600 my-4'>{title}</h2>
            <p className='text-gray-400 mb-4'>{description}</p>
            <button type='button' className='home__btn-link'>
              <span className='hover-underline'>{linkText}</span>
              <svg
                id='arrow-horizontal'
                xmlns='http://www.w3.org/2000/svg'
                width='30'
                height='8'
                viewBox='0 0 46 16'
                fill='currentColor'
              >
                <path
                  id='Path_10'
                  d='M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z'
                  transform='translate(30)'
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default FeatureCard;
