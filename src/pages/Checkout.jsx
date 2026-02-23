import { useState, useEffect } from 'react';
import { getCart, postOrder } from '../api/ApiClient';
import { useNavigate } from 'react-router-dom';
import { PageSwitch } from '../components/common/AnimationWrapper';
import { useForm } from 'react-hook-form';

const Checkout = () => {
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  const getCarts = async () => {
    try {
      const res = await getCart();
      setCartData(res.data.data.carts);
      console.log(res.data.data.carts);
    } catch (error) {
      alert('取得失敗: ' + error.response.data.message);
    }
  };

  useEffect(() => {
    getCarts();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      tel: '',
      payment_method: '',
    },
  });

  // 表單狀態
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tel: '',
    address: 'Taipei',
    addons_total: 0,
    final_total: 0,
    payment_method: 'credit_card',
  });

  // 優惠券狀態
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');

  // 計算金額
  const { baseSubtotal, totalAddons } = cartData.reduce(
    (acc, item) => {
      const itemBasePrice = item.product.price;
      const itemExtraPrice = item.customizations?.extra_price;

      acc.baseSubtotal += itemBasePrice * item.qty;
      acc.totalAddons += itemExtraPrice * item.qty;

      return acc;
    },
    { baseSubtotal: 0, totalAddons: 0 }, // 初始值
  );

  const finalTotal = baseSubtotal + totalAddons - discount;

  // 處理輸入變更
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // 處理優惠券
  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE100') {
      setDiscount(100);
      setCouponMsg({ type: 'success', text: '優惠券已套用！折抵 $100' });
    } else {
      setDiscount(0);
      setCouponMsg({ type: 'danger', text: '無效的優惠碼' });
    }
  };

  // 隨機取餐號產生器
  const generatePickupNumber = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(100 + Math.random() * 900); // 產生 100-999
    return `${randomLetter}${randomNumber}`; // 結果範例: T832, A105
  };

  // 處理送出訂單
  const onSubmit = async (data) => {
    const pickupNumber = generatePickupNumber();
    const isCash = data.payment_method === 'cash';
    const paymentStatus = isCash ? 'unpaid' : 'paid';
    const orderStatus = isCash ? 'new' : 'ready';

    const predata = {
      user: {
        ...data,
        base_total: baseSubtotal,
        addons_total: totalAddons,
        final_total: finalTotal,
        discount: discount,
        order_number: pickupNumber,
        payment_status: paymentStatus,
        order_status: orderStatus,
        address: 'Taipei',
      },
    };
    // console.log(predata);
    try {
      const response = await postOrder(predata);
      const newOrderId = response.data.orderId;
      getCarts();
      navigate(`/payment/${newOrderId}`);
    } catch (error) {
      alert('取得失敗: ' + error.response.data.message);
    }
  };

  return (
    <div className="checkout-page cart-container container-xl">
      <PageSwitch>
        <h1 className="page-title">訂單資訊</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-5">
            {/* 左側：客戶資料與付款 */}
            <div className="col-md-7 col-lg-8 info-card">
              {/* 1. 取餐人資訊 */}
              <div className="card mb-4 shadow-sm border-0">
                <div className="card-body p-4">
                  <h4 className="section-title">
                    <i className="bi bi-person-lines-fill"></i> 取餐人資訊
                  </h4>
                  <div className="row g-3">
                    {/* 姓名欄位 */}
                    <div className="col-12">
                      <label htmlFor="name" className="form-label">
                        姓名
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        placeholder="請輸入真實姓名"
                        {...register('name', {
                          required: '請輸入真實姓名',
                        })}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">
                          {errors.name.message}
                        </div>
                      )}
                    </div>

                    {/* Email 欄位 */}
                    <div className="col-12">
                      <label htmlFor="email" className="form-label">
                        電子信箱
                      </label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        placeholder="example@mail.com"
                        {...register('email', {
                          required: '請輸入電子信箱',
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: '電子信箱格式錯誤',
                          },
                        })}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">
                          {errors.email.message}
                        </div>
                      )}
                    </div>

                    {/* 手機欄位 */}
                    <div className="col-12">
                      <label htmlFor="phone" className="form-label">
                        手機號碼
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${errors.tel ? 'is-invalid' : ''}`}
                        id="phone"
                        placeholder="0912345678"
                        {...register('tel', {
                          required: '請輸入手機號碼',
                          pattern: {
                            value: /^09\d{8}$/,
                            message: '手機號碼格式錯誤 (需為 09 開頭共 10 碼)',
                          },
                        })}
                      />
                      {errors.tel && (
                        <div className="invalid-feedback">
                          {errors.tel.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 付款方式 */}
              <div className="card mb-4 shadow-sm border-0">
                <div className="card-body p-4">
                  <h4 className="section-title">
                    <i className="bi bi-wallet2"></i> 付款方式
                  </h4>

                  <div
                    className={`d-grid gap-3 ${errors.payment_method ? 'is-invalid' : ''}`}
                  >
                    {/* 選項：信用卡 */}
                    <div className="payment-option">
                      <label className="d-flex w-100 cursor-pointer">
                        <input
                          type="radio"
                          value="credit_card"
                          className="form-check-input me-2"
                          {...register('payment_method', {
                            required: '請選擇付款方式',
                          })}
                        />
                        <div className="payment-card w-100">
                          <i className="bi bi-credit-card-2-front"></i>
                          <div>
                            <div className="fw-bold">信用卡 / 金融卡</div>
                            <small className="text-muted">
                              Visa, Master, JCB
                            </small>
                          </div>
                          <i className="bi bi-check-circle-fill check-icon"></i>
                        </div>
                      </label>
                    </div>

                    {/* 選項：電子支付 */}
                    <div className="payment-option">
                      <label className="d-flex w-100 cursor-pointer">
                        <input
                          type="radio"
                          value="e_payment"
                          className="form-check-input me-2"
                          {...register('payment_method', {
                            required: '請選擇付款方式',
                          })}
                        />
                        <div className="payment-card w-100">
                          <i className="bi bi-phone"></i>
                          <div>
                            <div className="fw-bold">電子支付</div>
                            <small className="text-muted">
                              LINE Pay, 街口支付, Apple Pay
                            </small>
                          </div>
                          <i className="bi bi-check-circle-fill check-icon"></i>
                        </div>
                      </label>
                    </div>

                    {/* 選項：臨櫃現金 */}
                    <div className="payment-option">
                      <label className="d-flex w-100 cursor-pointer">
                        <input
                          type="radio"
                          value="cash"
                          className="form-check-input me-2"
                          {...register('payment_method', {
                            required: '請選擇付款方式',
                          })}
                        />
                        <div className="payment-card w-100">
                          <i className="bi bi-cash-coin"></i>
                          <div>
                            <div className="fw-bold"> 臨櫃現金</div>
                            <small className="text-muted">臨櫃付款</small>
                          </div>
                          <i className="bi bi-check-circle-fill check-icon"></i>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* 付款方式的錯誤訊息顯示在最下方 */}
                  {errors.payment_method && (
                    <div className="text-danger mt-2 small">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errors.payment_method.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 右側：訂單摘要 (Sticky Sidebar) */}
            <div className="col-md-5 col-lg-4">
              <div className="order-summary-card p-4">
                <h4 className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-primary">購物車清單</span>
                  <span className="badge bg-orange-300 rounded-pill fw-normal pt-3 px-4">
                    {cartData.length}
                  </span>
                </h4>

                {/* 商品列表 */}
                <ul className="list-group list-group-flush mb-3 px-2">
                  {cartData.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 bg-transparent"
                    >
                      <div className="d-flex align-items-center">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className="item-thumbnail me-3"
                        />
                        <div>
                          <h6 className="my-0">{item.product.title}</h6>
                          <small className="text-muted">
                            數量 x {item.qty}
                          </small>
                        </div>
                      </div>
                      <span className="text-muted">
                        <i class="bi bi-currency-dollar" />
                        {(
                          item.customizations?.custom_total * item.qty
                        ).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* 優惠券輸入區 */}
                <div className="promo-section">
                  <label>優惠碼</label>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="輸入 SAVE100"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button className="btn" type="button" onClick={applyCoupon}>
                      套用
                    </button>
                  </div>
                </div>

                {couponMsg && (
                  <div
                    className={`alert alert-${couponMsg.type} py-1 px-2 mb-3 small`}
                  >
                    {couponMsg.text}
                  </div>
                )}

                {/* 金額計算 */}
                <div className="d-flex justify-content-between mb-2">
                  <span>小計</span>
                  <span>
                    <i class="bi bi-currency-dollar" />{' '}
                    {baseSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>加購</span>
                  <span>
                    <i class="bi bi-currency-dollar" />{' '}
                    {totalAddons.toLocaleString()}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>折扣</span>
                  <span>
                    -<i class="bi bi-currency-dollar" /> {discount}
                  </span>
                </div>
                <div className="d-flex justify-content-between mt-3 pt-3 border-top border-gray-100">
                  <span className="fs-5 fw-medium">總計</span>
                  <span className="fs-5 fw-medium text-primary">
                    <i class="bi bi-currency-dollar" />{' '}
                    {finalTotal.toLocaleString()}
                  </span>
                </div>

                <button className="btn checkout-btn" type="submit">
                  送出訂單
                </button>
              </div>
            </div>
          </div>
        </form>
      </PageSwitch>
    </div>
  );
};

export default Checkout;
