import { useState, useEffect } from 'react';
import { StepCards } from '../../data/homeData';

const StepCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayDuration = 3000; // 先用3秒

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % StepCards.length);
    }, autoPlayDuration);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleClick = (index) => {
    setActiveIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 6000);
  };

  return (
    <div className='step-card-wrapper'>
      <div
        className='step-card'
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {StepCards.map((item, index) => (
          <div
            key={item.id}
            className={`step ${index === activeIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${item.img})` }}
            onClick={() => handleClick(index)}
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
            {index === activeIndex && (
              <div
                className='progress-bar'
                style={{
                  animationDuration: `${autoPlayDuration}ms`,
                  animationPlayState: isPaused ? 'paused' : 'running',
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className='step-pagination'>
        {StepCards.map((_, index) => (
          <button
            key={index}
            className={`pagination ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default StepCard;
