import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { PageLinks, TroubleCards } from '../../../data/homeData';
import FadeIn from '../FadeIn';

const NutritionSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Nutrition */}
      <section className='container-fluid home__nur-section py-8 py-md-10'>
        <FadeIn>
          {' '}
          <div className='container py-6'>
            <div className='row'>
              {/* 說明 */}
              <div className='col-md-7 mb-5'>
                {/* 標題文字區 */}
                <h4 className='text-gray-200 fs-6 fs-md-4 fw-semibold mb-2'>
                  YOUR NUTRITION, DECODED
                </h4>
                <h2 className='fs-3 fs-md-1 fw-bold mb-2 mb-md-5'>
                  拒絕盲吃！
                  <br />
                  營養成分，
                  <span className=''>即時看得見</span>。
                </h2>
                {/* 桌機板 */}
                <div className='d-none d-md-block'>
                  <p className='fs-6 mb-3 px-4'>
                    別讓算熱量成了負擔， <br />
                    你的每一份營養， <br />
                    我們幫你把關。
                  </p>
                  <ul className='home__nur-card d-flex gap-4'>
                    <li className='home__nur-card-content d-flex flex-column justify-content-end'>
                      <h3 className='fw-bold fs-6 mb-2'>
                        綠果精選｜為你搭配好
                      </h3>
                      <p className='mb-4'>把營養交給我們，安心吃就好</p>
                      <NavLink
                        className='fw-medium mx-1 d-flex justify-content-between'
                        to={PageLinks.productLink.url}
                      >
                        <span>{PageLinks.productLink.title}</span>
                        <i className='bi bi-chevron-right'></i>
                      </NavLink>
                    </li>
                    <li className='home__nur-card-content d-flex flex-column justify-content-end'>
                      <h3 className='fw-bold fs-6 mb-2'>
                        客製自由配｜你來決定
                      </h3>
                      <p className='mb-4'>依照你的需求，自由調整每一份營養</p>
                      <NavLink
                        className='fw-medium mx-1 d-flex justify-content-between'
                        to={PageLinks.customLink.url}
                      >
                        <span>{PageLinks.customLink.title}</span>
                        <i className='bi bi-chevron-right'></i>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </div>
              {/* 過去的困擾 */}
              <div
                ref={sectionRef}
                className='col-md-5 d-flex flex-column mt-2 mt-lg-5 gap-5 gap-lg-8'
              >
                {TroubleCards.map((card) => (
                  <div
                    key={card.id}
                    className={`sub-card bg-gray-100 rounded-4 position-relative py-3 px-4 py-md-5 px-md-6 ${card.align} ${isVisible ? 'is-visible' : ''}`}
                  >
                    <p className='text-warning fw-medium mb-2'>過去的困擾</p>
                    <p className='mb-0'>{card.text}</p>
                    <svg
                      className='position-absolute'
                      width='20'
                      height='20'
                      style={{
                        bottom: '-15px',
                        [card.tailSide]: '20px',
                      }}
                    >
                      <path d='M0,0 L20,0 L10,20 Z' fill='#e3e7e0' />
                    </svg>
                  </div>
                ))}
              </div>
              {/* 手機版 */}
              <div className='d-block d-md-none mt-5'>
                <p className='fs-6 mt-5 mb-3 px-4 text-center'>
                  別讓算熱量成了負擔， <br />
                  你的每一份營養， <br />
                  我們幫你把關。
                </p>
                <ul className='home__nur-card d-flex flex-column w-100 gap-4'>
                  <li className='home__nur-card-content d-flex flex-column justify-content-end'>
                    <h3 className='fw-bold fs-6 mb-2'>綠果精選｜為你搭配好</h3>
                    <p className='mb-4'>把營養交給我們，安心吃就好</p>
                    <NavLink
                      className='fw-medium mx-1 d-flex justify-content-between'
                      to={PageLinks.productLink.url}
                    >
                      <span>{PageLinks.productLink.title}</span>
                      <i className='bi bi-chevron-right'></i>
                    </NavLink>
                  </li>
                  <li className='home__nur-card-content d-flex flex-column justify-content-end'>
                    <h3 className='fw-bold fs-6 mb-2'>客製自由配｜你來決定</h3>
                    <p className='mb-4'>依照你的需求，自由調整每一份營養</p>
                    <NavLink
                      className='fw-medium mx-1 d-flex justify-content-between'
                      to={PageLinks.customLink.url}
                    >
                      <span>{PageLinks.customLink.title}</span>
                      <i className='bi bi-chevron-right'></i>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
};
export default NutritionSection;
