import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { PageLinks, Ingredients, CommentContent } from '../data/homeData';

// API
import { getArticles } from '../api/ApiClient';

// component
import Loader from '../components/common/Loading';
import ContentCard from '../components/home/ContentCard';
import CommentCard from '../components/home/CommentCard';
import FadeIn from '../components/home/FadeIn';
import HeroSection from '../components/home/sections/HeroSection';
import NutritionSection from '../components/home/sections/NutritionSection';
import SignatureSection from '../components/home/sections/SignatureSection';
import CustomSection from '../components/home/sections/CustomSection';
import AboutSection from '../components/home/sections/AboutSection';
import TestimonialSection from '../components/home/sections/Testimonials';

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
        // console.log('文章 API 資料：', res.data.articles);
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
        {/* Nutrition Section */}
        <NutritionSection />
        {/* 精選區 */}
        <SignatureSection />
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
        <CustomSection />
        <svg
          id='visual'
          viewBox='0 0 1920 250'
          width='100%'
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          version='1.1'
        >
          <path
            d='M0 69L21.3 67.2C42.7 65.3 85.3 61.7 128 57.3C170.7 53 213.3 48 256 46.3C298.7 44.7 341.3 46.3 384 49.7C426.7 53 469.3 58 512 65C554.7 72 597.3 81 640 79.3C682.7 77.7 725.3 65.3 768 58C810.7 50.7 853.3 48.3 896 55.7C938.7 63 981.3 80 1024 80.7C1066.7 81.3 1109.3 65.7 1152 55.2C1194.7 44.7 1237.3 39.3 1280 41.5C1322.7 43.7 1365.3 53.3 1408 57.5C1450.7 61.7 1493.3 60.3 1536 55.8C1578.7 51.3 1621.3 43.7 1664 52.5C1706.7 61.3 1749.3 86.7 1792 91.7C1834.7 96.7 1877.3 81.3 1898.7 73.7L1920 66L1920 251L1898.7 251C1877.3 251 1834.7 251 1792 251C1749.3 251 1706.7 251 1664 251C1621.3 251 1578.7 251 1536 251C1493.3 251 1450.7 251 1408 251C1365.3 251 1322.7 251 1280 251C1237.3 251 1194.7 251 1152 251C1109.3 251 1066.7 251 1024 251C981.3 251 938.7 251 896 251C853.3 251 810.7 251 768 251C725.3 251 682.7 251 640 251C597.3 251 554.7 251 512 251C469.3 251 426.7 251 384 251C341.3 251 298.7 251 256 251C213.3 251 170.7 251 128 251C85.3 251 42.7 251 21.3 251L0 251Z'
            fill='#fefdfd'
          ></path>
          <path
            d='M0 135L21.3 128.7C42.7 122.3 85.3 109.7 128 104C170.7 98.3 213.3 99.7 256 107C298.7 114.3 341.3 127.7 384 125.2C426.7 122.7 469.3 104.3 512 100.3C554.7 96.3 597.3 106.7 640 111C682.7 115.3 725.3 113.7 768 114C810.7 114.3 853.3 116.7 896 124.2C938.7 131.7 981.3 144.3 1024 144C1066.7 143.7 1109.3 130.3 1152 121.2C1194.7 112 1237.3 107 1280 105.2C1322.7 103.3 1365.3 104.7 1408 102.5C1450.7 100.3 1493.3 94.7 1536 99.5C1578.7 104.3 1621.3 119.7 1664 123C1706.7 126.3 1749.3 117.7 1792 121.3C1834.7 125 1877.3 141 1898.7 149L1920 157L1920 251L1898.7 251C1877.3 251 1834.7 251 1792 251C1749.3 251 1706.7 251 1664 251C1621.3 251 1578.7 251 1536 251C1493.3 251 1450.7 251 1408 251C1365.3 251 1322.7 251 1280 251C1237.3 251 1194.7 251 1152 251C1109.3 251 1066.7 251 1024 251C981.3 251 938.7 251 896 251C853.3 251 810.7 251 768 251C725.3 251 682.7 251 640 251C597.3 251 554.7 251 512 251C469.3 251 426.7 251 384 251C341.3 251 298.7 251 256 251C213.3 251 170.7 251 128 251C85.3 251 42.7 251 21.3 251L0 251Z'
            fill='#fcf9f7'
          ></path>
          <path
            d='M0 174L21.3 177C42.7 180 85.3 186 128 185.5C170.7 185 213.3 178 256 167.7C298.7 157.3 341.3 143.7 384 147.2C426.7 150.7 469.3 171.3 512 171C554.7 170.7 597.3 149.3 640 139.2C682.7 129 725.3 130 768 130.8C810.7 131.7 853.3 132.3 896 139.5C938.7 146.7 981.3 160.3 1024 169.2C1066.7 178 1109.3 182 1152 177.5C1194.7 173 1237.3 160 1280 152.3C1322.7 144.7 1365.3 142.3 1408 145.2C1450.7 148 1493.3 156 1536 161.7C1578.7 167.3 1621.3 170.7 1664 169.8C1706.7 169 1749.3 164 1792 161.7C1834.7 159.3 1877.3 159.7 1898.7 159.8L1920 160L1920 251L1898.7 251C1877.3 251 1834.7 251 1792 251C1749.3 251 1706.7 251 1664 251C1621.3 251 1578.7 251 1536 251C1493.3 251 1450.7 251 1408 251C1365.3 251 1322.7 251 1280 251C1237.3 251 1194.7 251 1152 251C1109.3 251 1066.7 251 1024 251C981.3 251 938.7 251 896 251C853.3 251 810.7 251 768 251C725.3 251 682.7 251 640 251C597.3 251 554.7 251 512 251C469.3 251 426.7 251 384 251C341.3 251 298.7 251 256 251C213.3 251 170.7 251 128 251C85.3 251 42.7 251 21.3 251L0 251Z'
            fill='#f6f5f0'
          ></path>
          <path
            d='M0 220L21.3 221.2C42.7 222.3 85.3 224.7 128 221.2C170.7 217.7 213.3 208.3 256 204.8C298.7 201.3 341.3 203.7 384 205.2C426.7 206.7 469.3 207.3 512 202C554.7 196.7 597.3 185.3 640 188.2C682.7 191 725.3 208 768 216.3C810.7 224.7 853.3 224.3 896 217.3C938.7 210.3 981.3 196.7 1024 191.3C1066.7 186 1109.3 189 1152 191.8C1194.7 194.7 1237.3 197.3 1280 201.2C1322.7 205 1365.3 210 1408 205.2C1450.7 200.3 1493.3 185.7 1536 179.3C1578.7 173 1621.3 175 1664 183.3C1706.7 191.7 1749.3 206.3 1792 213.2C1834.7 220 1877.3 219 1898.7 218.5L1920 218L1920 251L1898.7 251C1877.3 251 1834.7 251 1792 251C1749.3 251 1706.7 251 1664 251C1621.3 251 1578.7 251 1536 251C1493.3 251 1450.7 251 1408 251C1365.3 251 1322.7 251 1280 251C1237.3 251 1194.7 251 1152 251C1109.3 251 1066.7 251 1024 251C981.3 251 938.7 251 896 251C853.3 251 810.7 251 768 251C725.3 251 682.7 251 640 251C597.3 251 554.7 251 512 251C469.3 251 426.7 251 384 251C341.3 251 298.7 251 256 251C213.3 251 170.7 251 128 251C85.3 251 42.7 251 21.3 251L0 251Z'
            fill='#ecf3ed'
          ></path>
        </svg>
        {/* 關於我們 + 專欄 */}
        {/* 關於我們 */}
        <AboutSection />
        {/* 專欄 */}{' '}
        <section className='home__article container-fluid py-8 py-md-10 px-0'>
          <section className='container py-7'>
            <div className='row'>
              <div className='col-lg-4 my-auto'>
                <ContentCard
                  hasBorder
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
                  bgColor='transparent'
                  textPosition='text-center'
                  contentPadding='py-7 mt-5'
                  to={PageLinks.articleLink.url}
                />
              </div>
              {/* 文章區 */}
              <div className='col-lg-8'>
                <div className='row g-4 d-flex align-items-center'>
                  {/* 主文章 */}
                  <div className='col-md-7 mt-0'>
                    {mainArticle && (
                      <Link
                        to={`/article/${mainArticle.id}`}
                        className='text-decoration-none'
                      >
                        <div className='home__article-link card border-0 shadow-green rounded-4 overflow-hidden'>
                          {mainArticle.image && (
                            <>
                              <div className='position-relative'>
                                <span className='position-absolute badge fs-6 bg-brown-100 text-brown-300 mt-4 ms-4 mb-2'>
                                  NEW
                                </span>
                                <img
                                  src={mainArticle.image}
                                  className='card-img-top'
                                  alt={mainArticle.title}
                                  style={{
                                    height: '250px',
                                    objectFit: 'cover',
                                  }}
                                />
                              </div>
                            </>
                          )}
                          <div className='card-body px-6 py-4 d-flex flex-column align-items-start'>
                            <h5 className='card-title fw-bold mb-3 text-gray-600'>
                              {mainArticle.title}
                            </h5>

                            <p className='card-text text-brown-300'>
                              {/* 限制文章顯示字數 */}
                              {mainArticle.description
                                ? mainArticle.description.length > 50
                                  ? mainArticle.description.substring(0, 50) +
                                    '...'
                                  : mainArticle.description
                                : '暫無內容'}
                            </p>
                            <div className='mt-8 d-flex flex-column flex-md-row justify-content-between w-100'>
                              <p className='text-brown-300 d-block mb-2'>
                                {formatDate(mainArticle.create_at)} ‧
                                {mainArticle.author} ‧
                                {mainArticle.tag?.map((tag, index) => (
                                  <span
                                    key={index}
                                    className='ms-2 badge bg-accent text-gray-600'
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </p>
                              <button type='button' className='home__btn-link'>
                                <span className='hover-underline'>
                                  閱讀全文
                                </span>
                                <svg
                                  id='arrow-horizontal'
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='30'
                                  height='8'
                                  viewBox='0 0 46 16'
                                  fill='currentColor'
                                >
                                  <path
                                    id='Path_10'
                                    d='M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z'
                                    transform='translate(30)'
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>

                  {/* 文章卡片*/}
                  <div className='col-md-5'>
                    <div className='card border-0 shadow rounded-4 p-3 h-100'>
                      {subArticles.map((article) => (
                        <div key={article.id} className='py-3 border-bottom'>
                          <Link
                            to={`/article/${article.id}`}
                            className='text-decoration-none'
                          >
                            <div className='home__article-link'>
                              <h6 className='mb-4 fw-bold text-gray-600'>
                                {article.title}
                              </h6>
                              <div className='mt-auto d-flex flex-column'>
                                <span>
                                  {article.tag?.map((tag, index) => (
                                    <span
                                      key={index}
                                      className='badge bg-accent text-gray-600 mb-2'
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </span>
                                <p className='mb-2 text-brown-300 d-flex justify-content-between flex-nowrap'>
                                  {formatDate(article.create_at)}

                                  <button
                                    type='button'
                                    className='home__btn-link text-end'
                                  >
                                    <span className='hover-underline'>
                                      閱讀全文
                                    </span>
                                    <svg
                                      id='arrow-horizontal'
                                      xmlns='http://www.w3.org/2000/svg'
                                      width='30'
                                      height='8'
                                      viewBox='0 0 46 16'
                                      fill='currentColor'
                                    >
                                      <path
                                        id='Path_10'
                                        d='M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z'
                                        transform='translate(30)'
                                      ></path>
                                    </svg>
                                  </button>
                                </p>
                              </div>
                            </div>
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
                          className='home__btn-primary text-decoration-none rounded-pill d-inline-block px-4 py-2 my-4'
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
        </section>
        {/* 顧客意見 */}
        <TestimonialSection />
      </main>
    </>
  );
}
