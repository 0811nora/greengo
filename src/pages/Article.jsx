import { useEffect, useState} from "react";
import { getArticles, } from "../api/ApiClient"
import { Link } from "react-router-dom";
import Loader from "../components/common/Loading";
import { PageSwitch } from '../components/common/AnimationWrapper';
import InfiniteScroll from 'react-infinite-scroll-component';



export default function Article() {

  const [ articleList , setArticleList ] = useState([]);
  const [ isLoading , setIsLoading ] = useState(true);
  const [ activeTab, setActiveTab ] = useState("全部");
  const [ page , setPage ] = useState(1);
  const [ hasMore , setHasMore ] = useState();


  const articleTypeList = ["新手入門","飲食營養","增肌減脂","訓練健身","健康生活"];


  //  時間轉換顯示
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };


  const articleData = async(targetPage = 1) => {

    if(!hasMore){
      setIsLoading(true); 
    }

    try{
      const res = await getArticles(targetPage);

      const { articles , pagination } = res.data

      setArticleList((prev) => 
        pagination.current_page === 1 
          ? articles 
          : [...prev,...articles]
      )

      setPage(pagination.current_page)
      setHasMore(pagination.has_next)
      setIsLoading(false);

    }catch(err){
      console.log(err)
      setIsLoading(false);
    }
  }

  // 取得文章列表
  useEffect(()=>{
    articleData(1);
  },[])

  useEffect(() => {
      window.scrollTo(0, 0);
  }, [activeTab]);

  const loadNextPage = () => {
    if(isLoading) return;
    articleData(page + 1)
  }


    // 切換文章類別
  const handleArticleType = (e) => {
    setActiveTab(e.target.textContent);
  }

  const filteredArticles = activeTab === "全部"
    ? articleList
    : articleList.filter((item) => item['tag']?.includes(activeTab))

  const showCount = Math.floor(filteredArticles.length / 3) * 3;

  const renderTypeArticle = hasMore 
    ? filteredArticles.slice(0, showCount === 0 && filteredArticles.length > 0 ? filteredArticles.length : showCount) 
    : filteredArticles;




  return(<>
  <PageSwitch>
    <main className="article_main">

      {/* banner區 */}
      <section className="position-relative banner">
        <div className="position-absolute top-0 start-0 bg-cover w-100 h-100" ></div>

        <div className="position-relative z-1 d-flex flex-column pt-8 justify-content-center align-items-center h-100">
          <h1 className="text-white fw-bold display-lg-4  fs-2 mb-3">綠果專欄</h1>
          <p className="fs-lg-5 fs-6 text-white" style={{ letterSpacing: '2px' }}>YOUR HEALTH, DECODED.</p>
        </div>
      </section>
    
      <section className="article-nav"  >
        <ul className="  bg-gray-400 d-flex justify-content-lg-center justify-content-start align-items-center ">
          <li>
            <button className={`nav-filter-btn ${activeTab === "全部" ? "active" : ""}`} onClick={handleArticleType}>全部</button>
          </li>
          {articleTypeList.map((item)=> (
            <li key={item}>
              <button className={`nav-filter-btn ${activeTab === item ? "active" : ""}`} onClick={handleArticleType}>{item}</button>
            </li>
          ))}
        </ul>
      </section>

      



    
      <section  id="sticky-nav-bar" className="py-6">
        <div className="container py-6 py-lg-9">
          <InfiniteScroll
            dataLength={articleList.length}
            next={loadNextPage}
            hasMore={hasMore}
            loader={
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">載入中...</span>
                </div>
              </div>
            }
            >
            <div className="row row-cols-1 row-cols-lg-3 gx-0" >
              {renderTypeArticle?.map((data) => (
                <div className="col  px-4 mb-8" key={data.id}>
                  <PageSwitch nodeKey={activeTab}>
                  <div className="article-card h-100 d-flex flex-column justify-content-between">
                    <div>
                      <Link to={`/article/${data.id}`} className="stretched-link"/>
                      <div className="position-relative">
                        <img src={data.image} className="card-img-top" alt={data.title} style={{height:"200px",borderRadius: "16px 16px 0 0"}}/>
                        <div className="position-absolute bottom-0 start-0 m-2 ">
                          {data['tag'].map((i)=>(
                            <span key={i} className=" px-2 py-1 mx-2 rounded-1 bg-primary text-white shadow fs-sm"># {i}</span>
                          ))}
                        </div>
                        
                        
                      </div>
                      <div className="card-body pb-4 pt-6 px-3">
                        <h5 className="card-title mb-4 line-clamp-2">{data.title}</h5>
                        <p className="card-text line-clamp-2 text-brown-300">{data.description}</p>
                      </div>
                    </div>
                    
                    <div>
                      <hr className="my-3" />
                      <p className="text-gray-300  p-3">{data.author} 
                        <span className="px-2">|</span>
                        <span className="">{formatDate(data.create_at)}</span>
                      </p>
                    </div>
                  </div>
                  </PageSwitch>
                </div>
                
              ))}
              
              
            </div>
          </InfiniteScroll>
        </div>
      </section>
    


    </main>
      <Loader mode={"page"} show={isLoading }/> 
  </PageSwitch>
  </>
  )
}
