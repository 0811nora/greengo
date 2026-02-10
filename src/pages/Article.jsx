import { useEffect, useState } from "react";
import { getArticles, } from "../api/ApiClient"
import { Link } from "react-router-dom";

export default function Article() {

  const [ articleList , setArticleList ] = useState([])

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  useEffect(()=>{
    const articleData = async() => {
      try{
        const res = await getArticles();
        console.log(res.data.articles)
        console.log(res.data)
        setArticleList(res.data.articles)
      }catch(err){
        console.log(err)
      }
    }
    articleData();

  },[])


  return(<>
    <main className="article_main">

      {/* banner區 */}
      <section className="position-relative banner" >
        <div className="position-absolute top-0 start-0 bg-cover w-100 h-100" ></div>

        <div className="position-relative z-1 d-flex flex-column justify-content-center align-items-center h-100">
          <h1 className="text-white fw-bold display-4">綠果專欄</h1>
          <div className="bg-white mb-3" style={{ width: '40px', height: '2px' }}></div>
          <p className="fs-5 text-white" style={{ letterSpacing: '2px' }}>YOUR HEALTH, DECODED.</p>
        </div>
      </section>

      <section>

        <ul className="bg-gray-400 d-flex justify-content-center align-items-center">
          <li>
            <button className="nav-filter-btn">全部</button>
          </li>
          <li>
            <button className="nav-filter-btn">新手入門</button>
          </li>
          <li>
            <button className="nav-filter-btn">飲食營養</button>
          </li>
          <li>
            <button className="nav-filter-btn">增肌減脂</button>
          </li>
          <li>
            <button className="nav-filter-btn">訓練健身</button>
          </li>
          <li>
            <button className="nav-filter-btn">健康生活</button>
          </li>
          
        </ul>
      </section>



      <section>
        <div className="container py-10">
          <div className="row row-cols-3">
            {articleList.map((data) => (
              <div className="col px-4">
                <div class="article-card mb-8">
                  <Link to={`/article/${data.id}`} className="stretched-link"/>
                  <div className="position-relative">
                    <img src={data.image} class="card-img-top" alt={data.title} style={{height:"200px",borderRadius: "16px 16px 0 0"}}/>
                    <div className="position-absolute bottom-0 start-0 m-2 ">
                      {data['tag'].map((i)=>(
                        <span className=" px-2 py-1 mx-2 rounded-1 bg-primary text-white shadow fs-sm"># {i}</span>
                      ))}
                    </div>
                    
                    
                  </div>
                  <div class="card-body pb-4 pt-6 px-3">
                    <h5 class="card-title mb-4 line-clamp-2">{data.title}</h5>
                    <p class="card-text line-clamp-2 text-brown-300">{data.description}</p>
                  </div>
                  <hr className="my-3" />
                  <p className="text-gray-300 px-3">{data.author} 
                    <span className="px-2">|</span>
                    <span className="">{formatDate(data.create_at)}</span>
                  </p>
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </section>

      <div className="mx-auto">
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item">
              <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item">
              <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

  </main>
  </>
  )
}
