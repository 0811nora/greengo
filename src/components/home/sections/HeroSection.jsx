import { NavLink } from 'react-router-dom';
import { PageLinks, HeroDecors, VeggieItems } from '../../../data/homeData';
import FadeIn from '../FadeIn';

const HeroSection = () => {
  return (
    <>
      {/* Hero Section */}
      <section className='container-fluid position-relative overflow-hidden bg-primary-100 px-0'>
        {/* 文字區 */}
        <div className='home__hero-section py-8 py-md-10 my-md-10 text-center'>
          <h1 className='fs-2 display-md-1 fw-bold text-center mb-7'>
            生活<span className='comma'>，</span>
            <br />從<span className='text-primary'>好好吃飯</span>
            開始
          </h1>
          <p className='mb-2'>Elevate Your Day, Nourish Your Body.</p>
          <p className='mb-3 mb-md-5'>綠果相信，每一次的選擇都值得被用心對待</p>
          <NavLink
            to={PageLinks.productLink.url}
            className='home__btn-primary mt-5 mt-md-0 fw-medium'
          >
            立即點餐
          </NavLink>
        </div>

        {/* 裝飾區 */}
        {/* 左右圖 */}
        {HeroDecors.map((decor) => (
          <div
            key={decor.id}
            className={`position-absolute ${decor.posY} ${decor.posX} translate-middle`}
          >
            <img className='hero__decor' src={decor.src} alt={decor.alt} />
            <div className='bowl-shadow'></div>
          </div>
        ))}
        {/* 中央碗 */}
        <div className='hero__decorations position-absolute top-100 start-50 translate-middle pt-10'>
          <img
            src={`${import.meta.env.BASE_URL}img/items/bowl-3.png`}
            className='position-relative'
            alt='bowl-3'
            style={{ maxWidth: '800px' }}
          />
          <div className='bowl-shadow'></div>
          {/* 果菜區 */}
          {VeggieItems.map((item) => (
            <img
              key={item.name}
              src={`${import.meta.env.BASE_URL}img/items/${item.name}.png`}
              className='veggie'
              alt={item.name}
              style={{
                '--a': item.angle,
                animationDelay: item.delay,
                animationDuration: item.dur,
              }}
            />
          ))}
        </div>
        <div className='position-absolute bottom-0 left-0 w-100'>
          {' '}
          <svg
            id='visual'
            viewBox='0 0 1920 100'
            width='100%'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            version='1.1'
          >
            <path
              d='M0 93L18.8 89.2C37.7 85.3 75.3 77.7 113 76.7C150.7 75.7 188.3 81.3 226 83.2C263.7 85 301.3 83 339 76.2C376.7 69.3 414.3 57.7 452 52.5C489.7 47.3 527.3 48.7 565 54.7C602.7 60.7 640.3 71.3 678 74C715.7 76.7 753.3 71.3 791 68.8C828.7 66.3 866.3 66.7 903.8 68.2C941.3 69.7 978.7 72.3 1016.2 68.3C1053.7 64.3 1091.3 53.7 1129 48.8C1166.7 44 1204.3 45 1242 50.7C1279.7 56.3 1317.3 66.7 1355 67C1392.7 67.3 1430.3 57.7 1468 60.5C1505.7 63.3 1543.3 78.7 1581 86.7C1618.7 94.7 1656.3 95.3 1694 87.3C1731.7 79.3 1769.3 62.7 1807 59.8C1844.7 57 1882.3 68 1901.2 73.5L1920 79L1920 101L1901.2 101C1882.3 101 1844.7 101 1807 101C1769.3 101 1731.7 101 1694 101C1656.3 101 1618.7 101 1581 101C1543.3 101 1505.7 101 1468 101C1430.3 101 1392.7 101 1355 101C1317.3 101 1279.7 101 1242 101C1204.3 101 1166.7 101 1129 101C1091.3 101 1053.7 101 1016.2 101C978.7 101 941.3 101 903.8 101C866.3 101 828.7 101 791 101C753.3 101 715.7 101 678 101C640.3 101 602.7 101 565 101C527.3 101 489.7 101 452 101C414.3 101 376.7 101 339 101C301.3 101 263.7 101 226 101C188.3 101 150.7 101 113 101C75.3 101 37.7 101 18.8 101L0 101Z'
              fill='#FFFFFF'
              strokeLinecap='round'
              strokeLinejoin='miter'
            ></path>
          </svg>
        </div>
      </section>
    </>
  );
};
export default HeroSection;
