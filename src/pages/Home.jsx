import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

// swiper
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

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
    src: "/img/bowl-2.png",
    alt: "bowl-2",
    posX: "start-0",
    posY: "top-10",
  },
  {
    id: "right",
    src: "/img/bowl-1.png",
    alt: "bowl-1",
    posX: "start-100",
    posY: "top-50",
  },
];
// 果菜區
const VEGGIE_ITEMS = [
  { name: "tomato", angle: "-120deg", dist: "330px", delay: "-2s", dur: "20s" },
  {
    name: "broccoli",
    angle: "45deg",
    dist: "320px",
    delay: "-15s",
    dur: "25s",
  },
  { name: "cabbage", angle: "150deg", dist: "330px", delay: "-5s", dur: "22s" },
  { name: "carrot", angle: "90deg", dist: "320px", delay: "-8s", dur: "20s" },
  {
    name: "eggplant",
    angle: "-45deg",
    dist: "330px",
    delay: "-10s",
    dur: "20s",
  },
  {
    name: "scallion",
    angle: "-90deg",
    dist: "350px",
    delay: "-10s",
    dur: "20s",
  },
  {
    name: "spinach",
    angle: "-120deg",
    dist: "320px",
    delay: "-4s",
    dur: "30s",
  },
  {
    name: "bellPepper",
    angle: "30deg",
    dist: "330px",
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
    img: "/img/bowl-3.png",
    tags: ["豐富蛋白質", "輕盈低卡", "優質油脂"],
    rank: "TOP1",
  },
  {
    id: 2,
    name: "經典雙雞蛋白碗",
    price: 230,
    kcal: 550,
    img: "/img/bowl-3.png",
    tags: ["豐富蛋白質", "輕盈低卡", "優質油脂"],
    rank: "TOP2",
  },
  {
    id: 3,
    name: "經典雙雞蛋白碗",
    price: 230,
    kcal: 550,
    img: "/img/bowl-3.png",
    tags: ["豐富蛋白質", "輕盈低卡", "優質油脂"],
    rank: "TOP3",
  },
  {
    id: 4,
    name: "經典雙雞蛋白碗",
    price: 230,
    kcal: 550,
    img: "/img/bowl-3.png",
    tags: ["豐富蛋白質", "輕盈低卡", "優質油脂"],
    rank: "TOP4",
  },
  {
    id: 5,
    name: "經典雙雞蛋白碗",
    price: 230,
    kcal: 550,
    img: "/img/bowl-3.png",
    tags: ["豐富蛋白質", "輕盈低卡", "優質油脂"],
    rank: "TOP5",
  },
];

export default function Home() {
  // 監聽區
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }, // 元素出現20%才觸發
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    // cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <main className="container-fluid p-0">
        {/* Hero Section */}
        <section className="container-fluid position-relative overflow-hidden">
          {/* 文字區 */}
          <div className="home__hero-section py-8 py-md-10 my-md-10 text-center">
            <h1 className="fs-2 display-md-1 fw-bold text-center mb-7">
              生活<span className="comma">，</span>
              <br />從<span className="text-primary">好好吃飯</span>開始
            </h1>
            <p className="ft-en mb-2">Elevate Your Day, Nourish Your Body.</p>
            <p className="mb-8 mb-md-9">
              綠果相信，每一次的選擇都值得被用心對待
            </p>
            <NavLink
              to={PageLinks.productLink.url}
              className="home__btn-primary fw-medium text-decoration-none d-inline-block" // 建議加 d-inline-block 確保寬度正常
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
              src="../../public/img/bowl-3.png"
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
                  "--d": item.dist,
                  animationDelay: item.delay,
                  animationDuration: item.dur,
                }}
              />
            ))}
          </div>
        </section>
        {/* Smart Nutrition */}
        <section className="container my-8 my-md-10 py-5">
          <div className="row">
            {/* 說明 */}
            <div className="col-md-7 mb-5">
              <h4 className="ft-en text-gray-200 fs-6 fs-md-4 fw-semibold mb-2">
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
                <span className="text-primary-300 fw-medium">專屬營養師</span>。
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
            <div ref={sectionRef} className="col-md-5 d-flex flex-column gap-4">
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
        </section>
        {/* SIGNATURE BOWLS */}
        <section className="home__signature-section container-fluid">
          {/* 示意區 */}
          <div className="container">
            <div className="row align-items-center">
              {/* 左邊示意區 */}
              <div className="col-lg-7 d-none d-sm-flex visual-area my-8 my-md-10">
                {/* 碗 */}
                <div className="main-bowl-container">
                  <img
                    src="/img/bowl-5.png"
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
              <div className="col-lg-4 ">
                <div className="content-card bg-white">
                  <h4 className="text-gray-200 ft-en">SIGNATURE BOWLS</h4>
                  <h2 className="fw-bold">
                    綠果 <br /> 精選系列
                  </h2>
                  <p className="text-gray-300">
                    綠果堅持由營養團隊精心設計的黃金比例組合，
                    <br />
                    無須思考，打開就能享用一份零失誤的健康。
                  </p>
                  <NavLink
                    to={PageLinks.productLink.url}
                    className="home__btn-primary text-center fw-medium text-decoration-none"
                  >
                    查看精選菜單
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Best seller + swiper 套件*/}
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
        {/* MAKE YOUR BITE */}
        <section
          className="position-relative my-5"
          style={{ paddingTop: "80px" }}
        >
          <img
            src="../../public/img/custom-bowl.png"
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
                <div className=" content-card bg-white border border-1 border-gray-200 shadow">
                  <h4 className="text-gray-200 ft-en">MAKE YOUR BITE</h4>
                  <h2 className="fw-bold">
                    訂製自己的健康，
                    <br />
                    不需要複雜
                  </h2>
                  <p className="text-gray-300">
                    從基底、主食到蔬菜與醬料，慢慢堆疊屬於自己的風味。
                    <br />
                    健康其實不難，他只需要一點點透明與理解。
                  </p>
                  <NavLink
                    className="home__btn-primary fw-medium text-decoration-none"
                    to={PageLinks.customLink.url}
                  >
                    前往客製化點餐
                  </NavLink>
                </div>
              </div>
              {/* 右側卡片說明 */}
              <ul className="col-lg-6 d-flex flex-column justify-content-center makeBite-section">
                <li className="d-flex align-items-center">
                  <span className="ft-en fs-4 fs-md-2 fw-medium text-accent-200 ms-1 me-4">
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
                  <span className="ft-en fs-4 fs-md-2 fw-medium text-accent-200 me-3">
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
                  <span className="ft-en fs-4 fs-md-2 fw-medium text-accent-200 me-3">
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
                  <span className="ft-en fs-4 fs-md-2 fw-medium text-accent-200 me-3">
                    4
                  </span>
                  <span className="fs-6 fs-md-4 fw-bold text-gray-500 me-3">
                    淋上醬汁
                  </span>
                  <span className="text-gray-400">為你的餐盒來點靈魂</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
        {/* OUR BELIEF YOUR INSPIRATION */}
        <section className="container-fulid bg-primary-50">
          {/* 關於我們 */}
          <section className="container-fluid bg-primary-50 py-7 overflow-hidden">
            <div className="container position-relative">
              <div className="row align-items-center">
                <div className="col-md-6 position-relative">
                  <img
                    src="/img/bowl-5.png"
                    alt="bowl"
                    className="position-absolute start-0 top-50 translate-middle-y"
                    style={{ width: "80%", left: "-20%" }}
                  />
                </div>
                {/* 文字區 */}
                <div className="col-md-5 offset-md-1">
                  <h4 className="ft-en text-gray-200 fs-6 fw-semibold mb-2">
                    OUR BELIEF
                  </h4>
                  <h2 className="fs-1 fw-bold mb-4">綠果的堅持</h2>
                  <p className="mb-4 text-secondary">
                    我們深信，真正的健康不應是道難題。
                    <br />
                    這份信念，驅使著綠果的每一步。
                  </p>
                  <NavLink
                    to={PageLinks.aboutLink.url}
                    className="home__btn-primary text-decoration-none rounded-pill my-5"
                  >
                    聽聽我們的故事
                  </NavLink>
                </div>
              </div>
            </div>
          </section>
          {/* <div className="container py-7">
            <div className="row">
              <div className="col-md-3 d-none d-md-flex"></div>
              <div className="col-md-6">
                <img
                  src="../../public/img/bowl-5.png"
                  alt="bowl-5"
                  className="position-absolute top-50 start-0 translate-middle"
                />
                <h4 className="ft-en text-gray-200 fs-6 fs-md-4 fw-semibold mb-2">
                  OUR BELIEF
                </h4>
                <h2 className="fs-3 fs-md-1 fw-bold mb-4">綠果的初心與堅持</h2>
                <p className="mb-3">
                  我們深信，真正的健康不應是道難題。 <br />
                  這份信念，驅使著綠果的每一步。
                </p>
                <NavLink
                  to={PageLinks.aboutLink.url}
                  className="homeBtn--primary fw-medium mt-3 text-decoration-none"
                >
                  聽聽我們的故事
                </NavLink>
                <img
                  src="../../public/img/bowl-5.png"
                  alt="bowl-5"
                  className="position-absolute top-50 start-100 translate-middle"
                />
              </div>
              <div className="col-md-3 d-none d-md-flex"></div>
            </div>
          </div> */}
          {/* 專欄 */}
          <section className="container py-7">
            <div className="row">
              <div className="col-lg-4 mb-5 mb-lg-0">
                <h4 className="text-gray-200 fs-6 fw-semibold mb-2">
                  YOUR INSPIRATION
                </h4>
                <h2 className="fs-1 fw-bold mb-4">綠果的專欄</h2>
                <p className="mb-4">
                  讓我們的信念透過文字，成為你往後飲食的靈感
                </p>
                <NavLink
                  to="..."
                  className="home__btn-primary text-decoration-none rounded-pill px-4 py-2"
                >
                  看看我們的文章
                </NavLink>
              </div>

              {/* 文章區 */}
              <div className="col-lg-8">
                <div className="row g-4">
                  {/* 主文章 */}
                  <div className="col-md-7">
                    <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                      <div className="card-body p-4">
                        <span className="badge bg-yellow text-dark mb-2">
                          NEW
                        </span>
                        <h5 className="card-title fw-bold">
                          桌上的好食材：為什麼你要吃酪梨？
                        </h5>
                        <p className="card-text text-muted small">
                          5 分鐘閱讀 ‧ 健身教練指定
                        </p>
                        <a
                          href="#"
                          className="home__btn-link fw-bold text-decoration-none"
                        >
                          閱讀全文 <i className="bi bi-chevron-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* 文章卡片 */}
                  <div className="col-md-5">
                    <div className="card border-0 shadow rounded-4 p-3">
                      <div className="py-3 border-bottom">
                        <h6 className="fw-bold">如何吃的剛剛好</h6>
                        <p className=" mb-2">3 分鐘閱讀 ‧ 營養師專欄</p>
                        <a
                          href="#"
                          className="home__btn-link text-decoration-none"
                        >
                          閱讀全文
                        </a>
                      </div>
                      <button className="home__btn-primary text-decoration-none rounded-pill my-5">
                        探索更多
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="container">
            {/* 介紹 */}
            {/* <div className="">
              <h4 className="ft-en text-gray-200 fs-6 fs-md-4 fw-semibold mb-2">
                YOUR INSPIRATION
              </h4>
              <h2 className="fs-3 fs-md-1 fw-bold mb-4">綠果的靈感食刻</h2>
              <p className="mb-3">
                讓我們的信念透過文字， 成為你往後飲食的靈感
              </p>
              <NavLink
                to={PageLinks.articleLink.url}
                className="homeBtn--primary fw-medium mt-3 text-decoration-none"
              >
                看看我們的文章
              </NavLink>
            </div> */}
            {/* 文章卡片 */}
            {/* <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className="card home__art-card">
                    <img src="..." className="card-img-top" alt="..." />
                    <div className="card-body">
                      <h5 className="card-title">
                        桌上的好食材：為什麼你要吃酪梨？
                      </h5>
                      <p className="card-text">
                        <span>5 分鐘閱讀</span>．
                        <span>健身教練的減脂菜單指定</span>
                      </p>
                      <button className="">
                        閱讀全文 <i className="bi bi-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-6"></div>
              </div>
            </div> */}
          </div>
        </section>
      </main>
    </>
  );
}
