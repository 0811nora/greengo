import { useState, useEffect, useRef } from 'react';
import { getOrders } from '../api/ApiClient';
import Loader from '../components/common/Loading';
import { PageSwitch } from '../components/common/AnimationWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, selectIsLogin } from '../store/slices/userSlice';
import { notify } from '../components/Notify';
import { useNavigate } from 'react-router-dom';
import RecipeModal from '../components/cart/RecipeModal';

const Member = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const isLogin = useSelector(selectIsLogin);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      notify('info', '請先登入');
      navigate('/');
      dispatch(openModal());
    }
  }, [isLogin, navigate, dispatch]);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async (targetPage) => {
      setTimeout(() => {
        if (isMounted) setIsLoading(true);
      }, 0);

      try {
        const res = await getOrders(targetPage);
        if (isMounted) {
          setOrders(res.data.orders || []);
          setTotalPages(res.data.pagination.total_pages || 1);
          window.scrollTo(0, 0);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setIsLoading(false);
          alert('取得失敗: ' + (error.response?.data?.message || '未知錯誤'));
        }
      }
    };

    if (activeTab === 'orders') {
      fetchOrders(page);
    }

    return () => {
      isMounted = false;
    };
  }, [page, activeTab]);

  return (
    <div className="member-center-container">
      <Loader mode={'mask'} show={isLoading} text={'讀取中..'} />
      <PageSwitch>
        <div className="container">
          <h1 className="fs-1 text-center fw-bold mb-8 ls-md ts-white">
            會員中心
          </h1>

          {/* Tab 切換 */}
          <ul className="nav nav-underline justify-content-center mb-9">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link tab-navLink fs-5 fs-md-4 ts-white me-3 me-md-7 ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <i className="bi bi-clipboard-fill me-2"></i>
                訂單紀錄
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link tab-navLink fs-5 fs-md-4 ts-white ${activeTab === 'profile' ? 'active' : ''}`}
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
                      type="button"
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
                        type="button"
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
                      type="button"
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
  const [isScrollable, setIsScrollable] = useState(false);
  const listRef = useRef(null);

  const PAYMENT_STATUS_MAP = {
    paid: '已付款',
    unpaid: '尚未付款',
  };

  const PAYMENT_METHOD_MAP = {
    credit_card: '信用卡',
    cash: '臨櫃現金',
    e_payment: '電子支付',
  };

  const ORDER_STATES_MAP = {
    done: '訂單已完成',
    new: '餐點準備中',
    ready: '可取餐',
  };
  const ORDER_STATES_COLOR_MAP = {
    done: 'text-gray-400',
    new: 'text-gray-400',
    ready: 'text-orange-400',
  };
  const ORDER_STATES_ICON_MAP = {
    done: 'bi-check-circle-fill',
    new: 'bi-cup-hot-fill',
    ready: 'bi-exclamation-circle-fill',
  };

  const handleViewRecipe = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setShowRecipeModal(true);
  };

  useEffect(() => {
    if (listRef.current) {
      const hasScrollbar =
        listRef.current.scrollHeight > listRef.current.clientHeight;
      setIsScrollable(hasScrollbar);
    }
  }, [data.products]);

  const imageIndex = (data.create_at % 10) + 1;

  return (
    <>
      <div
        className={`order-card rounded-3 px-5 py-6 p-md-7 mb-6 position-relative ${isOpen ? 'details-open' : ''}`}
      >
        <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
          <div className="d-flex align-items-center mb-5 card-header-info">
            <img
              src={`${import.meta.env.BASE_URL}img/member/food-${imageIndex}.png`}
              alt="食材"
              style={{ maxWidth: 60 }}
              className="d-none d-sm-block me-3"
            />
            <img
              src={`${import.meta.env.BASE_URL}img/member/food-${imageIndex}.png`}
              alt="食材"
              style={{ maxWidth: 60 }}
              className="position-absolute top-0 end-0 translate-middle mt-9 d-sm-none"
            />
            <span className="fw-semibold ls-sm fs-6">
              {formatTimestamp(data.create_at)}
            </span>
          </div>

          <div className="row align-items-center flex-wrap mb-xl-6">
            <div className="col-xxl-2 mb-5 mb-xxl-0">
              <span className="fs-sm bg-primary-100 text-primary-300 fw-medium rounded-pill px-4 py-2 me-2">
                取餐號碼
              </span>
              <div className="d-inline">
                <i className="bi bi-hash "></i>
                <span className="fw-semibold ls-sm">
                  {data.user.order_number}
                </span>
              </div>
            </div>
            <div className="col-xxl-4 mb-5 mb-xxl-0">
              <span className="fs-sm bg-primary-100 text-primary-300 fw-medium rounded-pill px-4 py-2 me-2">
                預計取餐時間
              </span>
              <div className="d-inline text-nowrap">
                <i className="bi bi-clock-history me-1"></i>
                <span className="fw-semibold ls-sm">
                  {formatTimestamp(data.create_at + 1800)}
                </span>
              </div>
            </div>
            <div className="col-xxl-2 mb-5 mb-xxl-0 fw-medium">
              <span className="fs-sm bg-primary-100 text-primary-300 rounded-pill px-4 py-2 me-2">
                總金額
              </span>
              <span className="fw-semibold">
                {data?.user?.final_total?.toLocaleString() || '計算中'} 元
              </span>
            </div>
            <div
              className={`col-10 col-xxl-3 mb-4 mb-xxl-0 fw-medium ${ORDER_STATES_COLOR_MAP[data.user.order_status]}`}
            >
              <span className="fs-sm bg-primary-100 text-primary-300 fw-medium rounded-pill px-4 py-2 me-2">
                訂單狀態
              </span>
              <span className="">
                {ORDER_STATES_MAP[data.user.order_status]}
              </span>

              <i
                className={`bi ${ORDER_STATES_ICON_MAP[data.user.order_status]} ms-1`}
              ></i>
            </div>
            <div className="col-2 col-md-1 col-md-1 ms-auto">
              <i
                className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down text-primary'} ms-auto fs-5`}
              ></i>
            </div>
          </div>
        </div>

        {/* 詳細清單 */}

        <div className="order-detail-box mt-3 rounded-2">
          <div className="row mb-6 text-start">
            <div className="col-xl-4 fw-medium fs-sm fs-lg-md mt-2 mt-xl-0 pb-2 mb-4 mb-xl-0">
              <span className="fs-sm bg-gray-200 text-gray-500 rounded-pill px-4 py-2 me-2">
                訂單編號
              </span>
              {data.id}
            </div>
            <div className="col-lg-4 fw-medium fs-sm fs-lg-md pb-2 mb-4 mb-lg-0">
              <span className="fs-sm bg-gray-200 text-gray-500 rounded-pill px-4 py-2 me-2">
                支付方式
              </span>
              {PAYMENT_METHOD_MAP[data.user.payment_method] || '其他支付'}
            </div>
            <div className="col-lg-4 fw-medium fs-sm fs-lg-md">
              <span className="fs-sm bg-gray-200 text-gray-500 rounded-pill px-4 py-2 me-2">
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

          <div
            ref={listRef}
            className="overflow-y-auto mb-4"
            style={{ maxHeight: 300, WebkitOverflowScrolling: 'touch' }}
            onClick={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {isScrollable && (
              <div className="text-center text-gray-300 small mb-6 rounded-3">
                請滑動檢視更多餐點
                <i className="bi bi-mouse ms-1"></i>
                <i className="bi bi-arrow-down-up"></i>
              </div>
            )}
            {Object.values(data.products).map((product, index) => (
              <div
                key={index}
                className="d-flex justify-content-between mb-1 fs-lg-6 fw-medium border-bottom border-gray-200 pb-4 mb-4 mb-lg-7"
              >
                <span>
                  {product.product.title} x {product.qty}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-orange-300 ms-2 py-0 px-2 mb-1"
                    style={{ fontSize: '0.75rem', borderRadius: '20px' }}
                    onClick={(e) => handleViewRecipe(e, product)}
                  >
                    <i className="bi bi-info-circle me-1"></i>
                    明細
                  </button>
                </span>

                <span className="me-md-4 text-nowrap">
                  <i className="bi bi-currency-dollar"></i>
                  {(
                    product.customizations?.custom_total * product.qty
                  ).toLocaleString() || '計算中'}
                </span>
              </div>
            ))}
          </div>

          <div className="ms-auto me-md-4 " style={{ maxWidth: 260 }}>
            <div className="d-flex justify-content-between mb-4">
              <span className="ms-6">小計</span>
              <span>
                <i className="bi bi-currency-dollar"></i>
                {data?.user?.base_total?.toLocaleString() || '計算中'}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-4">
              <span className="ms-6">加購</span>
              <span>
                <i className="bi bi-currency-dollar"></i>
                {data?.user?.addons_total?.toLocaleString() || '計算中'}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-4">
              <span className="ms-6">折扣</span>
              <span>
                -<i className="bi bi-currency-dollar"></i>
                {data?.user?.discount?.toLocaleString() || '計算中'}
              </span>
            </div>
            <div className="d-flex justify-content-between fw-medium fs-6">
              <span>總金額</span>
              <span className="text-orange-500">
                <i className="bi bi-currency-dollar"></i>
                {data?.user?.final_total?.toLocaleString() || '計算中'}
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
    name: '陳雅涵',
    phone: '0912-335-688',
    email: 'hang@greengomail.com',
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
              <div>
                <div className="marquee-container">
                  <div className="marquee-content">
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

                  {/* 電子郵件 */}
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

export default Member;
