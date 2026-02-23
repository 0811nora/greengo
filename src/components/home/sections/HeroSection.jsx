import { NavLink } from 'react-router-dom';
import { PageLinks, HeroDecors, VeggieItems } from '../../../data/homeData';

const HeroSection = () => {
  return (
    <>
      {/* Hero Section */}
      <section className='container-fluid position-relative overflow-hidden'>
        {/* 文字區 */}
        <div className='home__hero-section py-8 py-md-10 my-md-10 text-center'>
          <h1 className='fs-2 display-md-1 fw-bold text-center mb-7'>
            生活<span className='comma'>，</span>
            <br />從<span className='text-primary'>好好吃飯</span>
            開始
          </h1>
          <p className='ft-en mb-2'>Elevate Your Day, Nourish Your Body.</p>
          <p className='mb-3 mb-md-5'>綠果相信，每一次的選擇都值得被用心對待</p>
          <NavLink
            to={PageLinks.productLink.url}
            className='home__btn-primary fw-medium'
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
      </section>
    </>
  );
};
export default HeroSection;
