import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { PageLinks, Ingredients } from '../data/homeData';

// swiper
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// API
import { getArticles } from '../api/ApiClient';

// component
import Loader from '../components/common/Loading';
import ContentCard from '../components/home/ContentCard';
import CommentCard from '../components/home/CommentCard';
import IngredientCard from '../components/home/IngredientCard';
import StepCard from '../components/home/StepCard';
import HeroSection from '../components/home/sections/HeroSection';
import NutritionSection from '../components/home/sections/NutritionSection';

// 餐點卡片區
// 模擬資料，待接 API
const FIXED_PRODUCTS = [
  {
    id: 1,
    name: '經典雙雞蛋白碗',
    price: 230,
    kcal: 550,
    img: `${import.meta.env.BASE_URL}img/items/bowl-3.png`,
    tags: ['豐富蛋白質', '輕盈低卡', '優質油脂'],
    rank: 'TOP1',
  },
  {
    id: 2,
    name: '經典雙雞蛋白碗',
    price: 230,
    kcal: 550,
    img: `${import.meta.env.BASE_URL}img/items/bowl-3.png`,
    tags: ['豐富蛋白質', '輕盈低卡', '優質油脂'],
    rank: 'TOP2',
  },
  {
    id: 3,
    name: '經典雙雞蛋白碗',
    price: 230,
    kcal: 550,
    img: `${import.meta.env.BASE_URL}img/items/bowl-3.png`,
    tags: ['豐富蛋白質', '輕盈低卡', '優質油脂'],
    rank: 'TOP3',
  },
  {
    id: 4,
    name: '經典雙雞蛋白碗',
    price: 230,
    kcal: 550,
    img: `${import.meta.env.BASE_URL}img/items/bowl-3.png`,
    tags: ['豐富蛋白質', '輕盈低卡', '優質油脂'],
    rank: 'TOP4',
  },
  {
    id: 5,
    name: '經典雙雞蛋白碗',
    price: 230,
    kcal: 550,
    img: `${import.meta.env.BASE_URL}img/items/bowl-3.png`,
    tags: ['豐富蛋白質', '輕盈低卡', '優質油脂'],
    rank: 'TOP5',
  },
];

export default function Home() {
  // 監聽區
  const [isLoading, setIsLoading] = useState(true);

  // 文章 API
  // 用時間排序 sort 去取最新 4 片文章
  // main article
  const [mainArticle, setMainArticle] = useState(null);
  // sub article
  const [subArticles, setSubArticles] = useState([]);

  // 文章
  useEffect(() => {
    const getAllArticles = async (page = 1) => {
      setIsLoading(true);
      try {
        const res = await getArticles(page);
        console.log('文章 API 資料：', res.data.articles);
        const allArticles = res.data.articles;
        const sortedArticles = [...allArticles].sort(
          (a, b) => b.create_at - a.create_at,
        );
        if (sortedArticles.length > 0) {
          setMainArticle(sortedArticles[0]);
          setSubArticles(sortedArticles.slice(1, 4));
        }
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    getAllArticles();
  }, []);
  // 文章時間戳轉換
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <>
      <Loader mode={'page'} show={isLoading} />
      <main className='container-fluid p-0'>
        {/* Hero Section */}
        <HeroSection />
        {/* Smart Nutrition */}
        <NutritionSection />
        {/* 精選區 */}
        <section className='home__signature-section container-fluid rounded-top-5 py-10 px-6'>
          {/* 示意區 */}
          <div className='container'>
            <div className='row align-items-center'>
              {/* 左邊示意區 */}
              <div className='col-lg-7 d-none d-sm-flex home__signature-container my-8'>
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
              <div className='col-lg-5'>
                <ContentCard
                  subTitle='SIGNATURE BOWLS'
                  title={
                    <>
                      綠果 <br /> 精選系列
                    </>
                  }
                  description={
                    <>
                      綠果堅持由營養團隊精心設計的黃金比例組合，
                      <br />
                      無須思考，打開就能享用一份零失誤的健康。
                    </>
                  }
                  buttonText='查看精選菜單'
                  to={PageLinks.productLink.url}
                />
              </div>
            </div>
          </div>
          {/* 熱門商品 + swiper 套件*/}
          <div className='container-fluid bg-white py-8 py-md-10 px-8 rounded-5'>
            <div className='row'>
              <Swiper
                className='fixed-swiper'
                modules={[Navigation, A11y]}
                spaceBetween={24}
                slidesPerView={1.5}
                navigation
                breakpoints={{
                  576: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  992: { slidesPerView: 4 },
                }}
                style={{
                  paddingBottom: '10px',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                }}
              >
                {/* 待調整 */}
                {FIXED_PRODUCTS.map((product) => (
                  <SwiperSlide key={product.id}>
                    <div className='home__fixed-card h-100'>
                      <div className='position-relative overflow-hidden rounded-3'>
                        {product.rank && (
                          <span className='badge rounded-pill bg-success position-absolute top-0 start-0 mt-2 ms-2 z-3'>
                            {product.rank}
                          </span>
                        )}
                        <button
                          type='button'
                          className='btn-add-cart position-absolute bottom-0 end-0 mb-2 me-2 z-3'
                          aria-label='加入購物車'
                        >
                          <i className='bi bi-bag'></i>
                        </button>
                        <img
                          src={product.img}
                          className='card-img-top object-fit-cover'
                          alt={product.name}
                        />
                      </div>
                      <div className='card-body mt-4'>
                        <div className='d-flex justify-content-between align-items-center mb-1'>
                          <h5 className='fs-6 fs-md-5 fw-bold mb-0'>
                            {product.name}
                          </h5>
                          <span className='ft-en fs-6 fs-md-5 fw-bold'>
                            ${product.price}
                          </span>
                        </div>
                        <p className='ft-en fw-medium text-gray-300 mb-3'>
                          {product.kcal} kcal
                        </p>
                        <div className='d-flex flex-wrap gap-2'>
                          {product.tags.map((item, index) => (
                            <span key={index} className='tag-item'>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>

        <section className='bg-white'></section>
        {/* 自由配 */}
        <section
          className='position-relative my-5'
          style={{ paddingTop: '80px' }}
        >
          <div className='container'>
            <div className='row'>
              {/* 左側卡片介紹 */}
              <div className='col-lg-6'>
                <ContentCard
                  subTitle='MAKE YOUR BITE'
                  title={
                    <>
                      訂製自己的健康，
                      <br />
                      不需要複雜
                    </>
                  }
                  description={
                    <>
                      從基底、主食到蔬菜與醬料，慢慢堆疊屬於自己的風味。
                      <br />
                      健康其實不難，他只需要一點點透明與理解。
                    </>
                  }
                  buttonText='前往客製化點餐'
                  to={PageLinks.customLink.url}
                />
              </div>
              {/* 右側卡片說明 */}
              {/* <ul className='col-lg-6 d-flex flex-column justify-content-center makeBite-section'>
                <li className='d-flex align-items-center'>
                  <span className='ft-en fs-4 fs-md-2 fw-medium text-brown-200 ms-1 me-4'>
                    1
                  </span>
                  <span className='fs-6 fs-md-4 fw-bold text-gray-500 me-3'>
                    選擇基底
                  </span>
                  <span className='text-gray-400'>
                    白米、糙米、紫米、藜麥、生菜
                  </span>
                </li>
                <li className='d-flex align-items-center'>
                  <span className='ft-en fs-4 fs-md-2 fw-medium text-brown-200 me-3'>
                    2
                  </span>
                  <span className='fs-6 fs-md-4 fw-bold text-gray-500 me-3'>
                    挑選主食
                  </span>
                  <span className='text-gray-400'>
                    雞胸肉、牛肉、鮭魚、蝦仁，為你包山包海
                  </span>
                </li>
                <li className='d-flex align-items-center'>
                  <span className='ft-en fs-4 fs-md-2 fw-medium text-brown-200 me-3'>
                    3
                  </span>
                  <span className='fs-6 fs-md-4 fw-bold text-gray-500 me-3'>
                    搭配蔬果
                  </span>
                  <span className='text-gray-400'>
                    配角可以比主角搶戲，季節時蔬任選 5 種
                  </span>
                </li>
                <li className='d-flex align-items-center'>
                  <span className='ft-en fs-4 fs-md-2 fw-medium text-brown-200 me-3'>
                    4
                  </span>
                  <span className='fs-6 fs-md-4 fw-bold text-gray-500 me-3'>
                    淋上醬汁
                  </span>
                  <span className='text-gray-400'>為你的餐盒來點靈魂</span>
                </li>
              </ul> */}
              <StepCard />
            </div>
          </div>
        </section>
        {/* 關於我們 + 專欄 */}
        <section className='container-fulid bg-primary-100'>
          {/* 關於我們 */}
          <section className='container-fluid bg-primary-100 py-7 overflow-hidden'>
            <div className='container position-relative'>
              <div className='row align-items-center'>
                <div className='col-md-6 position-relative'>
                  <img
                    src={`${import.meta.env.BASE_URL}img/items/bowl-5.png`}
                    alt='bowl'
                    className='position-absolute start-0 top-50 translate-middle-y'
                    style={{ width: '80%', left: '-20%' }}
                  />
                </div>
                {/* 文字區 */}
                <div className='col-md-6 col-lg-4'>
                  <ContentCard
                    subTitle='OUR BELIEF'
                    title='綠果的堅持'
                    description={
                      <>
                        我們深信，真正的健康不應是道難題。
                        <br />
                        這份信念，驅使著綠果的每一步。
                      </>
                    }
                    buttonText='聽聽我們的故事'
                    to={PageLinks.aboutLink.url}
                  />
                </div>
              </div>
            </div>
          </section>
          {/* 專欄 */}
          <section className='container py-7'>
            <div className='row'>
              <div className='col-lg-4 mb-5 mb-lg-0'>
                <ContentCard
                  subTitle='YOUR INSPIRATION'
                  title='綠果專欄'
                  description={
                    <>
                      讓我們的信念透過文字，
                      <br />
                      成為你往後飲食的靈感
                    </>
                  }
                  buttonText='看看我們的文章'
                  to={PageLinks.articleLink.url}
                />
              </div>
              {/* 文章區 */}
              <div className='col-lg-8'>
                <div className='row g-4'>
                  {/* 主文章 */}
                  <div className='col-md-7'>
                    {mainArticle && (
                      <div className='card border-0 shadow-green rounded-4 overflow-hidden h-100'>
                        {mainArticle.image && (
                          <img
                            src={mainArticle.image}
                            className='card-img-top'
                            alt={mainArticle.title}
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                        )}
                        <div className='card-body px-6 py-4 d-flex flex-column align-items-start'>
                          <span className='badge bg-brown-300 text-brown-100 mb-2'>
                            NEW
                          </span>
                          <Link
                            to={`/article/${mainArticle.id}`}
                            className='text-decoration-none'
                          >
                            <h5 className='card-title fw-bold mb-3 text-brown-300'>
                              {mainArticle.title}
                            </h5>
                          </Link>

                          <p className='card-text text-brown-300'>
                            {/* 限制文章顯示字數 */}
                            {mainArticle.description
                              ? mainArticle.description.length > 50
                                ? mainArticle.description.substring(0, 50) +
                                  '...'
                                : mainArticle.description
                              : '暫無內容'}
                          </p>
                          <div className='mt-auto'>
                            <p className='text-brown-300 d-block mb-2'>
                              {formatDate(mainArticle.create_at)} ‧
                              {mainArticle.author} ‧
                              {mainArticle.tag?.map((tag, index) => (
                                <span
                                  key={index}
                                  className='ms-2 badge bg-brown-300 text-brown-100'
                                >
                                  #{tag}
                                </span>
                              ))}
                            </p>
                            <Link
                              to={`/article/${mainArticle.id}`}
                              className='home__btn-link fw-bold text-decoration-none'
                            >
                              閱讀全文 <i className='bi bi-chevron-right'></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 文章卡片*/}
                  <div className='col-md-5'>
                    <div className='card border-0 shadow rounded-4 p-5 h-100'>
                      {subArticles.map((article) => (
                        <div key={article.id} className='py-3 border-bottom'>
                          <Link
                            to={`/article/${article.id}`}
                            className='text-decoration-none'
                          >
                            <h6 className='fw-bold text-brown-300'>
                              {article.title}
                            </h6>
                          </Link>
                          <p className='mb-2 text-brown-300'>
                            {formatDate(article.create_at)} ‧{' '}
                            {article.tag?.map((tag, index) => (
                              <span
                                key={index}
                                className='ms-2 badge bg-brown-300 text-brown-100'
                              >
                                #{tag}
                              </span>
                            ))}
                          </p>
                          <Link
                            to={`/article/${article.id}`}
                            className='home__btn-link text-decoration-none'
                          >
                            閱讀全文<i className='bi bi-chevron-right'></i>
                          </Link>
                        </div>
                      ))}

                      {/* 如果沒有文章 */}
                      {subArticles.length === 0 && (
                        <div className='py-3'>目前沒有更多文章</div>
                      )}

                      <div className='mt-auto pt-3 text-center'>
                        <Link
                          to='/articles'
                          className='home__btn-primary text-decoration-none rounded-pill d-inline-block px-4 py-2'
                        >
                          探索更多
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className='container'></div>
        </section>
        {/* 顧客意見 */}
        <section>
          <div className='container-fluid my-8 my-md-10'>
            <div className='d-flex flex-column justify-content-center align-items-center'>
              <h4 className='text-gray-200 fs-6 fs-md-4 fw-semibold mb-2'>
                TESTIMONIALS
              </h4>
              <h2 className='fs-3 fs-md-1 fw-bold mb-2 mb-md-5'>
                大家的真實分享
              </h2>
              <h4 className='text-orange-300 fs-6 fs-md-4 fw-semibold mb-2'>
                LOVE FROM OUR CUSTOMERS
              </h4>
            </div>

            <section className='py-5' style={{ overflowX: 'hidden' }}>
              <div
                className='d-flex gap-2 mb-3 scroll-container'
                style={{ marginLeft: '-50px' }}
              >
                <div className='scroll-track-left'>
                  <CommentCard
                    commentContent={
                      '真的很好吃！特別喜歡藜麥飯的口感，完全不乾，很Q彈～'
                    }
                    customer={'@ashley_dailyhealthy'}
                    star={'💖💖💖'}
                  />
                  <CommentCard
                    commentContent={
                      '真的很好吃！特別喜歡藜麥飯的口感，完全不乾，很Q彈～'
                    }
                    customer={'@ashley_dailyhealthy'}
                    star={'💖💖💖'}
                  />
                  <CommentCard
                    commentContent={
                      '真的很好吃！特別喜歡藜麥飯的口感，完全不乾，很Q彈～'
                    }
                    customer={'@ashley_dailyhealthy'}
                    star={'💖💖💖'}
                  />
                  <CommentCard
                    commentContent={
                      '真的很好吃！特別喜歡藜麥飯的口感，完全不乾，很Q彈～'
                    }
                    customer={'@ashley_dailyhealthy'}
                    star={'💖💖💖'}
                  />
                  <CommentCard
                    commentContent={
                      '真的很好吃！特別喜歡藜麥飯的口感，完全不乾，很Q彈～'
                    }
                    customer={'@ashley_dailyhealthy'}
                    star={'💖💖💖'}
                  />
                </div>
              </div>
              <div
                className='d-flex gap-2 mb-3 scroll-container'
                style={{ marginLeft: '50px' }}
              >
                <div className='scroll-track-right'>
                  <CommentCard
                    commentContent={
                      '真的很好吃！特別喜歡藜麥飯的口感，完全不乾，很Q彈～'
                    }
                    customer={'@ashley_dailyhealthy'}
                    star={'💖💖💖'}
                  />
                  <CommentCard
                    commentContent={
                      '真的很好吃！特別喜歡藜麥飯的口感，完全不乾，很Q彈～'
                    }
                    customer={'@ashley_dailyhealthy'}
                    star={'💖💖💖'}
                  />
                  <CommentCard
                    commentContent={
                      '真的很好吃！特別喜歡藜麥飯的口感，完全不乾，很Q彈～'
                    }
                    customer={'@ashley_dailyhealthy'}
                    star={'💖💖💖'}
                  />
                  <CommentCard
                    commentContent={
                      '真的很好吃！特別喜歡藜麥飯的口感，完全不乾，很Q彈～'
                    }
                    customer={'@ashley_dailyhealthy'}
                    star={'💖💖💖'}
                  />
                  <CommentCard
                    commentContent={
                      '真的很好吃！特別喜歡藜麥飯的口感，完全不乾，很Q彈～'
                    }
                    customer={'@ashley_dailyhealthy'}
                    star={'💖💖💖'}
                  />
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
