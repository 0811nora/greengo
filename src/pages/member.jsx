import { useState, useEffect } from 'react';
import { getOrders } from '../api/ApiClient';
import Loader from '../components/common/Loading';
import { PageSwitch } from '../components/common/AnimationWrapper';
import DonutPFC from '../components/custom-comp/PFC_Chart';

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
    <div className="member-center-container">
      <PageSwitch>
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
                <i class="bi bi-clipboard-fill me-2"></i>
                訂單紀錄
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="bi bi-person-lines-fill me-2"></i>個人資料
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
      </PageSwitch>
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
    .replace(/,/g, '');
};

// 訂單卡片子組件
const OrderCard = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
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
        className={`order-card rounded-3 px-5 py-6 p-md-7 mb-6 ${isOpen ? 'details-open' : ''}`}
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
          <div className="border-md-end border-gray-200 pe-4 me-4 mb-5 mb-md-0">
            <span className="bg-yellow-200 rounded-pill px-3 py-1 me-2">
              取餐號碼
            </span>
            <div className="d-inline">
              <i className="bi bi-hash text-primary"></i>
              <span className="fw-semibold">{data.user.order_number}</span>
            </div>
          </div>
          <div className="border-md-end border-gray-200 pe-4 me-4 mb-4 mb-md-0">
            <span className="bg-yellow-200 rounded-pill px-3 py-1 me-2">
              總金額
            </span>
            {data.user.final_total} 元
          </div>
          <div
            className={`${
              data.user.order_status === 'new'
                ? 'status-text-unpicked'
                : 'status-text-picked'
            }`}
          >
            <span className="bg-yellow-200 text-dark rounded-pill px-3 py-1 me-2">
              訂單狀態
            </span>
            {data.user.order_status === 'new' ? '餐點準備中' : '可取餐'}
            <i
              className={`bi ${data.user.order_status === 'new' ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'} ms-1`}
            ></i>
          </div>

          <i
            className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down text-primary'} ms-auto fs-5`}
          ></i>
        </div>

        {/* 詳細清單 */}

        <div className="order-detail-box mt-3 rounded-2">
          <div className="row mb-6 text-start">
            <div className="col-lg-4 fs-sm fs-lg-md pb-2 mb-2 mb-lg-0">
              <span className="bg-orange-100 rounded-pill px-3 py-1 me-2">
                訂單編號
              </span>
              {data.id}
            </div>
            <div className="col-lg-4 fs-sm fs-lg-md pb-2 mb-2 mb-lg-0">
              <span className="bg-orange-100 rounded-pill px-3 py-1 me-2">
                支付方式
              </span>

              {PAYMENT_METHOD_MAP[data.user.payment_method] || '其他支付'}
            </div>
            <div className="col-lg-4 fs-sm fs-lg-md">
              <span className="bg-orange-100 rounded-pill px-3 py-1 me-2">
                支付狀態
              </span>

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

          <div className="overflow-y-auto" style={{ maxHeight: 280 }}>
            {Object.keys(data.products).length > 3 && (
              <div className="text-center text-secondary small py-2 mb-6 bg-yellow-200 rounded-3">
                <i className="bi bi-mouse me-1"></i> 請滑動檢視更多餐點
              </div>
            )}
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

                <span className="me-md-4 text-nowrap">
                  <i className="bi bi-currency-dollar"></i>
                  {product.customizations?.final_total ||
                    product.customizations?.custom_total}
                </span>
              </div>
            ))}
          </div>

          <div className="ms-auto me-md-4 " style={{ maxWidth: 260 }}>
            <div className="d-flex justify-content-between mb-4">
              <span className="ms-6">小計</span>
              <span>
                <i className="bi bi-currency-dollar"></i>
                {data.user.final_total -
                  data.user.discount -
                  data.user.addons_total}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-4">
              <span className="ms-6">加購</span>
              <span>
                <i className="bi bi-currency-dollar"></i>
                {data.user.addons_total}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-4">
              <span className="ms-6">折扣</span>
              <span>
                -<i className="bi bi-currency-dollar"></i>
                {data.user.discount}
              </span>
            </div>
            <div className="d-flex justify-content-between fw-medium fs-6 text-primary">
              <span>總金額</span>
              <span className="text-orange-600">
                <i className="bi bi-currency-dollar"></i>
                {data.user.final_total}
              </span>
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
  const [formData, setFormData] = useState({
    name: '王小明',
    phone: '0912-345-678',
    email: 'ming@example.com',
    address: '台北市信義區信義路五段7號',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('更新資料:', formData);
    setIsEditing(false);
    alert('資料已更新！');
  };
  return (
    <div className="user-profile-container container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 profile-card p-7 rounded-3">
            <div className="card-body px-4 py-4">
              {/* <div className="text-center mb-4">
                <div className="avatar-placeholder mb-8">
                  <i className="bi bi-person-circle px-6"></i>
                </div>
                <h5 className="fw-bold">{formData.name || '使用者'}</h5>
              </div> */}
              <div>
                <div class="marquee-container">
                  <div class="marquee-content">
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-1.png`}
                      alt="Poke碗"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-2.png`}
                      alt="鮭魚"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-3.png`}
                      alt="酪梨"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-4.png`}
                      alt="毛豆"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-5.png`}
                      alt="海藻"
                    />

                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-6.png`}
                      alt="Poke碗"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-7.png`}
                      alt="鮭魚"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-8.png`}
                      alt="酪梨"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-9.png`}
                      alt="毛豆"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-10.png`}
                      alt="海藻"
                    />

                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-1.png`}
                      alt="Poke碗"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-2.png`}
                      alt="鮭魚"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-3.png`}
                      alt="酪梨"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-4.png`}
                      alt="毛豆"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-5.png`}
                      alt="海藻"
                    />

                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-6.png`}
                      alt="Poke碗"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-7.png`}
                      alt="鮭魚"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-8.png`}
                      alt="酪梨"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-9.png`}
                      alt="毛豆"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}img/member/food-10.png`}
                      alt="海藻"
                    />
                  </div>
                </div>
              </div>

              {/* 表單區塊 */}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* 姓名 */}
                  <div className="col-md-6">
                    <label className="form-label text-primary fw-medium">
                      姓名
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>

                  {/* 電話 */}
                  <div className="col-md-6">
                    <label className="form-label text-primary fw-medium">
                      電話
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-telephone"></i>
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>

                  {/* 電子郵件 (通常不給改，所以設為 disabled) */}
                  <div className="col-12">
                    <label className="form-label text-primary fw-medium">
                      電子郵件
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        disabled // Email 通常作為帳號，建議鎖定
                      />
                    </div>
                    {isEditing && (
                      <div className="form-text">
                        電子郵件無法修改，請聯繫客服。
                      </div>
                    )}
                  </div>

                  {/* 聯絡地址 */}
                  <div className="col-12">
                    <label className="form-label text-primary fw-medium">
                      聯絡地址
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-geo-alt"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* 按鈕區塊 */}
                <div className="d-flex justify-content-end mt-7 pt-7 border-top border-gray-50">
                  {!isEditing ? (
                    <button
                      type="button"
                      className="btn btn-outline-primary px-4"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      編輯資料
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-light me-5"
                        onClick={() => setIsEditing(false)}
                      >
                        取消
                      </button>
                      <button type="submit" className="btn btn-primary px-4">
                        <i className="bi bi-check-lg me-2"></i>
                        儲存變更
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
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

export default Member;
