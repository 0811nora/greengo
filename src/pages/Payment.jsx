import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder, postPay } from '../api/ApiClient';
import Loader from '../components/common/Loading';
import { notify } from './../components/Notify';
import { ConfirmModal } from '../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import { PageSwitch} from '../components/common/AnimationWrapper';

const Payment = () => {
  const { orderId } = useParams();
  const [orderData2, setOrderData2] = useState(null);
  const [orderProducts, setProducts] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const navigate = useNavigate();

  // const handleClose = () => {
  //   alert('關閉modal');
  //   setIsShowModal(false);
  // };

  const getPayOrder = async () => {
    setIsLoading(true);
    try {
      const response = await getOrder(orderId);
      setOrderData2(response.data.order);
      setProducts(Object.values(response.data.order.products));
      console.log(response.data.order);
    } catch (error) {
      notify('error', `取得失敗:${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPayOrder();
  }, [orderId]);

  if (!orderData2) {
    return (
      <div className="d-flex justify-content-center my-10 py-10">
        <Loader mode={'page'} show={isLoading} text={'資料處理中..'} />
      </div>
    );
  }

  // 處理付款按鈕點擊
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      console.log('呼叫付款 API，訂單 ID:', orderId);
      await postPay(orderId);
      setIsShowModal(true);
    } catch (error) {
      console.error('付款失敗', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 根據付款方式顯示對應圖示或文字
  const renderPaymentMethod = (method) => {
    switch (method) {
      case 'credit_card':
        return (
          <span>
            <i className="bi bi-credit-card-2-front me-2"></i>信用卡付款
          </span>
        );
      case 'e_payment':
        return (
          <span>
            <i className="bi bi-phone me-2"></i>電子支付 (LinePay/街口)
          </span>
        );
      case 'cash':
        return (
          <span>
            <i className="bi bi-cash-coin me-2"></i>門市臨櫃付款
          </span>
        );
      default:
        return method;
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp * 1000);
    return date
      .toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace(/,/g, '');
  };

  return (
    <div className="container payment-page cart-container ">
      <PageSwitch>
      {/* 頁面標題 */}
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h2 className="fw-bold mb-3">
            <i className="bi bi-wallet2 me-2"></i>結帳付款
          </h2>
          <p className="text-muted">請確認以下資訊，完成最後付款程序</p>
        </div>
      </div>

      <div className="row g-4">
        {/* 左側：詳細資訊區 */}
        <div className="col-lg-8">
          {/* 1. 訂單識別與門市資訊 */}
          <div className="card payment-card-layout p-7 shadow-sm border-0 mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold border-start border-4 border-primary ps-3">
                訂單資訊
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="text-muted small">訂單編號</label>
                  <div className="fw-bold text-primary">{orderData2.id}</div>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small">下單時間</label>
                  <div>{formatTimestamp(orderData2.create_at)}</div>
                </div>
                <hr />
                <div className="col-md-4">
                  <label className="text-muted small">取餐門市</label>
                  <div className="fw-bold">
                    <i className="bi bi-shop me-1"></i>
                    GreenGo - 總店
                  </div>
                  <div className="small text-muted">台北市中正區幸福路3號</div>
                </div>
                <div className="col-md-4">
                  <label className="text-muted small">預計取餐時間</label>
                  <div className="fw-bold fs-5 text-success">
                    <i className="bi bi-clock-history me-1"></i>
                    {formatTimestamp(orderData2.create_at + 1800)}
                  </div>
                </div>
                <div className="col-md-4 ps-md-8">
                  <label className="text-muted small">取餐號碼</label>
                  <div className="fw-bold fs-5 text-success">
                    {orderData2?.user?.order_number}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 購買餐點明細 */}
          <div className="card payment-card-layout p-7 shadow-sm border-0 mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold border-start border-4 border-primary ps-3">
                餐點明細
              </h5>
            </div>
            <ul className="list-group list-group-flush">
              {orderProducts?.map((item) => (
                <li key={item.id} className="list-group-item py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">
                        {item.product.title}{' '}
                        <span className="text-muted small">x {item.qty}</span>
                      </div>
                      {item.add_ons && (
                        <div className="text-muted small fst-italic mt-1">
                          <i className="bi bi-plus"></i>{' '}
                          {item.customizations.addon}
                        </div>
                      )}
                    </div>
                    <div className="fw-bold">
                      <i class="bi bi-currency-dollar"></i>
                      {item.customizations.custom_total * item.qty}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. 取餐人與付款方式 */}
          <div className="card payment-card-layout p-7 shadow-sm border-0 mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold border-start border-4 border-primary ps-3">
                訂購人與付款
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3 mb-md-0">
                  <h6 className="text-muted small mb-2">訂購人資料</h6>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-1">
                      <i className="bi bi-person me-2"></i>
                      {orderData2?.user?.name}
                    </li>
                    <li className="mb-1">
                      <i className="bi bi-envelope me-2"></i>
                      {orderData2?.user?.email}
                    </li>
                    <li>
                      <i className="bi bi-telephone me-2"></i>
                      {orderData2?.user?.tel}
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted small mb-2">付款方式</h6>
                  <div className="alert alert-light border d-flex align-items-center mb-0">
                    <div className="fw-medium text-dark ft-zh">
                      {renderPaymentMethod(orderData2?.user?.payment_method)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ========================= */}
        <aside className="cart-summary col-lg-4">
          <div className="summary-card">
            <h4 className="text-primary pt-3 border-bottom border-gray-100 pb-3 mb-4">
              付款金額
            </h4>

            <div className="d-flex justify-content-between mb-2">
              <span>小計</span>
              <span>
                <i class="bi bi-currency-dollar"></i>
                {orderData2?.user?.final_total - orderData2?.user?.addons_total}
              </span>
            </div>

            {orderData2.user.addons_total > 0 && (
              <div className="d-flex justify-content-between mb-2 text-danger">
                <span>
                  {/* <i className="bi bi-ticket-perforated me-1"></i>
                  {orderData?.price_details?.discount_name} */}
                  加購
                </span>
                <span>
                  + <i class="bi bi-currency-dollar"></i>
                  {orderData2?.user?.addons_total}
                </span>
              </div>
            )}

            <div className="d-flex justify-content-between my-3 pt-3 border-top border-gray-100">
              <span className="fs-5 fw-medium">總計</span>
              <span className="fs-5 fw-medium text-primary">
                <i class="bi bi-currency-dollar"></i>
                {orderData2?.user?.final_total}
              </span>
            </div>

            {/* 付款按鈕 */}
            <button
              className="btn checkout-btn"
              onClick={handlePayment}
              disabled={orderData2.is_paid || isProcessing}
            >
              {isProcessing ? (
                <>
                  處理中...
                  <Loader
                    mode="button"
                    show={isProcessing}
                    className={'ms-2'}
                  />
                </>
              ) : (
                <>
                  {orderData2.is_paid ? (
                    '此訂單已完成付款'
                  ) : (
                    <>
                      確認付款 <i className="bi bi-arrow-right ms-1"></i>
                    </>
                  )}
                </>
              )}
            </button>

            <div className="mt-3 text-center">
              <small className="text-muted d-block">
                <i className="bi bi-info-circle me-1"></i>
                訂單已成立，請確認金額無誤
              </small>
            </div>
          </div>
        </aside>
      </div>
      <ConfirmModal
        style={'front'}
        show={isShowModal}
        closeModal={() => navigate('/')}
        text_icon={`bi bi-bag-check-fill`}
        text_title={'已完成付款'}
        text_cancel={
          <>
            <i class="bi bi-house-door-fill me-1"></i>
            回到首頁
          </>
        }
        cancelModal={() => navigate('/')}
        text_confirm={
          <>
            <i class="bi bi-list-task me-1"></i>
            確認訂單資訊
          </>
        }
        confirmModal={() => navigate('/member')}
      />
      </PageSwitch>
    </div>
  );
};

export default Payment;
