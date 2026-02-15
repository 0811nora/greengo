import { useState } from 'react';
import { StepCards } from '../../data/homeData';

const StepCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className='step-card'>
      {StepCards.map((item, index) => (
        <div
          key={item.id}
          className={`step ${index === activeIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${item.img})` }}
          onClick={() => setActiveIndex(index)}
        >
          <div className='shadow'></div>
          <div className='label'>
            <div className='icon'>
              <i className={item.icon}></i>
            </div>
            <div className='info'>
              <div className='fw-bold fs-6'>{item.step_title}</div>
              <div className='sub fs-sm'>{item.step_content}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepCard;
