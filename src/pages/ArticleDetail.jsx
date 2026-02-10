import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// API
import { getArticles, getSingleArticle } from '../api/ApiClient';

// component
import Loader from '../components/common/Loading';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 取得單篇文章
  useEffect(() => {
    const getArticleById = async () => {
      setIsLoading(true);
      try {
        const res = await getSingleArticle(id);
        console.log('單篇文章資料:', res.data.article);
        setArticle(res.data.article);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    getArticleById();
  }, [id]);

  // PICK UP 文章區（取最新4篇文章）
  const [pickUpArticle, setPickUpArticle] = useState([]);
  useEffect(() => {
    const getPickUpArticles = async (page = 1) => {
      try {
        const res = await getArticles(page);
        console.log('文章 API 資料：', res.data.articles);
        const allArticles = res.data.articles;
        // 先排除當前文章
        const otherArticles = allArticles.filter((item) => item.id !== id);
        // 找相同 tag 的文章 -> 例如 ["減脂", "高蛋白"]
        const relatedArticles = otherArticles.filter((item) =>
          item.tag?.some((tag) => article?.tag?.includes(tag)),
        );
        // 如果相同標籤的文章已經找完 -> 再找沒關聯 + 最新文章
        const nonRelatedArticles = otherArticles.filter(
          (item) => !item.tag?.some((tag) => article?.tag?.includes(tag)),
        );
        const combined = [...relatedArticles, ...nonRelatedArticles].slice(
          0,
          4,
        );
        setPickUpArticle(combined);
      } catch (err) {
        console.log(err);
      }
    };
    if (article) {
      getPickUpArticles();
    }
  }, [id, article]);

  // 處理時間戳
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <>
      {' '}
      <Loader mode={'page'} show={isLoading} />
      {!article ? (
        <div className='container my-8 my-md-10 text-center'>
          正在載入文章...
        </div>
      ) : (
        <div className='container-fluid my-10'>
          <div className='container my-10 py-10'>
            <nav className='articleDetail__block mb-6'>
              <ol className='breadcrumb m-2 '>
                <li className='breadcrumb-item'>
                  <Link style={{ textDecoration: 'none' }} to='/'>
                    <span className='home__btn-link'>首頁</span>
                  </Link>
                </li>
                <li className='breadcrumb-item'>
                  <Link style={{ textDecoration: 'none' }} to='/article'>
                    <span className='home__btn-link'>專欄文章</span>
                  </Link>
                </li>
                <li className='breadcrumb-item active'>
                  <span className='text-brown-300'>{article.title}</span>
                </li>
              </ol>
            </nav>

            <div className='row justify-content-center'>
              <div className='col-lg-12'>
                <div className='articleDetail__header'>
                  <h1 className='fw-bold mb-5'>{article.title}</h1>
                  {article.image && (
                    <img
                      src={article.image}
                      className='img-fluid rounded-4 mb-5 w-100'
                      alt={article.title}
                      style={{ objectFit: 'cover', maxHeight: '400px' }}
                    />
                  )}
                </div>
                <div className='d-flex align-items-center text-gray-500 ms-2 mb-4'>
                  <span className='me-3'>{formatDate(article.create_at)}</span>
                  <span className='me-3'>作者：{article.author}</span>
                </div>
                <div className='articleDetail__block '>
                  {article.tag?.map((tag, index) => (
                    <span key={index} className='text-gray-600 m-2'>
                      <span className='fw-bold me-1'>#</span>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className='col-lg-9 px-4 py-6'>
                <div
                  className='article-content'
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
                {/* {article.content} -> 只能顯示最原始的文章(包含標籤) */}
                {/* dangerouslySetInnerHTML -> 才能顯示文章樣式 */}
              </div>
              <div className='col-lg-3 px-4 py-6 articleDetail__pickUp'>
                <h3 className='py-5'>
                  <i className='bi bi-arrow-bar-right me-1'></i>PICK UP
                </h3>
                {pickUpArticle.map((item) => (
                  <div
                    key={item.id}
                    className='pickUp-card rounded-4 overflow-hidden px-4 py-2 mb-5'
                  >
                    <div className='py-3 d-flex flex-column'>
                      <Link
                        to={`/article/${item.id}`}
                        className='text-decoration-none'
                      >
                        <h6 className='fw-bold'>{item.title}</h6>
                      </Link>
                      <p className='mb-2'>
                        {formatDate(item.create_at)} ‧{' '}
                        {item.tag?.map((tag, index) => (
                          <span
                            key={index}
                            className='ms-2 badge bg-accent text-gray-600'
                          >
                            #{tag}
                          </span>
                        ))}
                      </p>
                      <Link
                        to={`/article/${item.id}`}
                        className='home__btn-link text-decoration-none ms-auto'
                      >
                        閱讀全文<i className='bi bi-chevron-right'></i>
                      </Link>
                    </div>
                  </div>
                ))}
                <Link
                  to={`/article`}
                  className='home__btn-primary text-decoration-none mx-auto mt-5'
                >
                  探索更多文章<i className='bi bi-chevron-right'></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      ;
    </>
  );
}

export default ArticleDetail;
