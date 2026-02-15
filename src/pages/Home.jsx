import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { PageLinks, Ingredients } from '../data/homeData';

// API
import { getArticles } from '../api/ApiClient';

// component
import Loader from '../components/common/Loading';
import ContentCard from '../components/home/ContentCard';
import CommentCard from '../components/home/CommentCard';
import IngredientCard from '../components/home/IngredientCard';
import StepCard from '../components/home/StepCard';
import BestSellerSwiper from '../components/home/BestSellerSwiper';
import HeroSection from '../components/home/sections/HeroSection';
import NutritionSection from '../components/home/sections/NutritionSection';

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
              <div className='col-lg-7 d-none d-sm-flex home__signature-container mt-10'>
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
          <div className='container-fluid home__swiper bg-yellow-100 pt-5 pb-8 pb-md-10 px-8 rounded-5'>
            <div className='text-center mb-2 mb-md-5'>
              {' '}
              <h4 className='text-gray-200 fs-6 fs-md-4 fw-semibold mb-2 mb-md-5'>
                BEST SELLER
              </h4>
              <h2 className='fs-3 fs-md-1 fw-bold mb-2 mb-md-5'>熱銷排行</h2>
            </div>
            <div className='row'>
              <BestSellerSwiper />
            </div>
          </div>
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
        {/* 自由配 */}
        <section className='home__custom position-relative'>
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
              <div className='col-lg-6'>
                <StepCard />
              </div>
            </div>
          </div>
        </section>
        <svg
          id='visual'
          viewBox='0 0 1920 300'
          width='100%'
          height='auto'
          xmlns='http://www.w3.org/2000/svg'
          xmlns:xlink='http://www.w3.org/1999/xlink'
          version='1.1'
        >
          <path
            d='M0 206L24.7 193.5C49.3 181 98.7 156 147.8 153.2C197 150.3 246 169.7 295.2 172.5C344.3 175.3 393.7 161.7 443 160.8C492.3 160 541.7 172 590.8 181.3C640 190.7 689 197.3 738.2 188.7C787.3 180 836.7 156 886 150.2C935.3 144.3 984.7 156.7 1034 167.2C1083.3 177.7 1132.7 186.3 1181.8 186.5C1231 186.7 1280 178.3 1329.2 172.5C1378.3 166.7 1427.7 163.3 1477 159.5C1526.3 155.7 1575.7 151.3 1624.8 154.8C1674 158.3 1723 169.7 1772.2 168.2C1821.3 166.7 1870.7 152.3 1895.3 145.2L1920 138L1920 301L1895.3 301C1870.7 301 1821.3 301 1772.2 301C1723 301 1674 301 1624.8 301C1575.7 301 1526.3 301 1477 301C1427.7 301 1378.3 301 1329.2 301C1280 301 1231 301 1181.8 301C1132.7 301 1083.3 301 1034 301C984.7 301 935.3 301 886 301C836.7 301 787.3 301 738.2 301C689 301 640 301 590.8 301C541.7 301 492.3 301 443 301C393.7 301 344.3 301 295.2 301C246 301 197 301 147.8 301C98.7 301 49.3 301 24.7 301L0 301Z'
            fill='#fefdfd'
          ></path>
          <path
            d='M0 217L24.7 220.7C49.3 224.3 98.7 231.7 147.8 229.3C197 227 246 215 295.2 204.5C344.3 194 393.7 185 443 187.7C492.3 190.3 541.7 204.7 590.8 206C640 207.3 689 195.7 738.2 195.7C787.3 195.7 836.7 207.3 886 209.3C935.3 211.3 984.7 203.7 1034 204.5C1083.3 205.3 1132.7 214.7 1181.8 214.7C1231 214.7 1280 205.3 1329.2 202C1378.3 198.7 1427.7 201.3 1477 207.7C1526.3 214 1575.7 224 1624.8 224.7C1674 225.3 1723 216.7 1772.2 213.7C1821.3 210.7 1870.7 213.3 1895.3 214.7L1920 216L1920 301L1895.3 301C1870.7 301 1821.3 301 1772.2 301C1723 301 1674 301 1624.8 301C1575.7 301 1526.3 301 1477 301C1427.7 301 1378.3 301 1329.2 301C1280 301 1231 301 1181.8 301C1132.7 301 1083.3 301 1034 301C984.7 301 935.3 301 886 301C836.7 301 787.3 301 738.2 301C689 301 640 301 590.8 301C541.7 301 492.3 301 443 301C393.7 301 344.3 301 295.2 301C246 301 197 301 147.8 301C98.7 301 49.3 301 24.7 301L0 301Z'
            fill='#faf7f3'
          ></path>
          <path
            d='M0 222L24.7 223.5C49.3 225 98.7 228 147.8 232C197 236 246 241 295.2 247.7C344.3 254.3 393.7 262.7 443 263.2C492.3 263.7 541.7 256.3 590.8 254.7C640 253 689 257 738.2 258.8C787.3 260.7 836.7 260.3 886 257.5C935.3 254.7 984.7 249.3 1034 242.8C1083.3 236.3 1132.7 228.7 1181.8 230.3C1231 232 1280 243 1329.2 245.8C1378.3 248.7 1427.7 243.3 1477 243.2C1526.3 243 1575.7 248 1624.8 251.5C1674 255 1723 257 1772.2 259.7C1821.3 262.3 1870.7 265.7 1895.3 267.3L1920 269L1920 301L1895.3 301C1870.7 301 1821.3 301 1772.2 301C1723 301 1674 301 1624.8 301C1575.7 301 1526.3 301 1477 301C1427.7 301 1378.3 301 1329.2 301C1280 301 1231 301 1181.8 301C1132.7 301 1083.3 301 1034 301C984.7 301 935.3 301 886 301C836.7 301 787.3 301 738.2 301C689 301 640 301 590.8 301C541.7 301 492.3 301 443 301C393.7 301 344.3 301 295.2 301C246 301 197 301 147.8 301C98.7 301 49.3 301 24.7 301L0 301Z'
            fill='#ecf3ed'
          ></path>
        </svg>
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
