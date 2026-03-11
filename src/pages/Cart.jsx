import { useEffect, useState } from 'react';
import { getCart } from '../api/ApiClient';
import { notify } from './../components/Notify';
import Loader from '../components/common/Loading';
import { PageSwitch } from '../components/common/AnimationWrapper';
import { useNavigate } from 'react-router-dom';
// header 購物車
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLogin, openModal } from './../store/slices/userSlice';
import { useCartTotals } from '../hooks/useCartTotals';
import CartItem from '../components/cart/CartItem';

// 主組件：購物車頁面

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCarts = async () => {
    try {
      setIsLoading(true);
      const res = await getCart();
      setCartItems(res.data.data.carts);
      // console.log(res.data.data.carts);
    } catch (error) {
      notify('error', `取得失敗:${error.response.data.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCarts();
  }, []);

  const { baseSubtotal, totalAddons, finalTotal } = useCartTotals(cartItems);

  return (
    <div className="cart-container container-xl">
      <Loader mode={'mask'} show={isLoading} text={'購物車讀取中..'} />
      <PageSwitch>
        <h1 className="page-title">
          <i className="bi bi-basket3 me-2"></i>購物車
        </h1>
        <div className="row g-5">
          {/* 左側：商品列表 */}
          <section className="col-lg-8">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItem key={item.id} item={item} getCarts={getCarts} />
              ))
            ) : (
              <div
                style={{ textAlign: 'center', padding: '40px', color: '#666' }}
              >
                <h3 className="fs-6 mb-2">購物車目前是空的</h3>
              </div>
            )}
          </section>

          {/* 右側：總覽 */}
          <CartSummary
            baseSubtotal={baseSubtotal}
            totalAddons={totalAddons}
            finalTotal={finalTotal}
          />
        </div>
      </PageSwitch>
    </div>
  );
};

// 子組件：右側費用總覽 (CartSummary)

const CartSummary = ({ baseSubtotal, totalAddons, finalTotal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector(selectIsLogin);
  const handleNextCart = () => {
    if (!isLogin) {
      dispatch(openModal());
      notify('info', `請先登入，再繼續完成選購`);
    } else {
      navigate('/checkout');
    }
  };
  return (
    <aside className="cart-summary col-lg-4">
      <div className="summary-card">
        <h4 className="text-primary py-3 mb-4">費用總覽</h4>

        <div className="d-flex justify-content-between mb-2">
          <span>小計</span>
          <span>
            <i className="bi bi-currency-dollar"></i>{' '}
            {baseSubtotal.toLocaleString()}
          </span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>加購</span>
          <span>
            <i className="bi bi-currency-dollar"></i>{' '}
            {totalAddons.toLocaleString()}
          </span>
        </div>

        <div className="d-flex justify-content-between mt-3 pt-3 border-top border-gray-100">
          <span className="fs-5 fw-medium">總計</span>
          <span className="fs-5 fw-medium text-primary">
            <i className="bi bi-currency-dollar"></i>{' '}
            {finalTotal.toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          className="btn checkout-btn"
          disabled={baseSubtotal <= 0}
          onClick={handleNextCart}
        >
          下一步
        </button>
      </div>
    </aside>
  );
};

export default Cart;
