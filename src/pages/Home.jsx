import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { PageLinks } from '../data/homeData';

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
        {/* 自由配 */}
        <CustomSection />
        {/* 關於我們 + 專欄 */}
        {/* 關於我們 */}
        <AboutSection />
        {/* 專欄 */}{' '}
        <section className='home__article container-fluid py-6 py-md-10 px-0'>
          <section className='container py-md-7'>
            <FadeIn>
              <div className='row'>
                <div className='col-lg-4 my-auto'>
                  <ContentCard
                    hasBorde
                    subTitle='YOUR INSPIRATION'
                    title='綠果專欄'
                    description={
                      <>
                        讓我們的信念透過文字，
                        <br />
                        成為你往後飲食的靈感
                      </>
                    }
                    buttonText='探索更多文章'
                    bgColor='transparent'
                    textPosition='text-center'
                    contentPadding='py-7 px-5 mt-5 mb-8 '
                    to={PageLinks.articleLink.url}
                  />
                </div>
                {/* 文章區 */}
                <div className='col-lg-8 rounded-4 bg-white shadow'>
                  <div className='row g-4 d-flex px-3 px-md-5 py-3 py-md-6 rounded-3'>
                    {/* 主文章 */}
                    <div className='col-lg-7'>
                      <p className='fs-4 fs-md-3 fw-semibold py-5 align-items-start mb-0'>
                        <i className='bi bi-fire text-error mx-1'></i>Fresh Pick
                      </p>
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
                              <p className='fs-5 card-title fw-bold mb-5 text-gray-600'>
                                {mainArticle.title}
                              </p>
                              <p className='card-text text-brown-300 mb-5 '>
                                {/* 限制文章顯示字數 */}
                                {mainArticle.description
                                  ? mainArticle.description.length > 50
                                    ? mainArticle.description.substring(0, 50) +
                                      '...'
                                    : mainArticle.description
                                  : '暫無內容'}
                              </p>
                              <div className='d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center w-100'>
                                <p className='text-brown-300 d-block mb-0'>
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
                                <button
                                  type='button'
                                  className='home__btn-link'
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
                              </div>
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>
                    {/* 文章卡片*/}
                    <div className='col-lg-5'>
                      <p className='fs-5 fs-md-4 text-gray-600 fw-semibold py-5 align-items-start mb-0'>
                        <i className='bi bi-bookmark-star text-brown-300 mx-1'></i>
                        Editor's Picks
                      </p>
                      {subArticles.map((article) => (
                        <div
                          key={article.id}
                          className='pickUp-card border-start border-1 border-brown-100 rounded-4 overflow-hidden px-6 py-4 px-md-4 py-md-2 mb-5'
                        >
                          <div className='d-flex flex-column align-items-start w-100'>
                            <Link
                              to={`/article/${article.id}`}
                              className='text-decoration-none'
                            >
                              <p className='fs-6 text-gray-600 fw-bold mb-2'>
                                {article.title}
                              </p>
                            </Link>
                            <div className='d-flex justify-content-between align-items-center w-100'>
                              <div className='d-flex align-items-center gap-1 flex-wrap'>
                                <p className='text-brown-300 d-block mb-0'>
                                  {formatDate(article.create_at)}‧
                                </p>
                                <div>
                                  {article.tag?.map((tag, index) => (
                                    <span
                                      key={index}
                                      className='badge bg-accent text-gray-600'
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className='d-flex justify-content-end'>
                                <Link
                                  to={`/article/${article.id}`}
                                  className='home__btn-link text-decoration-none'
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
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* 如果沒有文章 */}
                      {subArticles.length === 0 && (
                        <div className='py-3'>目前沒有更多文章</div>
                      )}
                      {/* <div className='mt-auto pt-3 text-center'>
                      <Link
                        to='/articles'
                        className='home__btn-primary text-decoration-none rounded-pill d-inline-block px-4 py-2 my-4'
                      >
                        探索更多
                      </Link>
                    </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </section>
        </section>
        {/* 顧客意見 */}
        <TestimonialSection />
      </main>
    </>
  );
}
