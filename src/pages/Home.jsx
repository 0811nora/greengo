import { NavLink } from "react-router-dom";

const PageLinks = {
  productLink: { title: "綠果精選系列", url: "/product" },
  customLink: { title: "客製化點餐", url: "/custom" },
};

export default function Home() {
  return (
    <>
      <main className="container-fulid">
        {/* Hero Section */}
        <section className="home__hero-section">
          <div className="hero__content d-flex flex-column justify-content-center align-items-center">
            <img
              src="../../public/img/bowl-2.png"
              className="decor-section decor-left"
              alt="bowl-2"
            />
            <img
              src="../../public/img/bowl-4.png"
              className="decor-section decor-right"
              alt="bowl-4"
            />
            <h1 className="display-1 fw-bold text-center">
              生活<span className="comma">，</span>
              <br />從<span className="text-primary">好好吃飯</span>開始
            </h1>
            <p className="ft-en ">Elevate Your Day,Nourish Your Body.</p>
            <p className="mb-3">綠果相信，每一次的選擇都值得被用心對待</p>
            <NavLink
              to={PageLinks.productLink.url}
              className="homeBtn--primary fw-medium mt-3 text-decoration-none"
            >
              立即點餐
            </NavLink>
          </div>
          <div className="hero__decorations">
            {/* 碗 */}
            <img
              src="../../public/img/bowl-1.png"
              className="decor-main"
              alt="bowl-1"
            />
            {/* 果菜區 */}
            <img
              src="../../public/img/items/tomato.png"
              className="veggie tomato"
              alt="tomato"
            />
            <img
              src="../../public/img/items/broccoli.png"
              className="veggie broccoli"
              alt="broccoli"
            />
            <img
              src="../../public/img/items/cabbage.png"
              className="veggie cabbage"
              alt="cabbage"
            />
            <img
              src="../../public/img/items/carrot.png"
              className="veggie carrot"
              alt="carrot"
            />
            <img
              src="../../public/img/items/eggplant.png"
              className="veggie eggplant"
              alt="eggplant"
            />
          </div>
        </section>
        {/* Smart Nutrition */}
        <section className="container my-5">
          <div className="row d-flex ">
            {/* 說明 */}
            <div className="col-md-7">
              <h4 className="ft-en text-gray-200 fs-6 fs-md-4 fw-semibold mb-2">
                YOUR NUTRITION, DECODED
              </h4>
              <h2 className="fs-3 fs-md-1 fw-bold mb-4">
                拒絕盲吃！
                <br />
                營養成分，
                <span className="">即時看得見</span>。
              </h2>
              <p className="mb-3">
                GreenGo 就像你的
                <span className="text-primary-300 fw-medium">專屬營養師</span>。
              </p>
              <p className="mb-3">
                選擇
                <NavLink
                  className="text-primary-300 fw-medium text-decoration-underline mx-1"
                  to={PageLinks.productLink.url}
                >
                  {PageLinks.productLink.title}
                </NavLink>
                ，
                <br />
                綠果提供主廚的精心搭配，為你的營養把關！
              </p>
              <p className="mb-3">
                選擇
                <NavLink
                  className="text-primary-300 fw-medium text-decoration-underline mx-1"
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
            <div className="col-md-5 d-flex flex-column">
              <div className="sub-card bg-gray-50 rounded-4 ms-auto position-relative p-3 ">
                <p className="text-warning fw-medium mb-1">過去的困擾</p>
                <p className="mb-0">
                  「不是不想吃健康，而是怕一個不小心，就吃錯、算錯、白努力。」
                </p>
                <svg
                  className="position-absolute"
                  width="20"
                  height="20"
                  style={{ bottom: "-15px", right: "20px" }}
                >
                  <path d="M0,0 L20,0 L10,20 Z" fill="#F2F4F3" />
                </svg>
              </div>
              <div className="sub-card bg-gray-50 rounded-4 me-auto position-relative p-3 ">
                <p className="text-warning fw-medium mb-1">過去的困擾</p>
                <p className="mb-0">
                  「一般的健康餐只有固定的營養標示，但我今天多加了一份肉、少吃一點飯，熱量到底變多少？對正在飲控的我來說，真的很難計算...」
                </p>
                <svg
                  className="position-absolute"
                  width="20"
                  height="20"
                  style={{ bottom: "-15px", left: "20px" }}
                >
                  <path d="M0,0 L20,0 L10,20 Z" fill="#F2F4F3" />
                </svg>
              </div>
              <div className="sub-card bg-gray-50 rounded-4 ms-auto position-relative p-3 ">
                <p className="text-warning fw-medium mb-1">過去的困擾</p>
                <p className="mb-0">
                  「每次打開外送平台，看著一堆標榜『健康』的餐盒，卻發現成分寫得模模糊糊：少了幾克蛋白？多了一匙醬料？到底差多少熱量完全不知道。為什麼好好吃一餐這麼困難呢？」
                </p>
                <svg
                  className="position-absolute"
                  width="20"
                  height="20"
                  style={{ bottom: "-15px", right: "20px" }}
                >
                  <path d="M0,0 L20,0 L10,20 Z" fill="#F2F4F3" />
                </svg>
              </div>
            </div>
          </div>
        </section>
        {/* SIGNATURE BOWLS */}
        <section className="home__signature-section container-fluid">
          {/* 示意區 */}
          <div className="container">
            <div className="row align-items-center">
              {/* 左邊示意區 */}
              <div className="col-lg-7 d-none d-sm-flex visual-area my-5">
                {/* 碗 */}
                <div className="main-bowl-container">
                  <img
                    src="../../public/img/bowl-5.png"
                    alt="bowl-5"
                    className="main-bowl-img"
                  />
                  <div className="ingredient-card pos-btm-left">
                    <img src="../../public/img/items/salmon.png" alt="salmon" />
                    <div className="macro-badge">蛋白質 32g</div>
                  </div>
                </div>

                {/* 食材 */}

                <div className="ingredient-card pos-top-mid">
                  <img src="../../public/img/items/tomato.png" alt="tomato" />
                  <div className="macro-badge">蛋白質 32g</div>
                </div>
                <div className="ingredient-card pos-top-mid-left">
                  <img src="../../public/img/items/pumpkin.png" alt="pumpkin" />
                  <div className="macro-badge">蛋白質 32g</div>
                </div>
                <div className="ingredient-card pos-top-right">
                  <img
                    src="/../../public/img/items/broccoli.png"
                    alt="broccoli"
                  />
                  <div className="macro-badge">蛋白質 32g</div>
                </div>
                <div className="ingredient-card pos-btm-right">
                  <img
                    src="../../public/img/items/cucumber.png"
                    alt="cucumber"
                  />
                  <div className="macro-badge">蛋白質 32g</div>
                </div>
              </div>

              {/* 右邊文字區 */}
              <div className="col-lg-3">
                <div className="content-card bg-white p-5 rounded-4">
                  <h4 className="text-gray-200 ft-en mb-2">SIGNATURE BOWLS</h4>
                  <h2 className="fw-bold mb-4">
                    綠果 <br /> 精選系列
                  </h2>
                  <p className="text-muted mb-4">
                    綠果堅持由營養團隊精心設計的黃金比例組合，
                    <br />
                    無須思考，打開就能享用一份零失誤的健康。
                  </p>
                  <NavLink
                    to={PageLinks.productLink.url}
                    className="homeBtn--primary fw-medium mt-3 text-decoration-none"
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
          <div className="container py-5  d-flex gap-2">
            <div className="row">
              {/* 待接 API */}
              <div className="col-md-3">
                {" "}
                <div className="home__fixed-card">
                  <img
                    src="../../public/img/bowl-3.png"
                    className="card-img-top"
                    alt="bowl-3"
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fs-6 fs-md-5 fw-bold">經典雙雞蛋白碗</h5>
                      <span className="ft-en fs-6 fs-md-5 fw-bold">$230</span>
                    </div>

                    <p className="ft-en fw-medium text-gray-300 mb-3">
                      550 kcal
                    </p>
                    <ul className="tag-area d-flex gap-2">
                      <li>
                        <a
                          href="#"
                          className="text-decoration-none text-secondary-200 bg-secondary-50 py-1 px-2 my-3 rounded-pill"
                        >
                          豐富蛋白質
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-decoration-none text-secondary-200 bg-secondary-50 py-1 px-2 my-3 rounded-pill"
                        >
                          輕盈低卡
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-decoration-none text-secondary-200 bg-secondary-50 py-1 px-2 my-3 rounded-pill"
                        >
                          優質油脂
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                {" "}
                <div className="home__fixed-card">
                  <img
                    src="../../public/img/bowl-3.png"
                    className="card-img-top"
                    alt="bowl-3"
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fs-6 fs-md-5 fw-bold">經典雙雞蛋白碗</h5>
                      <span className="ft-en fs-6 fs-md-5 fw-bold">$230</span>
                    </div>

                    <p className="ft-en fw-medium text-gray-300 mb-3">
                      550 kcal
                    </p>
                    <ul className="tag-area d-flex gap-2">
                      <li>
                        <a
                          href="#"
                          className="text-decoration-none text-secondary-200 bg-secondary-50 py-1 px-2 my-3 rounded-pill"
                        >
                          豐富蛋白質
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-decoration-none text-secondary-200 bg-secondary-50 py-1 px-2 my-3 rounded-pill"
                        >
                          輕盈低卡
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-decoration-none text-secondary-200 bg-secondary-50 py-1 px-2 my-3 rounded-pill"
                        >
                          優質油脂
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                {" "}
                <div className="home__fixed-card">
                  <img
                    src="../../public/img/bowl-3.png"
                    className="card-img-top"
                    alt="bowl-3"
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fs-6 fs-md-5 fw-bold">經典雙雞蛋白碗</h5>
                      <span className="ft-en fs-6 fs-md-5 fw-bold">$230</span>
                    </div>

                    <p className="ft-en fw-medium text-gray-300 mb-3">
                      550 kcal
                    </p>
                    <ul className="tag-area d-flex gap-2">
                      <li>
                        <a
                          href="#"
                          className="text-decoration-none text-secondary-200 bg-secondary-50 py-1 px-2 my-3 rounded-pill"
                        >
                          豐富蛋白質
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-decoration-none text-secondary-200 bg-secondary-50 py-1 px-2 my-3 rounded-pill"
                        >
                          輕盈低卡
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-decoration-none text-secondary-200 bg-secondary-50 py-1 px-2 my-3 rounded-pill"
                        >
                          優質油脂
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                {" "}
                <div className="home__fixed-card">
                  <img
                    src="../../public/img/bowl-3.png"
                    className="card-img-top"
                    alt="bowl-3"
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fs-6 fs-md-5 fw-bold">經典雙雞蛋白碗</h5>
                      <span className="ft-en fs-6 fs-md-5 fw-bold">$230</span>
                    </div>

                    <p className="ft-en fw-medium text-gray-300 mb-3">
                      550 kcal
                    </p>
                    <ul className="tag-area d-flex gap-2">
                      <li>
                        <a
                          href="#"
                          className="text-decoration-none text-secondary-200 bg-secondary-50 py-1 px-2 my-3 rounded-pill"
                        >
                          豐富蛋白質
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-decoration-none text-secondary-200 bg-secondary-50 py-1 px-2 my-3 rounded-pill"
                        >
                          輕盈低卡
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-decoration-none text-secondary-200 bg-secondary-50 py-1 px-2 my-3 rounded-pill"
                        >
                          優質油脂
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* MAKE YOUR BITE */}
        <section className="container">
          {/* 左側卡片介紹 */}
          {/* <div>
            <h4 className="ft-en">MAKE YOUR BITE</h4>
            <h2 className="">
              訂製自己的健康，
              <br />
              不需要複雜
            </h2>
            <p>從基底、主食到蔬菜與醬料，慢慢堆疊屬於自己的風味。</p>
            <p>健康其實不難，他只需要一點點透明與理解</p>
            <button className="">
              查看完整精選菜單 <i className="bi bi-arrow-right"></i>
            </button>
          </div> */}
          {/* 右側卡片說明 */}
          {/* <ul>
            <li>
              <i class="bi bi-1-circle"></i>選擇基底
              <span>白米、糙米、紫米、藜麥、生菜</span>
            </li>
            <li>
              <i class="bi bi-2-circle"></i>挑選主食
              <span>雞胸肉、牛肉、鮭魚、蝦仁，為你包山包海</span>
            </li>
            <li>
              <i class="bi bi-3-circle"></i>搭配蔬果
              <span>配角可以比主角搶戲，季節時蔬任選 5 種</span>
            </li>
            <li>
              <i class="bi bi-4-circle"></i>淋上醬汁
              <span>為你的餐盒來點靈魂</span>
            </li>
          </ul> */}
        </section>
        {/* OUR BELIEF YOUR INSPIRATION */}
        <section className="container">
          {/* 關於我們 */}
          {/* <div>
            <h4 className="ft-en">OUR BELIEF</h4>
            <h2 className="">了解綠果的初心與堅持</h2>
            <p>
              我們深信，真正的健康不應是道難題。 這份信念，驅使著綠果的每一步。
            </p>
            <button className="">
              聽聽我們的故事 <i className="bi bi-arrow-right"></i>
            </button>
          </div> */}
          {/* 專欄 */}
          <div>
            {/* 介紹 */}
            {/* <div className="">
              <h4 className="ft-en">YOUR INSPIRATION</h4>
              <h2 className="">綠果的靈感食刻</h2>
              <p>讓我們的信念透過文字， 成為你往後飲食的靈感</p>
            </div> */}
            {/* 文章卡片 */}
            {/* <div className="row">
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
            </div> */}
          </div>
        </section>
        <section className="container"></section>
      </main>
    </>
  );
}
