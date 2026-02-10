import { useState } from 'react';

// 步驟區
const STEP_CARDS = [
  {
    id: 1,
    step_title: '選擇基底',
    step_content: '白米、糙米、紫米、藜麥、生菜',
    img: `${import.meta.env.BASE_URL}img/items/step1.png`,
    icon: 'bi bi-1-circle-fill',
  },
  {
    id: 2,
    step_title: '挑選主食',
    step_content: '雞胸肉、牛肉、鮭魚、蝦仁，為你包山包海',
    img: `${import.meta.env.BASE_URL}img/items/step2.png`,
    icon: 'bi bi-2-circle-fill',
  },
  {
    id: 3,
    step_title: '搭配蔬果',
    step_content: '配角可以比主角搶戲，季節時蔬任選 5 種',
    img: `${import.meta.env.BASE_URL}img/items/step3.png`,
    icon: 'bi bi-3-circle-fill',
  },
  {
    id: 4,
    step_title: '淋上醬汁',
    step_content: '為你的餐盒來點靈魂',
    img: `${import.meta.env.BASE_URL}img/items/step4.png`,
    icon: 'bi bi-4-circle-fill',
  },
];

const StepCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className='step-card'>
      {STEP_CARDS.map((item, index) => (
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
