import { useEffect, useMemo, useState } from "react";
import { getAdmOrders } from "../../api/ApiAdmin";

export default function AdminOrder() {
  const [originOrders, setOriginOrders] = useState([]);
  const [filterType, setFilterType] = useState("all");

  const displayOrders = useMemo(() => {
    if (filterType === "unpaid") {
      return originOrders.filter((order) => !order.is_paid);
    }
    if (filterType === "all") {
      return originOrders;
    }
  }, [originOrders, filterType]);

  // 取得 api 原始資料
  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await getAdmOrders();
        setOriginOrders(res.data.orders);
        console.log(res.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getOrders();
  }, []);

  // 新增訂單狀態
  const orders = useMemo(() => {
    return originOrders.map((order) => ({
      ...order,
      status: order.is_paid ? "prepare" : "new",
    }));
  }, [apiData]);

  function changeTimeStamp(timeStamp) {
    const time = new Date(timeStamp * 1000);
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, "0");
    const date = String(time.getDate()).padStart(2, "0");
    const hour = time.getHours();
    const minute = time.getMinutes();
    return `${year}-${month}-${date} ${hour}:${minute}`;
  }

  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    fetchOrders().then(setApiData);
  }, []);

  return (
    <main className=" container-fluid px-0">
      <div className="order-page ">
        <div className="header">
          <div className="d-flex justify-content-between align-items-center mb-4 px-3">
            <div>
              <h1 className="title">今日訂單</h1>
            </div>
            <div className="d-flex align-items-center gap-2">
              {/* <div className="position-relative">
                <i className="bi bi-search adm__text__icon search-bar__icon"></i>
                <input
                  type="text"
                  className="form-control adm__input search-bar"
                  placeholder="搜尋所有訂單"
                />
              </div> */}

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
                className="btn adm__block__glassbg w-100 filter__block"
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
              <button className="btn adm__block__glassbg w-100 filter__block">
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
              <button className="btn adm__block__glassbg w-100 filter__block">
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
                className="btn adm__block__glassbg w-100 filter__block"
                onClick={() => {
                  setFilterType("unpaid");
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="num">10</h5>
                    <p>目前未付款數</p>
                  </div>
                  <i className="bi bi-currency-dollar"></i>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="content adm__block__glassbg">
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
    </main>
  );
}
