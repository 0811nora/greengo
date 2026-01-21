import { useEffect, useState } from "react";
import { getAdmOrders } from "../../api/ApiAdmin";

// 元件開始
export default function AdminOrder() {
  const [originOrders, setOriginOrders] = useState([]);
  const [filterType, setFilterType] = useState("all");

  // 取得 api 原始資料
  useEffect(() => {
    const getOriginOrders = async () => {
      try {
        const res = await getAdmOrders();
        setOriginOrders(res.data.orders);
        console.log(res.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getOriginOrders();
  }, []);

  // 新增訂單狀態
  const withStatusOrders = originOrders.map((order) => {
    return {
      ...order,
      order_status: order.is_paid ? "prepare" : "new",
      payment_status: order.is_paid ? "paid" : "unpaid",
    };
  });

  // 透過狀態篩選訂單
  const displayOrders = withStatusOrders.filter((order) => {
    if (filterType === "all") return true;
    return (
      filterType === order.order_status || filterType === order.payment_status
    );
  });

  // 時間戳轉換
  function changeTimeStamp_date(timeStamp) {
    const time = new Date(timeStamp * 1000);
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, "0");
    const date = String(time.getDate()).padStart(2, "0");
    return `${year}-${month}-${date}`;
  }
  function changeTimeStamp_time(timeStamp) {
    const time = new Date(timeStamp * 1000);
    const hour = String(time.getHours()).padStart(2, "0");
    const minute = String(time.getMinutes()).padStart(2, "0");
    return `${hour}:${minute}`;
  }

  // tag狀態轉換
  function renderTagStatus(status) {
    switch (status) {
      case "prepare":
        return (
          <button className="tag-button status-prepare">
            <i className="bi bi-clock-fill"> 製餐中</i>
          </button>
        );
      case "paid":
        return <span className="tag-status status-done">已付款</span>;
      case "unpaid":
        return (
          <button className="tag-button status-unpaid">
            <i className="bi bi-credit-card-2-back-fill"> 未付款</i>
          </button>
        );
      default:
        return <span className="tag-status status-new">新訂單</span>;
    }
  }

  return (
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

              {/* <button
                type="button"
                className="btn adm__button__primary md text-nowrap"
              >
                <i className="bi bi-plus-lg me-2"></i>
                新增訂單
              </button> */}
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
              {displayOrders.length === 0 ? (
                <tr>
                  <td className="border-0 text-center table-noshow" colSpan="8">
                    目前沒有符合的訂單喔！
                  </td>
                </tr>
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
                        <button className="btn">
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

        {/* <div className="row">
            <div className="col-3">
              <div className="d-flex flex-column gap-4">
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
                <button className="btn adm__glassbg w-100 filter__block">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="num">10</h5>
                      <p>目前可取餐數</p>
                    </div>
                    <i className="bi bi-check2-circle"></i>
                  </div>
                </button>
                <button className="btn adm__glassbg w-100 filter__block">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="num">10</h5>
                      <p>目前製作中數</p>
                    </div>
                    <i className="bi bi-clock"></i>
                  </div>
                </button>
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
                    <i class="bi bi-credit-card-2-back"></i>
                  </div>
                </button>
              </div>
            </div>
            <div className="col-9">
              <div className="content adm__glassbg">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">訂單時間</th>
                      <th scope="col">取餐號碼</th>
                      <th scope="col">訂購者</th>
                      <th scope="col">電話</th>
                      <th scope="col">訂單金額</th>

                      <th scope="col">訂單狀態</th>
                      <th scope="col">交易狀態</th>
                      <th scope="col">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayOrders.map((order) => {
                      return (
                        <tr key={order.id}>
                          <td>{changeTimeStamp(order.create_at)}</td>
                          <td>{order.user.tel.slice(-4)}</td>
                          <td>{order.user.name}</td>
                          <td>{order.user.tel}</td>

                          <td>{`$${order.total}`}</td>

                          <td>
                            <button className="btn">
                              {order.status ? "新訂單" : "未設定"}
                            </button>
                          </td>
                          <td>
                            <button className="btn">
                              {order.is_paid ? "已付款" : "未付款"}
                            </button>
                          </td>
                          <td>
                            <button className="btn">
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
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>  */}
      </div>
    </main>
  );
}
