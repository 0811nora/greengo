function AdmOrderDetailModal({
  order,
  onCloseBtn,
  onBackdrop,
  timeStamp_date,
  timeStamp_time,
  renderTagStatus,
}) {
  console.log(order);

  const memberContent_fields = [
    {
      key: "訂單時間",
      value: (
        <>
          {timeStamp_date(order.create_at)}
          <span className="ms-2">{timeStamp_time(order.create_at)}</span>
        </>
      ),
    },
    {
      key: "取餐編號",
      value: order.user.tel.slice(-4),
    },
    {
      key: "訂單姓名",
      value: order.user.name,
    },
    {
      key: "訂單信箱",
      value: order.user.email,
    },
    {
      key: "訂單電話",
      value: order.user.tel,
    },
    {
      key: "訂單狀態",
      value: renderTagStatus(order.order_status),
    },
  ];
  const paymentContent_fields = [
    {
      key: "交易時間",
      value: order.paid_date ? (
        <>
          {timeStamp_date(order.paid_date)}
          <span className="ms-2">{timeStamp_time(order.paid_date)}</span>
        </>
      ) : (
        "-"
      ),
    },
    {
      key: "交易方式",
      value: order.payment_method ? order.payment_method : "-",
    },
    {
      key: "交易狀態",
      value: renderTagStatus(order.payment_status),
    },
  ];

  return (
    <div className="modal order-detail d-block">
      <div className="modal-dialog adm__glassbg__info adm__modal__info">
        <div className="modal-content">
          <div className="modal-header position-relative">
            <div>
              <h5 className="modal-title">訂單詳情</h5>
              <p className="fw-medium  adm_text-primary mt-1 ">{order.id}</p>
            </div>

            <button
              type="button"
              className="btn-close modal-close-button"
              onClick={onCloseBtn}
            ></button>
          </div>
          <div className="modal-body">
            <div className="member-content">
              <div className="d-flex gap-3">
                <p className="subtitle">
                  <i className="bi bi-tag-fill me-2"></i>訂單資訊
                </p>
              </div>
              <ul className="d-flex flex-column gap-3">
                {memberContent_fields.map((field, index) => (
                  <li key={index}>
                    <p className="key">{field.key}</p>
                    <p className="value">{field.value}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="payment-content">
              <div className="d-flex gap-3">
                <p className="subtitle">
                  <i className="bi bi-tag-fill me-2"></i> 交易資訊
                </p>
              </div>
              <ul className="d-flex flex-column gap-3">
                {paymentContent_fields.map((field, index) => (
                  <li key={index}>
                    <p className="key">{field.key}</p>
                    <p className="value">{field.value}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="products-content">
              <p className="subtitle">
                <i className="bi bi-tag-fill me-2"></i> 訂單內容
              </p>
              <div className="accordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed fw-medium"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#id-1"
                      aria-expanded="false"
                      aria-controls="id-1"
                    >
                      149自由配 - 均衡
                      <span className="me-2 ms-auto">x 1</span>
                      <span className="fw-bold price">$520</span>
                    </button>
                  </h2>
                  <div id="id-1" className="accordion-collapse collapse">
                    <div className="accordion-body">
                      <div className="d-flex flex-column gap-2">
                        <p>基底 : 糙米飯</p>
                        <p>主食 : 雞胸肉</p>
                        <p>配菜 : 番茄、玉米、洋蔥、花椰菜、杏苞菇、酪梨</p>
                        <p>醬料 : 優格醬</p>
                      </div>
                      <hr />
                      <div className="d-flex flex-column gap-2">
                        <p className="d-flex">
                          + 酪梨
                          <span className="ms-auto fw-medium  ">+ $20</span>
                        </p>
                        <p className="d-flex">
                          + 番茄
                          <span className="ms-auto fw-medium  ">+ $20</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed fw-medium"
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
                  <div id="2" className="accordion-collapse collapse">
                    <div className="accordion-body">
                      <div className="d-flex flex-column gap-2">
                        <p className="d-flex">
                          + 酪梨
                          <span className="ms-auto fw-medium ">+ $20</span>
                        </p>
                        <p className="d-flex">
                          + 番茄
                          <span className="ms-auto fw-medium ">+ $20</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <div className="accordion-button collapsed fw-medium">
                      日式味噌湯
                      <span className="me-2 ms-auto">x 1</span>
                      <span className="fw-bold price">$40</span>
                    </div>
                  </h2>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <div className="accordion-button collapsed fw-medium">
                      無糖蕎麥烏龍​茶
                      <span className="me-2 ms-auto">x 1</span>
                      <span className="fw-bold price">$40</span>
                    </div>
                  </h2>
                </div>
              </div>
              <div className="amount">
                <p>
                  <span>小計</span>
                  <span>1120</span>
                </p>
                <p>
                  <span>折扣</span>
                  <span>- 0</span>
                </p>
                <p className="total-price">
                  <span>總計</span>
                  <span className="adm_text-primary ">$1120</span>
                </p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <div className="container-fluid">
              <div className="row">
                <div className="col-6">
                  <button type="button" className="status-done lg w-100">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    領取餐點
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="button"
                    className="adm__button__secondary lg w-100"
                  >
                    <i className="bi bi-credit-card-2-back-fill me-2"></i>
                    臨櫃結帳
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="order-detail backdrop" onClick={onBackdrop}></div>
    </div>
  );
}

export default AdmOrderDetailModal;
