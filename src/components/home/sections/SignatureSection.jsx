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
          <div className='container-fluid home__swiper bg-yellow-100 pt-5 pb-8 pb-md-10 px-8 rounded-5'>
            <div className='text-center mb-2 mb-md-5'>
              <h4 className='text-gray-200 fs-6 fs-md-4 fw-semibold mb-2 mb-md-5'>
                BEST SELLER
              </h4>
              <h2 className='fs-3 fs-md-1 fw-bold mb-2 mb-md-5'>熱銷排行</h2>
            </div>
            <div className='row'>
              <BestSellerSwiper />
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
};
export default SignatureSection;
