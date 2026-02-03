import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";

// swiper
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

// API
import { getArticles } from "../api/ApiClient";

// component
import ContentCard from "../components/home/ContentCard";
import CommentCard from "../components/home/CommentCard";

// 頁面 router
const PageLinks = {
  productLink: { title: "綠果精選系列", url: "/product" },
  customLink: { title: "客製化點餐", url: "/custom" },
  aboutLink: { title: "關於綠果", url: "/about" },
  articleLink: { title: "綠果專欄", url: "/article" },
};

// Hero Section
const HERO_DECORS = [
  {
    id: "left",
    src: "/img/items/bowl-2.png",
    alt: "bowl-2",
    posX: "start-0",
    posY: "top-10",
  },
  {
    id: "right",
    src: "/img/items/bowl-1.png",
    alt: "bowl-1",
    posX: "start-100",
    posY: "top-50",
  },
];
// 果菜區
const VEGGIE_ITEMS = [
  { name: "tomato", angle: "-120deg", dist: "26vw", delay: "-2s", dur: "20s" },
  {
    name: "broccoli",
    angle: "45deg",
    dist: "26vw",
    delay: "-15s",
    dur: "25s",
  },
  { name: "cabbage", angle: "150deg", dist: "26vw", delay: "-5s", dur: "22s" },
  { name: "carrot", angle: "90deg", dist: "26vw", delay: "-8s", dur: "20s" },
  {
    name: "eggplant",
    angle: "-45deg",
    dist: "26vw",
    delay: "-10s",
    dur: "20s",
  },
  {
    name: "scallion",
    angle: "-90deg",
    dist: "26vw",
    delay: "-10s",
    dur: "20s",
  },
  {
    name: "spinach",
    angle: "-120deg",
    dist: "26vw",
    delay: "-4s",
    dur: "30s",
  },
  {
    name: "bellPepper",
    angle: "30deg",
    dist: "26vw",
    delay: "-8s",
    dur: "25s",
  },
];

// 痛點區
const TROUBLE_CARDS = [
  {
    id: 1,
    text: "「不是不想吃健康，而是怕一個不小心，就吃錯、算錯、白努力。」",
    align: "ms-auto",
    tailSide: "right", // 對話框右
  },
  {
    id: 2,
    text: "「一般的健康餐只有固定的營養標示，但我今天多加了一份肉、少吃一點飯，熱量到底變多少？對正在飲控的我來說，真的很難計算...」",
    align: "me-auto",
    tailSide: "left", // 對話框左
  },
  {
    id: 3,
    text: "「每次打開外送平台，看著一堆標榜『健康』的餐盒，卻發現成分寫得模模糊糊：少了幾克蛋白？多了一匙醬料？到底差多少熱量完全不知道。為什麼好好吃一餐這麼困難呢？」",
    align: "ms-auto",
    tailSide: "right",
  },
];

// 配菜區
const INGREDIENTS = [
  {
    id: "salmon",
    name: "鮭魚",
    nur: "蛋白質",
    protein: "26g",
    pos: "pos-btm-left",
    src: "/img/items/salmon.png",
  },
  // 熱量：約 250 kcal/蛋白質：約 26 g/脂肪：約 16 g
  {
    id: "tomato",
    name: "番茄",
    nur: "蛋白質",
    protein: "1.1g",
    pos: "pos-top-mid",
    src: "/img/items/tomato.png",
  },
  // 熱量：約 11 kcal/碳水化合物：約 2.5 g/膳食纖維：約 0.8 g
  {
    id: "pumpkin",
    name: "南瓜",
    nur: "蛋白質",
    protein: "1.2g",
    pos: "pos-top-mid-left",
    src: "/img/items/pumpkin.png",
  },
  // 熱量：約 45 kcal/碳水化合物：約 11 g/膳食纖維：約 2 g
  {
    id: "broccoli",
    name: "花椰菜",
    nur: "蛋白質",
    protein: "2.5g",
    pos: "pos-top-right",
    src: "/img/items/broccoli.png",
  },
  // 熱量：約 28 kcal/碳水化合物：約 5 g/蛋白質：約 2.5 g/膳食纖維：約 2.2 g
  {
    id: "cucumber",
    name: "小黃瓜",
    nur: "蛋白質",
    protein: "0.7g",
    pos: "pos-btm-right",
    src: "/img/items/cucumber.png",
  },
  // 熱量：約 9 kcal/碳水化合物：約 2 g
];

// 餐點卡片區
// 模擬資料，待接 API
const FIXED_PRODUCTS = [
  {
    id: 1,
    name: "經典雙雞蛋白碗",
    price: 230,
    kcal: 550,
    img: "/img/items/bowl-3.png",
    tags: ["豐富蛋白質", "輕盈低卡", "優質油脂"],
    rank: "TOP1",
  },
  {
    id: 2,
    name: "經典雙雞蛋白碗",
    price: 230,
    kcal: 550,
    img: "/img/items/bowl-3.png",
    tags: ["豐富蛋白質", "輕盈低卡", "優質油脂"],
    rank: "TOP2",
  },
  {
    id: 3,
    name: "經典雙雞蛋白碗",
    price: 230,
    kcal: 550,
    img: "/img/items/bowl-3.png",
    tags: ["豐富蛋白質", "輕盈低卡", "優質油脂"],
    rank: "TOP3",
  },
  {
    id: 4,
    name: "經典雙雞蛋白碗",
    price: 230,
    kcal: 550,
    img: "/img/items/bowl-3.png",
    tags: ["豐富蛋白質", "輕盈低卡", "優質油脂"],
    rank: "TOP4",
  },
  {
    id: 5,
    name: "經典雙雞蛋白碗",
    price: 230,
    kcal: 550,
    img: "/img/items/bowl-3.png",
    tags: ["豐富蛋白質", "輕盈低卡", "優質油脂"],
    rank: "TOP5",
  },
];

// 步驟區
const STEP_CARDS = [
  {
    id: 1,
    step_title: "選擇基底",
    step_content: "白米、糙米、紫米、藜麥、生菜",
  },
  {
    id: 2,
    step_title: "挑選主食",
    step_content: "雞胸肉、牛肉、鮭魚、蝦仁，為你包山包海",
  },
  {
    id: 3,
    step_title: "搭配蔬果",
    step_content: "配角可以比主角搶戲，季節時蔬任選 5 種",
  },
  { id: 4, step_title: "淋上醬汁", step_content: "為你的餐盒來點靈魂" },
];

export default function Home() {
  // 監聽區
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // 文章 API
  // 用時間排序 sort 去取最新 4 片文章
  // main article
  const [mainArticle, setMainArticle] = useState(null);
  // sub article
  const [subArticles, setSubArticles] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 文章
  useEffect(() => {
    const getAllArticles = async (page = 1) => {
      try {
        const res = await getArticles(page);
        console.log("文章 API 資料：", res.data.articles);
        const allArticles = res.data.articles;
        const sortedArticles = [...allArticles].sort(
          (a, b) => b.create_at - a.create_at,
        );
        if (sortedArticles.length > 0) {
          setMainArticle(sortedArticles[0]);
          setSubArticles(sortedArticles.slice(1, 4));
        }
      } catch (err) {
        console.log(err);
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
      <main className="container-fluid p-0">
        {/* Hero Section */}
        <section className="container-fluid position-relative overflow-hidden">
          {/* 文字區 */}
          <div className="home__hero-section py-8 py-md-10 my-md-10 text-center">
            <h1 className="fs-2 display-md-1 fw-bold text-center mb-7">
              生活<span className="comma">，</span>
              <br />從<span className="text-primary">好好吃飯</span>
              開始
            </h1>
            <p className="ft-en mb-2">Elevate Your Day, Nourish Your Body.</p>
            <p className="mb-3 mb-md-5">
              綠果相信，每一次的選擇都值得被用心對待
            </p>
            <NavLink
              to={PageLinks.productLink.url}
              className="home__btn-primary fw-medium"
            >
              立即點餐
            </NavLink>
          </div>

          {/* 裝飾區 */}
          {/* 左右圖 */}
          {HERO_DECORS.map((decor) => (
            <div
              key={decor.id}
              className={`position-absolute ${decor.posY} ${decor.posX} translate-middle`}
            >
              <img className="hero__decor" src={decor.src} alt={decor.alt} />
              <div className="bowl-shadow"></div>
            </div>
          ))}
          {/* 中央碗 */}
          <div className="hero__decorations position-absolute top-100 start-50 translate-middle pt-10">
            <img
              src="/img/items/bowl-3.png"
              className="position-relative"
              alt="bowl-3"
            />
            <div className="bowl-shadow"></div>
            {/* 果菜區 */}
            {VEGGIE_ITEMS.map((item) => (
              <img
                key={item.name}
                src={`/img/items/${item.name}.png`}
                className="veggie"
                alt={item.name}
                style={{
                  "--a": item.angle,
                  animationDelay: item.delay,
                  animationDuration: item.dur,
                }}
              />
            ))}
          </div>
        </section>
        {/* Smart Nutrition */}
        <section className="container-fluid home__nur-section py-8 py-md-10 ">
          <div className="container py-5 ">
            <div className="row">
              {/* 說明 */}
              <div className="col-md-7 mb-5">
                <h4 className="text-gray-200 fs-6 fs-md-4 fw-semibold mb-2">
                  YOUR NUTRITION, DECODED
                </h4>
                <h2 className="fs-3 fs-md-1 fw-bold mb-2 mb-md-5">
                  拒絕盲吃！
                  <br />
                  營養成分，
                  <span className="">即時看得見</span>。
                </h2>
                <p className="mb-3 mb-md-6">
                  <span className="ft-en">GreenGo</span> 就像你的
                  <span className="text-primary-300 fw-medium">專屬營養師</span>
                  。
                </p>
                <p className="mb-3 mb-md-6">
                  選擇
                  <NavLink
                    className="home__btn-link fw-medium mx-1"
                    to={PageLinks.productLink.url}
                  >
                    {PageLinks.productLink.title}
                  </NavLink>
                  ，
                  <br />
                  綠果提供主廚的精心搭配，為你的營養把關！
                </p>
                <p className="mb-3 mb-md-6">
                  選擇
                  <NavLink
                    className="home__btn-link fw-medium mx-1"
                    to={PageLinks.customLink.url}
                  >
                    {PageLinks.customLink.title}
                  </NavLink>
                  ，
                  <br />
                  綠果自動計算總熱量與三大營養素比例， 營養隨選隨見！
                </p>
              </div>
              {/* 過去的困擾 */}
              <div
                ref={sectionRef}
                className="col-md-5 d-flex flex-column gap-4"
              >
                {TROUBLE_CARDS.map((card) => (
                  <div
                    key={card.id}
                    className={`sub-card bg-gray-50 rounded-4 position-relative py-3 px-4 py-md-5 px-md-6 ${card.align} ${isVisible ? "is-visible" : ""}`}
                  >
                    <p className="text-warning fw-medium mb-1">過去的困擾</p>
                    <p className="mb-0">{card.text}</p>
                    <svg
                      className="position-absolute"
                      width="20"
                      height="20"
                      style={{
                        bottom: "-15px",
                        [card.tailSide]: "20px",
                      }}
                    >
                      <path d="M0,0 L20,0 L10,20 Z" fill="#F2F4F3" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* 精選區 */}
        <section className="home__signature-section container-fluid">
          {/* 示意區 */}
          <div className="container">
            <div className="row align-items-center">
              {/* 左邊示意區 */}
              <div className="col-lg-7 d-none d-sm-flex visual-area my-8 my-md-10">
                {/* 碗 */}
                <div className="main-bowl-container">
                  <img
                    src="/img/items/bowl-5.png"
                    alt="bowl-5"
                    className="main-bowl-img"
                  />
                  {/* 配菜區 */}
                  {INGREDIENTS.map((item) => (
                    <div
                      key={item.id}
                      className={`ingredient-card ${item.pos}`}
                    >
                      <img src={item.src} alt={item.id} />
                      <div className="macro-badge">
                        {item.nur} {item.protein}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* 右邊文字區 */}
              <div className="col-lg-5">
                <ContentCard
                  subTitle="SIGNATURE BOWLS"
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
                  buttonText="查看精選菜單"
                  to={PageLinks.productLink.url}
                />
              </div>
            </div>
          </div>
        </section>
        {/* 熱門商品 + swiper 套件*/}
        <section className="bg-white">
          <div className="container py-8 py-md-10">
            <div className="row">
              <Swiper
                className="fixed-swiper"
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
                  paddingBottom: "10px",
                  paddingLeft: "80px",
                  paddingRight: "80px",
                }}
              >
                {/* 待調整 */}
                {FIXED_PRODUCTS.map((product) => (
                  <SwiperSlide key={product.id}>
                    <div className="home__fixed-card h-100">
                      <div className="position-relative overflow-hidden rounded-3">
                        {product.rank && (
                          <span className="badge rounded-pill bg-success position-absolute top-0 start-0 mt-2 ms-2 z-3">
                            {product.rank}
                          </span>
                        )}
                        <button
                          type="button"
                          className="btn-add-cart position-absolute bottom-0 end-0 mb-2 me-2 z-3"
                          aria-label="加入購物車"
                        >
                          <i className="bi bi-bag"></i>
                        </button>
                        <img
                          src={product.img}
                          className="card-img-top object-fit-cover"
                          alt={product.name}
                        />
                      </div>
                      <div className="card-body mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h5 className="fs-6 fs-md-5 fw-bold mb-0">
                            {product.name}
                          </h5>
                          <span className="ft-en fs-6 fs-md-5 fw-bold">
                            ${product.price}
                          </span>
                        </div>
                        <p className="ft-en fw-medium text-gray-300 mb-3">
                          {product.kcal} kcal
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                          {product.tags.map((item, index) => (
                            <span key={index} className="tag-item">
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
        {/* 自由配 */}
        <section
          className="position-relative my-5"
          style={{ paddingTop: "80px" }}
        >
          <img
            src="/img/items/custom-bowl.png"
            className="position-absolute top-0 start-50 translate-middle-x"
            style={{
              maxWidth: "600px",
              width: "80%",
              maxHeight: "400px",
              opacity: "0.5",
            }}
            alt="custom-bowl"
          />
          <div className="container">
            <div className="row">
              {/* 左側卡片介紹 */}
              <div className="col-lg-6">
                <ContentCard
                  subTitle="MAKE YOUR BITE"
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
                  buttonText="前往客製化點餐"
                  to={PageLinks.customLink.url}
                />
              </div>
              {/* 右側卡片說明 */}
              {/* <ul className="col-lg-6 d-flex flex-column justify-content-center makeBite-section">
                <li className="d-flex align-items-center">
                  <span className="ft-en fs-4 fs-md-2 fw-medium text-brown-200 ms-1 me-4">
                    1
                  </span>
                  <span className="fs-6 fs-md-4 fw-bold text-gray-500 me-3">
                    選擇基底
                  </span>
                  <span className="text-gray-400">
                    白米、糙米、紫米、藜麥、生菜
                  </span>
                </li>
                <li className="d-flex align-items-center">
                  <span className="ft-en fs-4 fs-md-2 fw-medium text-brown-200 me-3">
                    2
                  </span>
                  <span className="fs-6 fs-md-4 fw-bold text-gray-500 me-3">
                    挑選主食
                  </span>
                  <span className="text-gray-400">
                    雞胸肉、牛肉、鮭魚、蝦仁，為你包山包海
                  </span>
                </li>
                <li className="d-flex align-items-center">
                  <span className="ft-en fs-4 fs-md-2 fw-medium text-brown-200 me-3">
                    3
                  </span>
                  <span className="fs-6 fs-md-4 fw-bold text-gray-500 me-3">
                    搭配蔬果
                  </span>
                  <span className="text-gray-400">
                    配角可以比主角搶戲，季節時蔬任選 5 種
                  </span>
                </li>
                <li className="d-flex align-items-center">
                  <span className="ft-en fs-4 fs-md-2 fw-medium text-brown-200 me-3">
                    4
                  </span>
                  <span className="fs-6 fs-md-4 fw-bold text-gray-500 me-3">
                    淋上醬汁
                  </span>
                  <span className="text-gray-400">為你的餐盒來點靈魂</span>
                </li>
              </ul> */}
              <Swiper
                className="col-lg-6 step-card"
                modules={[Pagination, A11y]}
                spaceBetween={24}
                slidesPerView={1.2}
                centeredSlides={true}
                pagination={{ clickable: true }}
              >
                {/* 待調整 */}
                {STEP_CARDS.map((item) => (
                  <SwiperSlide key={item.id}>
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="ft-en fs-4 fs-md-2 fw-medium text-accent-200 ms-1 me-4">
                        {item.id}
                      </span>
                      <span className="fs-6 fs-md-4 fw-bold text-gray-500 me-3">
                        {item.step_title}
                      </span>
                      <span className="text-gray-400">{item.step_content}</span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
        {/* 關於我們 + 專欄 */}
        <section className="container-fulid bg-primary-100">
          {/* 關於我們 */}
          <section className="container-fluid bg-primary-100 py-7 overflow-hidden">
            <div className="container position-relative">
              <div className="row align-items-center">
                <div className="col-md-6 position-relative">
                  <img
                    src="/img/items/bowl-5.png"
                    alt="bowl"
                    className="position-absolute start-0 top-50 translate-middle-y"
                    style={{ width: "80%", left: "-20%" }}
                  />
                </div>
                {/* 文字區 */}
                <div className="col-md-6 col-lg-4">
                  <ContentCard
                    subTitle="OUR BELIEF"
                    title="綠果的堅持"
                    description={
                      <>
                        我們深信，真正的健康不應是道難題。
                        <br />
                        這份信念，驅使著綠果的每一步。
                      </>
                    }
                    buttonText="聽聽我們的故事"
                    to={PageLinks.aboutLink.url}
                  />
                </div>
              </div>
            </div>
          </section>
          {/* 專欄 */}
          <section className="container py-7">
            <div className="row">
              <div className="col-lg-4 mb-5 mb-lg-0">
                <ContentCard
                  subTitle="YOUR INSPIRATION"
                  title="綠果專欄"
                  description={
                    <>
                      讓我們的信念透過文字，
                      <br />
                      成為你往後飲食的靈感
                    </>
                  }
                  buttonText="看看我們的文章"
                  to={PageLinks.articleLink.url}
                />
              </div>
              {/* 文章區 */}
              <div className="col-lg-8">
                <div className="row g-4">
                  {/* 主文章 */}
                  <div className="col-md-7">
                    {mainArticle && (
                      <div className="card border-0 shadow-green rounded-4 overflow-hidden h-100">
                        {mainArticle.image && (
                          <img
                            src={mainArticle.image}
                            className="card-img-top"
                            alt={mainArticle.title}
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                        )}
                        <div className="card-body px-6 py-4 d-flex flex-column align-items-start">
                          <span className="badge bg-brown-300 text-brown-100 mb-2">
                            NEW
                          </span>
                          <Link
                            to={`/article/${mainArticle.id}`}
                            className="text-decoration-none"
                          >
                            <h5 className="card-title fw-bold mb-3 text-brown-300">
                              {mainArticle.title}
                            </h5>
                          </Link>

                          <p className="card-text text-brown-300">
                            {/* 限制文章顯示字數 */}
                            {mainArticle.description
                              ? mainArticle.description.length > 50
                                ? mainArticle.description.substring(0, 50) +
                                  "..."
                                : mainArticle.description
                              : "暫無內容"}
                          </p>
                          <div className="mt-auto">
                            <p className="text-brown-300 d-block mb-2">
                              {formatDate(mainArticle.create_at)} ‧
                              {mainArticle.author} ‧
                              {mainArticle.tag?.map((tag, index) => (
                                <span
                                  key={index}
                                  className="ms-2 badge bg-brown-300 text-brown-100"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </p>
                            <Link
                              to={`/article/${mainArticle.id}`}
                              className="home__btn-link fw-bold text-decoration-none"
                            >
                              閱讀全文 <i className="bi bi-chevron-right"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 文章卡片*/}
                  <div className="col-md-5">
                    <div className="card border-0 shadow rounded-4 p-5 h-100">
                      {subArticles.map((article) => (
                        <div key={article.id} className="py-3 border-bottom">
                          <Link
                            to={`/article/${article.id}`}
                            className="text-decoration-none"
                          >
                            <h6 className="fw-bold text-brown-300">
                              {article.title}
                            </h6>
                          </Link>
                          <p className="mb-2 text-brown-300">
                            {formatDate(article.create_at)} ‧{" "}
                            {article.tag?.map((tag, index) => (
                              <span
                                key={index}
                                className="ms-2 badge bg-brown-300 text-brown-100"
                              >
                                #{tag}
                              </span>
                            ))}
                          </p>
                          <Link
                            to={`/article/${article.id}`}
                            className="home__btn-link text-decoration-none"
                          >
                            閱讀全文<i className="bi bi-chevron-right"></i>
                          </Link>
                        </div>
                      ))}

                      {/* 如果沒有文章 */}
                      {subArticles.length === 0 && (
                        <div className="py-3">目前沒有更多文章</div>
                      )}

                      <div className="mt-auto pt-3 text-center">
                        <Link
                          to="/articles"
                          className="home__btn-primary text-decoration-none rounded-pill d-inline-block px-4 py-2"
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

          <div className="container"></div>
        </section>
        {/* 顧客意見 */}
        <section>
          <div className="container-fluid my-8 my-md-10">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h4 className="text-gray-200 fs-6 fs-md-4 fw-semibold mb-2">
                TESTIMONIALS
              </h4>
              <h2 className="fs-3 fs-md-1 fw-bold mb-2 mb-md-5">
                大家的真實分享
              </h2>
              <h4 className="text-orange-300 fs-6 fs-md-4 fw-semibold mb-2">
                LOVE FROM OUR CUSTOMERS
              </h4>
            </div>
            <CommentCard
              commentContent={
                "真的很好吃！特別喜歡藜麥飯的口感，完全不乾，很Q彈～"
              }
              customer={"@ashley_dailyhealthy"}
              star={"💖💖💖"}
            />
          </div>
        </section>
      </main>
    </>
  );
}
