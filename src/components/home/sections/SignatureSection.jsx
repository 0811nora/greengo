import { NavLink } from 'react-router-dom';
import { PageLinks, Ingredients } from '../../../data/homeData';
// component
import IngredientCard from '../IngredientCard';
import ContentCard from '../ContentCard';
import BestSellerSwiper from '../BestSellerSwiper';
import FadeIn from '../FadeIn';

const SignatureSection = () => {
  return (
    <>
      <section className='home__signature-section container-fluid rounded-top-5 py-8 px-6'>
        {/* 示意區 */}
        <FadeIn>
          <div className='container'>
            <div className='row align-items-center'>
              {/* 左邊示意區 */}
              <div className='order-2 order-lg-1 col-lg-6 d-none d-sm-flex home__signature-container mt-10'>
                {/* 碗 */}
                <div className='home__signature-content'>
                  <img
                    src={`${import.meta.env.BASE_URL}img/items/bowl-5.png`}
                    alt='bowl-5'
                    className='home__signature-img'
                  />
                  {/* 配菜區 */}
                  {Ingredients.map((data) => (
                    <IngredientCard key={data.id} item={data} />
                  ))}
                </div>
              </div>
              {/* 右邊文字區 */}
              <div className='order-1 order-lg-2 col-lg-6'>
                <ContentCard
                  subTitle='SIGNATURE BOWLS'
                  title={<>綠果精選系列</>}
                  description={
                    <>
                      綠果堅持由營養團隊精心設計的黃金比例組合。
                      <br />
                      無須思考，打開就能享用一份零失誤的健康。
                    </>
                  }
                  buttonText='查看精選菜單'
                  bgColor='transparent'
                  textPosition='text-center'
                  to={PageLinks.productLink.url}
                />
              </div>
            </div>
          </div>
        </FadeIn>

        {/* 熱門商品 + swiper 套件*/}
        <FadeIn delay={0.3}>
          {' '}
          <div className='container-fluid home__swiper bg-yellow-100 pt-5 pb-8 pb-md-10 px-5 px-md-8 rounded-5'>
            <div className='text-center mb-2 mb-md-5'>
              <ContentCard
                hasBorde
                subTitle='BEST SELLER'
                title='熱銷排行'
                bgColor='transparent'
                textPosition='text-center'
                contentPadding='py-0 mt-0 mb-0'
              />
            </div>
            <div className='row'>
              <BestSellerSwiper />
            </div>
          </div>
        </FadeIn>
      </section>
      <svg
        id='visual'
        viewBox='0 0 1920 120'
        width='100%'
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        version='1.1'
      >
        <path
          d='M0 30L35.5 35.3C71 40.7 142 51.3 213.2 47.8C284.3 44.3 355.7 26.7 426.8 22.3C498 18 569 27 640 36.2C711 45.3 782 54.7 853.2 54.8C924.3 55 995.7 46 1066.8 38.8C1138 31.7 1209 26.3 1280 29C1351 31.7 1422 42.3 1493.2 49C1564.3 55.7 1635.7 58.3 1706.8 58.5C1778 58.7 1849 56.3 1884.5 55.2L1920 54L1920 0L1884.5 0C1849 0 1778 0 1706.8 0C1635.7 0 1564.3 0 1493.2 0C1422 0 1351 0 1280 0C1209 0 1138 0 1066.8 0C995.7 0 924.3 0 853.2 0C782 0 711 0 640 0C569 0 498 0 426.8 0C355.7 0 284.3 0 213.2 0C142 0 71 0 35.5 0L0 0Z'
          fill='#ecf3ed'
          strokeLinecap='round'
          strokeLinejoin='miter'
        ></path>
      </svg>
    </>
  );
};
export default SignatureSection;
