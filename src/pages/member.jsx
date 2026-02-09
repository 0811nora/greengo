import { useState, useEffect } from 'react';
import { getOrders } from '../api/ApiClient';

const MemberCenter = () => {
  const [activeTab, setActiveTab] = useState('orders'); // orders | profile
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 取得訂單列表
  const fetchOrders = async () => {
    try {
      const res = await getOrders();

      console.log(res.data.orders);
      setOrders(res.data.orders || []);
      setTotalPages(res.data.pagination.total_pages || 1);
    } catch (error) {
      alert('取得失敗: ' + (error.response?.data?.message || '未知錯誤'));
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [page, activeTab]);

  return (
    <div className="member-center-container">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h2 className="text-center title">會員中心</h2>

        {/* Tab 切換 */}
        <ul className="nav nav-tabs justify-content-center mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
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
                    onClick={() => setPage(page - 1)}
                  >
                    上一頁
                  </button>
                </li>
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
                    onClick={() => setPage(page + 1)}
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
  return (
    <div className="card order-card p-3">
      <div className="d-flex justify-content-between align-items-center mb-2 card-header-info">
        <div>
          <span className="fw-bold me-2">
            {formatTimestamp(data.create_at)}
          </span>
          {/* <span className="status-tag">外帶</span> */}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center small">
        <span>取餐號碼 #{data.user.order_number || '234'}</span>
        <span>總金額：{data.user.final_total || '142'} 元</span>
        <span
          className={
            data.user.payment_status === 'new'
              ? 'status-text-unpicked'
              : 'status-text-picked'
          }
        >
          <i
            className={`bi ${data.user.payment_status === 'new' ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'} me-1`}
          ></i>
          訂單狀態：{data.user.payment_status === 'new' ? '未取餐' : '可取餐'}
        </span>
      </div>

      {/* 詳細清單 (模擬圖片中的展開樣式) */}
      <div className="order-detail-box mt-3 small">
        <div className="row mb-3 text-secondary text-center">
          <div className="col-md-4">訂單編號 {data.id}</div>
          <div className="col-md-4">支付方式：{data.user.payment_method}</div>
          <div className="col-md-4">支付狀態：{data.user.payment_status}</div>
        </div>

        {/* 假設 data.items 是陣列 */}
        <div className="border-bottom pb-2 mb-2">
          {Object.values(data.products).map((product, index) => (
            <div key={index} className="d-flex justify-content-between mb-1">
              <span>
                {product.product.title} x {product.qty}
              </span>
              <span>
                $
                {product.customizations?.final_total ||
                  product.customizations?.custom_total}
              </span>
            </div>
          ))}
        </div>

        <div className="text-end">
          <div className="text-secondary">
            小計 ${data.user.final_total - data.user.discount}
          </div>
          <div className="text-secondary">折扣 -${data.user.discount}</div>
          <div className="fw-bold">總金額 ${data.user.final_total}</div>
        </div>
      </div>
    </div>
  );
};

// 個人資料子組件
const ProfileSection = () => {
  return (
    <div className="profile-form">
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
        <div className="mb-4">
          <label className="form-label">常用外送地址</label>
          <input type="text" className="form-control" placeholder="輸入地址" />
        </div>
        <div className="text-center">
          <button
            type="button"
            className="btn btn-success px-5"
            style={{ backgroundColor: '#4a5c44', border: 'none' }}
          >
            儲存修改
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberCenter;
