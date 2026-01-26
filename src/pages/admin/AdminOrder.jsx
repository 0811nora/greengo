import { useEffect, useState } from "react";
import { getAdmOrders } from "../../api/ApiAdmin";
import AdmOrderEmpty from "../../components/AdmOrderEmpty";
import AdmOrderLoading from "../../components/AdmOrderLoading";
import AdmOrderDetailModal from "../../components/AdmOrderDetailModal";

export default function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [specificOrder, setSpecificOrder] = useState(null);

  // 取得 api 原始資料，新增訂單和付款狀態
  useEffect(() => {
    const getApiOrders = async () => {
      try {
        const res = await getAdmOrders();
        console.log(res.data);
        let order_status_value;
        const withStatusOrders = res.data.orders.map((order) => {
          if (order.paid_date) {
            if (Date.now() - order.paid_date * 1000 >= 900000) {
              order_status_value = "ready";
            } else {
              order_status_value = "prepare";
            }
          } else {
            order_status_value = "new";
          }

          return {
            ...order,
            order_status: order_status_value,
            payment_status: order.is_paid ? "paid" : "unpaid",
          };
        });
        setOrders(withStatusOrders);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    getApiOrders();
  }, []);

  // 透過狀態篩選，決定訂單列表的渲染
  const displayOrders = orders.filter((order) => {
    if (filterType === "all") return true;
    return (
      filterType === order.order_status || filterType === order.payment_status
    );
  });
  const changeTimeStamp_date = (timeStamp) => {
    const time = new Date(timeStamp * 1000);
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, "0");
    const date = String(time.getDate()).padStart(2, "0");
    return `${year}-${month}-${date}`;
  };
  const changeTimeStamp_time = (timeStamp) => {
    const time = new Date(timeStamp * 1000);
    const hour = String(time.getHours()).padStart(2, "0");
    const minute = String(time.getMinutes()).padStart(2, "0");
    return `${hour}:${minute}`;
  };
  const renderTagStatus = (status) => {
    switch (status) {
      case "prepare":
        return <span className="tag status-prepare">製餐中</span>;
      case "ready":
        return (
          <span className="tag status-ready">
            <i className="bi bi-check-circle-fill"> 可取餐</i>
          </span>
        );
      case "done":
        return <span className="tag status-done">已取貨</span>;
      case "paid":
        return <span className="tag status-done">已付款</span>;
      case "unpaid":
        return (
          <span className="tag status-unpaid">
            <i className="bi bi-credit-card-2-back-fill"> 未付款</i>
          </span>
        );
      default:
        return <span className="tag status-new">新訂單</span>;
    }
  };
  const handleOpenSpecificOrder = (order) => {
    setOpenDetailModal(true);
    setSpecificOrder(order);
  };

  // 點擊tag狀態轉換
  // function changeTagStatus(id, status) {
  //   switch (status) {
  //     case "prepare":
  //       setOriginOrders((preOrders) => {
  //         return preOrders.map((order) =>
  //           order.id === id ? { ...order, order_status: "ready" } : order,
  //         );
  //       });
  //       break;
  //     case "ready":
  //       setOriginOrders((preOrders) => {
  //         return preOrders.map((order) =>
  //           order.id === id ? { ...order, order_status: "done" } : order,
  //         );
  //       });
  //       break;
  //   }
  // }

  return (
    <>
      <main className=" container-fluid px-0 ">
        <div className="order-page">
          <div className="header">
            <div className="d-flex justify-content-between align-items-center mb-4 px-3">
              <div className="d-flex align-items-center">
                <h1 className="title me-3">今日訂單</h1>
                <p className="history disable">/ 全部訂單</p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="position-relative">
                  <i className="bi bi-search adm__text__icon search-bar__icon"></i>
                  <input
                    type="text"
                    className="form-control adm__input search-bar"
                    placeholder="搜尋所有訂單"
                  />
                </div>

                <button
                  type="button"
                  className="btn adm__button__primary md text-nowrap"
                >
                  <i className="bi bi-plus-lg me-2"></i>
                  新增訂單
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <button
                  className="btn adm__glassbg w-100 filter__block"
                  onClick={() => {
                    setFilterType("all");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="num">10</h5>
                      <p>目前所有訂單數</p>
                    </div>
                    <i className="bi bi-box2-fill"></i>
                  </div>
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn adm__glassbg w-100 filter__block"
                  onClick={() => {
                    setFilterType("ready");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="num">10</h5>
                      <p>目前可取餐數</p>
                    </div>
                    <i className="bi bi-check2-circle"></i>
                  </div>
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn adm__glassbg w-100 filter__block"
                  onClick={() => {
                    setFilterType("prepare");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="num">10</h5>
                      <p>目前製作中數</p>
                    </div>
                    <i className="bi bi-clock"></i>
                  </div>
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn adm__glassbg w-100 filter__block"
                  onClick={() => {
                    setFilterType("unpaid");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="num">10</h5>
                      <p>目前未付款數</p>
                    </div>
                    <i className="bi bi-credit-card-2-back"></i>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="content adm__glassbg">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">訂單時間</th>
                  <th scope="col">取餐號</th>
                  <th scope="col">訂購者</th>
                  <th scope="col">電話</th>
                  <th scope="col">金額</th>

                  <th scope="col">訂單狀態</th>
                  <th scope="col">交易狀態</th>
                  <th scope="col">操作</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <AdmOrderLoading />
                ) : displayOrders.length === 0 ? (
                  <AdmOrderEmpty />
                ) : (
                  displayOrders.map((order) => {
                    return (
                      <tr key={order.id}>
                        <td>
                          <span className="date">
                            {changeTimeStamp_date(order.create_at)}
                          </span>
                          <span className="time">
                            {changeTimeStamp_time(order.create_at)}
                          </span>
                        </td>
                        <td>{order.user.tel.slice(-4)}</td>
                        <td>{order.user.name}</td>
                        <td>{order.user.tel}</td>

                        <td>{`$${order.total}`}</td>

                        <td>{renderTagStatus(order.order_status)}</td>
                        <td>{renderTagStatus(order.payment_status)}</td>
                        <td>
                          <button
                            className="btn"
                            onClick={() => handleOpenSpecificOrder(order)}
                          >
                            <i className="bi bi-eye-fill"></i>
                          </button>
                          <button className="btn">
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button className="btn">
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {openDetailModal && (
        <>
          <AdmOrderDetailModal
            order={specificOrder}
            onCloseBtn={() => setOpenDetailModal(false)}
            onBackdrop={() => setOpenDetailModal(false)}
            timeStamp_date={changeTimeStamp_date}
            timeStamp_time={changeTimeStamp_time}
            renderTagStatus={renderTagStatus}
          />
          {/* <div className="modal order-detail d-block">
            <div className="modal-dialog adm__glassbg__info adm__modal__info">
              <div className="modal-content">
                <div className="modal-header position-relative">
                  <div>
                    <h5 className="modal-title">臨櫃結帳</h5>
                    <p className="fw-medium  adm_text-primary mt-1 ">
                      -L9u44GHI3p3VsVEXGLt
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn-close modal-close-button"
                    onClick={() => setOpenDetailModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="payment-method">
                    <p className="subtitle">
                      <i className="bi bi-tag-fill me-2"></i> 選擇付款方式
                    </p>
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-4">
                          <input
                            className="d-none"
                            type="radio"
                            name="payment-method"
                            id="cash"
                          />
                          <label htmlFor="cash" className="w-100">
                            <i class="bi bi-cash"></i>現金
                          </label>
                        </div>
                        <div className="col-4">
                          <input
                            className="d-none"
                            type="radio"
                            name="payment-method"
                            id="creditCard"
                          />
                          <label htmlFor="creditCard" className="w-100">
                            <i class="bi bi-credit-card-2-back"></i>信用卡
                          </label>
                        </div>
                        <div className="col-4">
                          <input
                            className="d-none"
                            type="radio"
                            name="payment-method"
                            id="thirdParty"
                          />
                          <label htmlFor="thirdParty" className="w-100">
                            <i class="bi bi-phone"></i>第三方支付
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <div className="container-fluid">
                    <div className="d-flex justify-content-between  total-price">
                      <p>總計</p>
                      <p className="adm_text-primary ">$2000</p>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <button
                          type="button"
                          className="adm__button__tertiary lg w-100"
                        >
                          取消付款
                        </button>
                      </div>
                      <div className="col-6">
                        <button
                          type="button"
                          className="adm__button__secondary lg w-100"
                        >
                          確定付款
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="order-detail backdrop"
              onClick={() => setOpenDetailModal(false)}
            ></div>
          </div> */}
        </>
      )}

      {/* <div className="vertical">
            <div class="modal order-detail d-block">
              <div class="modal-dialog modal-lg adm__glassbg__info adm__modal__info animate__animated animate__slideInDown">
                <div class="modal-content">
                  <div class="modal-header position-relative">
                    <div>
                      <h5 class="modal-title">訂單詳情</h5>
                      <p className="fw-medium mt-1">-L9u44GHI3p3VsVEXGLt</p>
                    </div>

                    <button
                      type="button"
                      class="btn-close modal-close-button"
                      onClick={() => {
                        setOpenDetailModal(false);
                      }}
                    ></button>
                  </div>
                  <div class="modal-body d-flex">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-6">
                          <div
                            class="accordion pe-3"
                            id="accordionFlushExample"
                          >
                            <div class="accordion-item">
                              <h2 class="accordion-header">
                                <button
                                  class="accordion-button collapsed fw-medium"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#1"
                                  aria-expanded="false"
                                  aria-controls="flush-collapseOne"
                                >
                                  149自由配 - 均衡
                                  <span className="me-2 ms-auto">x 1</span>
                                  <span className="fw-bold price">$520</span>
                                </button>
                              </h2>
                              <div id="1" class="accordion-collapse collapse">
                                <div class="accordion-body">
                                  <div className="d-flex flex-column gap-1">
                                    <p>基底 : 糙米飯</p>
                                    <p>主食 : 雞胸肉</p>
                                    <p>
                                      配菜 :
                                      番茄、玉米、洋蔥、花椰菜、杏苞菇、酪梨
                                    </p>
                                    <p>醬料 : 優格醬</p>
                                  </div>
                                  <hr />
                                  <div className="d-flex flex-column gap-1">
                                    <p className="d-flex">
                                      + 酪梨
                                      <span className="ms-auto fw-medium">
                                        + $20
                                      </span>
                                    </p>
                                    <p className="d-flex">
                                      + 番茄
                                      <span className="ms-auto fw-medium">
                                        + $20
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="accordion-item">
                              <h2 class="accordion-header">
                                <button
                                  class="accordion-button collapsed fw-medium"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#2"
                                  aria-expanded="false"
                                  aria-controls="flush-collapseOne"
                                >
                                  經典雙雞蛋白碗
                                  <span className="me-2 ms-auto">x 1</span>
                                  <span className="fw-bold price">$520</span>
                                </button>
                              </h2>
                              <div id="2" class="accordion-collapse collapse">
                                <div class="accordion-body">
                                  <div className="d-flex flex-column gap-1">
                                    <p className="d-flex">
                                      + 酪梨
                                      <span className="ms-auto fw-medium">
                                        + $20
                                      </span>
                                    </p>
                                    <p className="d-flex">
                                      + 番茄
                                      <span className="ms-auto fw-medium">
                                        + $20
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="accordion-item">
                              <h2 class="accordion-header">
                                <button
                                  class="accordion-button collapsed fw-medium"
                                  type="button"
                                >
                                  日式味噌湯
                                  <span className="me-2 ms-auto">x 1</span>
                                  <span className="fw-bold price">$40</span>
                                </button>
                              </h2>
                            </div>
                            <div class="accordion-item">
                              <h2 class="accordion-header">
                                <button
                                  class="accordion-button collapsed fw-medium"
                                  type="button"
                                >
                                  無糖蕎麥烏龍​茶
                                  <span className="me-2 ms-auto">x 1</span>
                                  <span className="fw-bold price">$40</span>
                                </button>
                              </h2>
                            </div>
                          </div>
                        </div>
                        <div className="col-6 member-content">
                          <ul className="d-flex flex-column gap-3">
                            <li>
                              <p className="fw-medium">訂單時間：</p>
                              <p>2026-01-20 10:30</p>
                            </li>
                            <li>
                              <p className="fw-medium">姓名：</p>
                              <p>王小明</p>
                            </li>
                            <li>
                              <p className="fw-medium">電子郵件：</p>
                              <p>monica1209@gmail.com</p>
                            </li>
                            <li>
                              <p className="fw-medium">電話號碼：</p>
                              <p>0930-098-456</p>
                            </li>
                            <li>
                              <p className="fw-medium">付款方式：</p>
                              <p>線上-信用卡付款</p>
                            </li>
                            <li>
                              <p className="fw-medium">訂單狀態：</p>
                              <div>
                                <span className="me-3">新訂單</span>
                                <span className="me-3">|</span>
                                <span className="adm_text-danger fw-medium">
                                  未付款
                                </span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <div className="container-fluid">
                      <div className="row align-items-center">
                        <div className="col-6">
                          <div className="pe-3">
                            <div className="d-flex justify-content-between  total-price">
                              <p>總計</p>
                              <p className="adm_text-primary ">$2000</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-6 d-flex gap-2 justify-content-between">
                          <button
                            type="button"
                            class="status-done lg w-50"
                            data-bs-dismiss="modal"
                          >
                            <i class="bi bi-check-circle-fill"></i> 領取餐點
                          </button>
                          <button
                            type="button"
                            class="adm__button__secondary lg w-50"
                          >
                            <i class="bi bi-credit-card-2-back-fill"></i>{" "}
                            臨櫃結帳
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="order-detail backdrop animate__animated animate__fadeIn"
                onClick={() => {
                  setOpenDetailModal(false);
                }}
              ></div>
            </div>
          </div> */}
    </>
  );
}
