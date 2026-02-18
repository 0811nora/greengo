import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder, postPay } from '../api/ApiClient';
import Loader from '../components/common/Loading';
import { notify } from './../components/Notify';
import { ConfirmModal } from '../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import { PageSwitch } from '../components/common/AnimationWrapper';
import DonutPFC from '../components/custom-comp/PFC_Chart';
import { p } from 'framer-motion/client';

const Payment = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [orderProducts, setProducts] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const navigate = useNavigate();
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // const handleClose = () => {
  //   alert('關閉modal');
  //   setIsShowModal(false);
  // };

  const getPayOrder = async () => {
    setIsLoading(true);
    try {
      const response = await getOrder(orderId);
      setOrderData(response.data.order);
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

  if (!orderData) {
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
            <i className="bi bi-credit-card-2-front me-2 text-orange-500"></i>
            信用卡付款
          </span>
        );
      case 'e_payment':
        return (
          <span>
            <i className="bi bi-phone me-2 text-orange-500"></i>電子支付
            (LinePay/街口)
          </span>
        );
      case 'cash':
        return (
          <span>
            <i className="bi bi-cash-coin me-2 text-orange-500"></i>門市臨櫃付款
          </span>
        );
      default:
        return method;
    }
  };

  const handleViewRecipe = (e, product) => {
    e.stopPropagation();

    setSelectedProduct(product);
    setShowRecipeModal(true);
    console.log('打開配方:', product.product.title);
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
              <div className="card-header bg-white py-3 border-0">
                <h5 className="mb-0 fw-bold border-start border-4 border-primary ps-3">
                  訂單資訊
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="text-muted small">訂單編號</label>
                    <div className="fw-semibold">{orderData.id}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">下單時間</label>
                    <div>{formatTimestamp(orderData.create_at)}</div>
                  </div>
                  <hr />
                  <div className="col-md-4">
                    <label className="text-muted small">取餐門市</label>
                    <div className="fw-semibold">
                      <i className="bi bi-shop me-1"></i>
                      GreenGo - 總店
                    </div>
                    <div className="small text-muted">
                      台北市中正區幸福路3號
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted small">預計取餐時間</label>
                    <div className="fw-semibold fs-5 text-orange-500">
                      <i className="bi bi-clock-history me-1"></i>
                      {formatTimestamp(orderData.create_at + 1800)}
                    </div>
                  </div>
                  <div className="col-md-4 ps-md-8">
                    <label className="text-muted small">取餐號碼</label>
                    <div className="fw-semibold fs-5 text-success">
                      {orderData?.user?.order_number}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 購買餐點明細 */}
            <div className="card payment-card-layout p-7 shadow-sm border-0 mb-4">
              <div className="card-header border-0 bg-white py-3 mb-3">
                <h5 className="mb-0 fw-bold border-start border-4 border-primary ps-3">
                  餐點明細
                </h5>
              </div>
              <div>
                {Object.values(orderData.products).map((product, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between mb-1 fs-lg-6 fw-medium border-bottom border-gray-200 pb-4 mb-4 mb-lg-7"
                  >
                    <span>
                      {product.product.title} x {product.qty}
                      {(product.product.category === 'fixed' ||
                        product.product.category === 'custom') && (
                        <button
                          className="btn btn-sm btn-outline-orange-300 ms-2 py-0 px-2 mb-1"
                          style={{ fontSize: '0.75rem', borderRadius: '20px' }}
                          onClick={(e) => handleViewRecipe(e, product)}
                        >
                          <i className="bi bi-info-circle me-1"></i>
                          明細
                        </button>
                      )}
                    </span>

                    <span className="me-md-4 text-nowrap">
                      <i className="bi bi-currency-dollar"></i>
                      {product.customizations?.final_total ||
                        product.customizations?.custom_total}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 取餐人與付款方式 */}
            <div className="card payment-card-layout p-7 shadow-sm border-0 mb-4">
              <div className="card-header bg-white py-3 border-0">
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
                        <i className="bi bi-person me-3 text-orange-500"></i>
                        {orderData?.user?.name}
                      </li>
                      <li className="mb-1">
                        <i className="bi bi-envelope me-3 text-orange-500"></i>
                        {orderData?.user?.email}
                      </li>
                      <li>
                        <i className="bi bi-telephone me-3 text-orange-500"></i>
                        {orderData?.user?.tel}
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted small mb-2">付款方式</h6>
                    <div className="alert alert-light border-0 d-flex align-items-center mb-0">
                      <div className="fw-medium text-dark ft-zh">
                        {renderPaymentMethod(orderData?.user?.payment_method)}
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
                  {orderData?.user?.final_total - orderData?.user?.addons_total}
                </span>
              </div>

              {orderData.user.addons_total > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>加購</span>
                  <span>
                    + <i class="bi bi-currency-dollar"></i>
                    {orderData?.user?.addons_total}
                  </span>
                </div>
              )}

              {orderData.user.discount > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>折扣</span>
                  <span>
                    - <i class="bi bi-currency-dollar"></i>
                    {orderData?.user?.discount}
                  </span>
                </div>
              )}

              <div className="d-flex justify-content-between my-3 pt-3 border-top border-gray-100">
                <span className="fs-5 fw-medium">總計</span>
                <span className="fs-5 fw-medium text-primary">
                  <i class="bi bi-currency-dollar"></i>
                  {orderData?.user?.final_total}
                </span>
              </div>
              {/* 付款按鈕 */}
              {orderData?.user?.payment_method === 'cash' ? (
                <p className="bg-orange-100 rounded-3 p-1 mx-auto text-center">
                  請至櫃台告知取餐號碼並完成付款
                </p>
              ) : (
                <button
                  className="btn checkout-btn"
                  onClick={handlePayment}
                  disabled={orderData.is_paid || isProcessing}
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
                      {orderData.is_paid ? (
                        '此訂單已完成付款'
                      ) : (
                        <>
                          確認付款 <i className="bi bi-arrow-right ms-1"></i>
                        </>
                      )}
                    </>
                  )}
                </button>
              )}

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
        {showRecipeModal && (
          <RecipeModal
            product={selectedProduct}
            onClose={() => setShowRecipeModal(false)}
          />
        )}
      </PageSwitch>
    </div>
  );
};

const RecipeModal = ({ product, onClose }) => {
  if (!product) return null;
  const isCustom = product.product.category === 'custom';

  const renderCustomItems = (items, mode = 'addon') => {
    if (!items || items.length === 0) return null;

    return items.map((subItem, index) => {
      const unitPrice = subItem.price || 0;

      let displayPrice = 0;

      if (mode === 'included_protein') {
        const priceDiff = Math.max(0, unitPrice - 30);
        displayPrice = priceDiff * subItem.qty;
      } else if (mode === 'included_general') {
        displayPrice = 0;
      } else {
        displayPrice = unitPrice * subItem.qty;
      }

      return (
        <span
          className="text-brown-300"
          key={index}
          style={{ marginRight: '8px' }}
        >
          {subItem.title}

          {subItem.qty > 1 && ` X${subItem.qty}`}

          {displayPrice > 0 && ` (+${displayPrice})`}

          {index < items.length - 1 && '、'}
        </span>
      );
    });
  };

  const addon = product.customizations?.addon;

  const hasAddonsContent =
    addon &&
    (addon.base?.length > 0 ||
      addon.protein?.length > 0 ||
      addon.sauce?.length > 0 ||
      addon.side?.length > 0 ||
      addon.drinks?.length > 0 ||
      addon.soup?.length > 0);

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-orange-100 border-bottom-0 p-5">
            <h5 className="modal-title fs-6">{product.product.title} 明細</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body p-6 text-gray-300 fs-sm">
            <h4
              className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-2"
            >
              <i class="bi bi-coin me-2"></i>費用明細
            </h4>
            <div
              className="text-brown-300 mb-6 px-2"
              style={{ maxWidth: '220px' }}
            >
              <p className="d-flex justify-content-between mb-1">
                <span className="me-5">原價</span>
                <span>
                  <i className="bi bi-currency-dollar"></i>
                  {product?.customizations?.plan_info?.base_price}
                </span>
              </p>
              {hasAddonsContent && (
                <p className="d-flex justify-content-between mb-1">
                  <span className="me-5">加購</span>
                  <span>
                    <i className="bi bi-currency-dollar"></i>
                    {product?.customizations?.extra_price}
                  </span>
                </p>
              )}

              <p className="d-flex justify-content-between">
                <span className="me-5">單品合計</span>
                <span>
                  <i className="bi bi-currency-dollar"></i>
                  {product?.customizations?.custom_total}
                </span>
              </p>
            </div>
            <h4
              className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-4"
            >
              <i className="bi bi-postcard-heart me-2"></i>內容物明細
              <span>{}</span>
            </h4>
            {isCustom ? (
              // 自選 Poke 的渲染邏輯
              <>
                <ul className="px-2">
                  <li className="mb-3">
                    <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                      基底
                    </span>

                    {renderCustomItems(
                      product?.customizations.included.base,
                      'included_general',
                    )}
                  </li>

                  <li className="mb-3">
                    <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                      主食
                    </span>

                    {renderCustomItems(
                      product?.customizations?.included?.protein,
                      'included_protein',
                    )}
                  </li>

                  <li className="mb-3">
                    <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                      醬料
                    </span>

                    {renderCustomItems(
                      product?.customizations?.included?.sauce,
                      'included_general',
                    )}
                  </li>

                  <li className="mb-3">
                    <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                      配菜
                    </span>

                    {renderCustomItems(
                      product?.customizations.included.side,
                      'included_general',
                    )}
                  </li>
                </ul>
                {/* 加購區 (Addons) */}

                {hasAddonsContent && (
                  <>
                    <h4
                      className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-4 mt-5"
                    >
                      <i className="bi bi-plus-circle-fill me-2"></i> 加購明細
                    </h4>
                    <ul className="px-2">
                      {addon.base?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            基底
                          </span>

                          {renderCustomItems(
                            product?.customizations.addon.base,
                            'addon',
                          )}
                        </li>
                      )}

                      {addon.protein?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            主食
                          </span>
                          {renderCustomItems(
                            product?.customizations?.addon?.protein,
                            'addon',
                          )}
                        </li>
                      )}

                      {addon.sauce?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            醬料
                          </span>

                          {renderCustomItems(
                            product?.customizations?.addon?.sauce,
                            'addon',
                          )}
                        </li>
                      )}
                      {addon?.side?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            配菜
                          </span>

                          {renderCustomItems(
                            product?.customizations?.addon?.side,
                            'addon',
                          )}
                        </li>
                      )}

                      {addon?.drinks?.length > 0 && (
                        <li className="mb-3">
                          <span>飲品：</span>

                          {renderCustomItems(
                            product?.customizations?.addon?.drinks,
                            'addon',
                          )}
                        </li>
                      )}
                      {addon?.soup?.length > 0 && (
                        <li className="mb-3">
                          <span>湯品：</span>

                          {renderCustomItems(
                            product?.customizations?.addon?.soup,
                            'addon',
                          )}
                        </li>
                      )}
                    </ul>
                  </>
                )}
              </>
            ) : (
              <>
                {product?.product.ingredients && (
                  <>
                    <ul className="px-2">
                      <li className="mb-3">
                        <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                          基底
                        </span>
                        <span>{product?.product.ingredients.base}</span>
                      </li>
                      <li className="mb-3">
                        <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                          主食
                        </span>
                        <span>{product?.product.ingredients.main}</span>
                      </li>
                      <li className="mb-3">
                        <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                          醬料
                        </span>
                        <span>{product?.product.ingredients.source}</span>
                      </li>
                      <li className="mb-5">
                        <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                          配菜
                        </span>
                        <span>{product?.product.ingredients.side}</span>
                      </li>
                    </ul>
                  </>
                )}

                {/* 加購區 (Addons) */}

                {hasAddonsContent && (
                  <>
                    <h4
                      className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-4"
                    >
                      <i className="bi bi-postcard-heart me-2"></i> 加購明細
                    </h4>
                    <ul className="px-2">
                      {addon.base?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            基底
                          </span>

                          {renderCustomItems(
                            product?.customizations.addon.base,
                            'addon',
                          )}
                        </li>
                      )}

                      {addon.protein?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            主食
                          </span>
                          {renderCustomItems(
                            product?.customizations?.addon?.protein,
                            'addon',
                          )}
                        </li>
                      )}

                      {addon.sauce?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            醬料
                          </span>

                          {renderCustomItems(
                            product?.customizations.addon.sauce,
                            'addon',
                          )}
                        </li>
                      )}
                      {addon?.side?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            配菜
                          </span>

                          {renderCustomItems(
                            product?.customizations.addon.side,
                            'addon',
                          )}
                        </li>
                      )}

                      {addon.drinks?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            飲品
                          </span>

                          {renderCustomItems(
                            product?.customizations.addon.drinks,
                            'addon',
                          )}
                        </li>
                      )}
                      {addon.soup?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            湯品
                          </span>

                          {renderCustomItems(
                            product?.customizations.addon.soup,
                            'addon',
                          )}
                        </li>
                      )}
                    </ul>
                  </>
                )}
              </>
            )}
            <h4
              className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-4 mt-5"
            >
              <i className="bi bi-pie-chart-fill me-2"></i> 單品營養素資訊
            </h4>
            <DonutPFC
              protein={product?.customizations?.total_nutrition?.protein}
              fat={product?.customizations?.total_nutrition?.fat}
              carbs={product?.customizations?.total_nutrition?.carbs}
              calories={product?.customizations?.total_nutrition?.calories}
            />
          </div>
          <div className="modal-footer border-gray-50">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
