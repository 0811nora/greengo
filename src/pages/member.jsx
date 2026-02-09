import { useState, useEffect } from 'react';
import { getOrders } from '../api/ApiClient';
import Loader from '../components/common/Loading';

const Member = () => {
  const [activeTab, setActiveTab] = useState('orders'); // orders | profile
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // 取得訂單列表
  const fetchOrders = async (targetPage) => {
    setIsLoading(true);
    try {
      const res = await getOrders(targetPage);

      console.log(res.data);
      setOrders(res.data.orders || []);
      setTotalPages(res.data.pagination.total_pages || 1);
      window.scrollTo(0, 0);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert('取得失敗: ' + (error.response?.data?.message || '未知錯誤'));
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders(page);
    }
  }, [page, activeTab]);

  return (
    <div className="member-center-container bg-yellow-200">
      {isLoading ? <Loader mode={'mask'} /> : ''}
      <div className="container">
        <h1 className="fs-1 text-center fw-bold mb-8">會員中心</h1>

        {/* Tab 切換 */}
        <ul className="nav nav-tabs justify-content-center mb-9">
          <li className="nav-item">
            <button
              className={`nav-link me-7 ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              訂單紀錄
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              個人資料
            </button>
          </li>
        </ul>

        {/* 內容區塊 */}
        {activeTab === 'orders' ? (
          <div className="order-list-section">
            {orders.map((item) => (
              <OrderCard key={item.id} data={item} />
            ))}

            {/* 頁碼切換 */}
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => page > 1 && setPage(page - 1)}
                  >
                    上一頁
                  </button>
                </li>

                {/* 頁碼按鈕 */}
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${page === i + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${page === totalPages ? 'disabled' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => page < totalPages && setPage(page + 1)}
                  >
                    下一頁
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        ) : (
          <ProfileSection />
        )}
      </div>
    </div>
  );
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
    .replace(/,/g, ''); // 移除部分瀏覽器可能產生的逗號
};

// 訂單卡片子組件
const OrderCard = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const PAYMENT_STATUS_MAP = {
    paid: '已付款',
    unpaid: '未付款',
  };

  const PAYMENT_METHOD_MAP = {
    credit_card: '信用卡',
    cash: '現金',
    e_payment: '電子支付',
  };

  const handleViewRecipe = (e, product) => {
    e.stopPropagation();

    setSelectedProduct(product);
    setShowRecipeModal(true);
    console.log('打開配方:', product.product.title);
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`order-card w-100 rounded-3 p-7 mb-6 ${isOpen ? 'details-open' : ''}`}
        style={{ cursor: 'pointer' }}
      >
        <div className="d-flex justify-content-between align-items-center mb-2 card-header-info">
          <div>
            <span className="fw-semibold fs-6">
              {formatTimestamp(data.create_at)}
            </span>
            {/* <span className="status-tag">外帶</span> */}
          </div>
        </div>

        <div className="d-flex align-items-center flex-wrap">
          <span className="border-md-end border-gray-200 pe-4 me-4">
            取餐號碼 <i className="bi bi-hash text-primary"></i>
            {data.user.order_number}
          </span>
          <span className="border-md-end border-gray-200 pe-4 me-4">
            總金額：{data.user.final_total} 元
          </span>
          <span
            className={`${
              data.user.order_status === 'new'
                ? 'status-text-unpicked'
                : 'status-text-picked'
            }`}
          >
            <i
              className={`bi ${data.user.order_status === 'new' ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'} me-1`}
            ></i>
            訂單狀態：{data.user.order_status === 'new' ? '未取餐' : '可取餐'}
          </span>

          <i
            className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down text-primary'} ms-auto fs-5`}
          ></i>
        </div>

        {/* 詳細清單 */}

        <div className="order-detail-box mt-3 rounded-2">
          <div className="row mb-7 text-start">
            <div className="col-lg-4 fs-sm fs-lg-md pb-2">
              訂單編號 {data.id}
            </div>
            <div className="col-lg-4 fs-sm fs-lg-md pb-2">
              支付方式：
              {PAYMENT_METHOD_MAP[data.user.payment_method] || '其他支付'}
            </div>
            <div className="col-lg-4 fs-sm fs-lg-md">
              支付狀態：
              <span
                className={
                  data.user.payment_status === 'paid'
                    ? 'text-primary'
                    : 'text-warning'
                }
              >
                {PAYMENT_STATUS_MAP[data.user.payment_status] || '確認中'}
              </span>
            </div>
          </div>

          <div>
            {Object.values(data.products).map((product, index) => (
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

                <span>
                  <i className="bi bi-currency-dollar"></i>{' '}
                  {product.customizations?.final_total ||
                    product.customizations?.custom_total}
                </span>
              </div>
            ))}
          </div>

          <div className="text-end">
            <div className="mb-4">
              小計 <i className="bi bi-currency-dollar"></i>
              {data.user.final_total - data.user.discount}
            </div>
            <div className="mb-4">
              折扣 -<i className="bi bi-currency-dollar"></i>
              {data.user.discount}
            </div>
            <div className="fw-medium fs-6 text-primary">
              總金額 <i className="bi bi-currency-dollar"></i>
              {data.user.final_total}
            </div>
          </div>
        </div>
      </div>
      {showRecipeModal && (
        <RecipeModal
          product={selectedProduct}
          onClose={() => setShowRecipeModal(false)}
        />
      )}
    </>
  );
};

// 個人資料子組件
const ProfileSection = () => {
  return (
    <div className="profile-form bg-white p-7 rounded-3">
      <form>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">姓名</label>
            <input type="text" className="form-control" defaultValue="王小明" />
          </div>
          <div className="col-md-6">
            <label className="form-label">電話</label>
            <input
              type="text"
              className="form-control"
              defaultValue="0912-345-678"
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">電子郵件</label>
          <input
            type="email"
            className="form-control"
            defaultValue="test@example.com"
          />
        </div>
        <div className="mb-8">
          <label className="form-label">聯絡地址</label>
          <input
            type="text"
            className="form-control"
            placeholder="輸入地址"
            defaultValue="台北市大安區幸福路77號3樓"
          />
        </div>
        <div className="text-center">
          <button type="button" className="btn btn-primary px-5">
            儲存修改
          </button>
        </div>
      </form>
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
        <span key={index} style={{ marginRight: '8px' }}>
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
          <div className="modal-header bg-light">
            <h5 className="modal-title">{product.name} 配料明細</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <h4 className="fs-sm text-gray-300 mb-2 d-flex align-items-center">
              <i class="bi bi-postcard-heart me-2"></i>內容物明細
            </h4>
            {isCustom ? (
              <>
                <li>
                  <span>基底：</span>

                  {renderCustomItems(
                    product.customizations.included.base,
                    'included_general',
                  )}
                </li>

                <li>
                  <span>主食：</span>

                  {renderCustomItems(
                    product.customizations.included.protein,
                    'included_protein',
                  )}
                </li>

                <li>
                  <span>醬料：</span>

                  {renderCustomItems(
                    product.customizations.included.sauce,
                    'included_general',
                  )}
                </li>

                <li>
                  <span>配菜：</span>

                  {renderCustomItems(
                    product.customizations.included.side,
                    'included_general',
                  )}
                </li>

                {/* 加購區 (Addons) */}

                {hasAddonsContent && (
                  <>
                    <hr />
                    <h4 className="fs-sm text-gray-300 mb-2 d-flex align-items-center mt-4">
                      <i className="bi bi-postcard-heart me-2"></i> 加購選項
                    </h4>
                    <ul>
                      {addon.base?.length > 0 && (
                        <li>
                          <span>基底：</span>

                          {renderCustomItems(
                            product.customizations.addon.base,
                            'addon',
                          )}
                        </li>
                      )}

                      {addon.protein?.length > 0 && (
                        <li>
                          <span>主食：</span>
                          {renderCustomItems(
                            product.customizations.addon.protein,
                            'addon',
                          )}
                        </li>
                      )}

                      {addon.sauce?.length > 0 && (
                        <li>
                          <span>醬料：</span>

                          {renderCustomItems(
                            product.customizations.addon.sauce,
                            'addon',
                          )}
                        </li>
                      )}
                      {addon?.side?.length > 0 && (
                        <li>
                          <span>配菜：</span>

                          {renderCustomItems(
                            product.customizations.addon.side,
                            'addon',
                          )}
                        </li>
                      )}

                      {addon.drinks?.length > 0 && (
                        <li>
                          <span>飲品：</span>

                          {renderCustomItems(
                            product.customizations.addon.drinks,
                            'addon',
                          )}
                        </li>
                      )}
                      {addon.soup?.length > 0 && (
                        <li>
                          <span>湯品：</span>

                          {renderCustomItems(
                            product.customizations.addon.soup,
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
                {product.product.ingredients && (
                  <>
                    <li>
                      <span>基底：</span>
                      <span>{product.product.ingredients.base}</span>
                    </li>
                    <li>
                      <span>主食：</span>
                      <span>{product.product.ingredients.main}</span>
                    </li>
                    <li>
                      <span>醬料：</span>
                      <span>{product.product.ingredients.source}</span>
                    </li>
                    <li>
                      <span>配菜：</span>
                      <span>{product.product.ingredients.side}</span>
                    </li>
                  </>
                )}

                {/* 加購區 (Addons) */}

                {hasAddonsContent && (
                  <>
                    <hr />
                    <h4 className="fs-sm text-gray-300 mb-2 d-flex align-items-center mt-4">
                      <i className="bi bi-postcard-heart me-2"></i> 加購選項
                    </h4>
                    <ul>
                      {addon.base?.length > 0 && (
                        <li>
                          <span>基底：</span>

                          {renderCustomItems(
                            product.customizations.addon.base,
                            'addon',
                          )}
                        </li>
                      )}

                      {addon.protein?.length > 0 && (
                        <li>
                          <span>主食：</span>
                          {renderCustomItems(
                            product.customizations.addon.protein,
                            'addon',
                          )}
                        </li>
                      )}

                      {addon.sauce?.length > 0 && (
                        <li>
                          <span>醬料：</span>

                          {renderCustomItems(
                            product.customizations.addon.sauce,
                            'addon',
                          )}
                        </li>
                      )}
                      {addon?.side?.length > 0 && (
                        <li>
                          <span>配菜：</span>

                          {renderCustomItems(
                            product.customizations.addon.side,
                            'addon',
                          )}
                        </li>
                      )}

                      {addon.drinks?.length > 0 && (
                        <li>
                          <span>飲品：</span>

                          {renderCustomItems(
                            product.customizations.addon.drinks,
                            'addon',
                          )}
                        </li>
                      )}
                      {addon.soup?.length > 0 && (
                        <li>
                          <span>湯品：</span>

                          {renderCustomItems(
                            product.customizations.addon.soup,
                            'addon',
                          )}
                        </li>
                      )}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
          <div className="modal-footer">
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

export default Member;
