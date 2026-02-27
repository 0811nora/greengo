import { useEffect, useState } from 'react';
import {
  getCart,
  putCartItem,
  deleteCartItem,
  deleteAllCart,
} from '../api/ApiClient';
import { notify } from './../components/Notify';
import { ConfirmModal } from '../components/common/Modal';
import Loader from '../components/common/Loading';
import { PageSwitch } from '../components/common/AnimationWrapper';
import DonutPFC from '../components/custom-comp/PFC_Chart';
import { NavLink, useNavigate } from 'react-router-dom';
// header 購物車
import { useDispatch, useSelector } from 'react-redux';
import { renderRefresh } from './../store/slices/cartSlice';
import { selectIsLogin, openModal } from './../store/slices/userSlice';

// 主組件：購物車頁面

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const getCarts = async () => {
    try {
      setIsLoading(true);
      const res = await getCart();
      setCartItems(res.data.data.carts);
      console.log(res.data.data.carts);
    } catch (error) {
      notify('error', `取得失敗:${error.response.data.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCarts();
  }, []);

  const handleCartItem = async (id, qty) => {
    const data = {
      product_id: id,
      qty: qty,
    };
    setIsLoading(true);
    try {
      const res = await putCartItem(id, data);
      getCarts();
      notify('success', `調整成功`);
      dispatch(renderRefresh());
    } catch (error) {
      notify('error', `調整失敗:${error.response.data.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const { baseSubtotal, totalAddons } = cartItems.reduce(
    (acc, item) => {
      const itemBasePrice = item?.customizations?.plan_info?.base_price;

      const itemExtraPrice = item.customizations?.extra_price
        ? item?.customizations?.extra_price
        : 0;

      acc.baseSubtotal += itemBasePrice * item.qty;
      acc.totalAddons += itemExtraPrice * item.qty;

      return acc;
    },
    { baseSubtotal: 0, totalAddons: 0 }, // 初始值
  );

  const finalTotal = baseSubtotal + totalAddons;

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
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleCartItem}
                  getCarts={getCarts}
                />
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

//單個購物車項目 (CartItem)
const CartItem = ({ item, onUpdateQuantity, getCarts }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isCustom = item.product.category === 'custom';
  const isPoke = item.product.category === 'fixed' || isCustom;
  const unitPrice = item?.customizations?.custom_total;
  const itemTotalPrice = unitPrice * item.qty;
  const nutritionInfo = item.customizations?.total_nutrition;
  const addon = item?.customizations?.addon;
  const dispatch = useDispatch();

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

  const hasAddonsContent =
    addon &&
    (addon.base?.length > 0 ||
      addon.protein?.length > 0 ||
      addon.sauce?.length > 0 ||
      addon.side?.length > 0 ||
      addon.drinks?.length > 0 ||
      addon.soup?.length > 0);

  const handleRemoveItem = async (id) => {
    setIsLoading(true);
    try {
      const res = await deleteCartItem(id);
      setIsShowModal(false);
      getCarts();
      notify('success', `刪除成功`);
      dispatch(renderRefresh());
    } catch (error) {
      notify('error', `刪除失敗:${error.response.data.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const [isShowModal, setIsShowModal] = useState(false);
  const [delProductId, setDelProductId] = useState('');
  const handleClose = () => {
    setIsShowModal(false);
  };
  const openConfirmModal = (id) => {
    setIsShowModal(true);
    setDelProductId(id);
  };

  return (
    <div className={`cart-item ${isOpen ? 'details-open' : ''}`}>
      <Loader mode={'mask'} show={isLoading} text={'資料處理中..'} />

      <div className="item-main">
        <div className="item-image">
          <img src={item.product.imageUrl} alt={item.product.title} />
        </div>

        <div className="item-info">
          <h3 className="fs-6 mb-2">{item.product.title}</h3>

          <div
            className="border-start border-4 border-gray-100 ms-1 ps-2 mt-3 mb-2"
            style={{ maxWidth: '160px' }}
          >
            <p className="unit-price d-flex justify-content-between mb-1">
              <span className="me-5">原價</span>
              <span>
                <i className="bi bi-currency-dollar"></i>
                {item?.customizations?.plan_info?.base_price?.toLocaleString()}
              </span>
            </p>
            {hasAddonsContent && (
              <p className="unit-price d-flex justify-content-between mb-1">
                <span className="me-5">加購</span>
                <span>
                  <i className="bi bi-currency-dollar"></i>
                  {item?.customizations?.extra_price?.toLocaleString()}
                </span>
              </p>
            )}

            <p className="unit-price d-flex justify-content-between">
              <span className="me-5">單品合計</span>
              <span>
                <i className="bi bi-currency-dollar"></i>
                {unitPrice?.toLocaleString()}
              </span>
            </p>
          </div>
          <button
            type="button"
            className="btn btn-sm py-1 px-2 btn-outline-orange-300 rounded-pill lh-sm ms-3"
            style={{ fontSize: '0.75rem' }}
            onClick={() => setIsOpen(!isOpen)}
          >
            查看明細與營養素
            <i
              className={`ms-1 bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}
            ></i>
          </button>
        </div>

        <div className="item-quantity">
          <button
            type="button"
            className="qty-btn minus"
            onClick={() => onUpdateQuantity(item.id, item.qty - 1)}
            disabled={item.qty <= 1}
          >
            <i className="bi bi-dash"></i>
          </button>
          <input type="number" value={item.qty} readOnly />
          <button
            type="button"
            className="qty-btn plus"
            onClick={() => onUpdateQuantity(item.id, item.qty + 1)}
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>

        <div className="item-total">
          <i className="bi bi-currency-dollar"></i> {itemTotalPrice}
        </div>

        <button
          type="button"
          className="delete-btn"
          onClick={() => openConfirmModal(item.id)}
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>

      <div className="item-details-panel">
        <div className="details-grid">
          {isPoke ? (
            <div className="detail-column content-list">
              <h4
                className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-4"
              >
                <i className="bi bi-postcard-heart me-2"></i>內容物明細
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
                        item.customizations.included.base,
                        'included_general',
                      )}
                    </li>

                    <li className="mb-3">
                      <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                        主食
                      </span>

                      {renderCustomItems(
                        item?.customizations?.included?.protein,
                        'included_protein',
                      )}
                    </li>

                    <li className="mb-3">
                      <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                        醬料
                      </span>

                      {renderCustomItems(
                        item?.customizations?.included?.sauce,
                        'included_general',
                      )}
                    </li>

                    <li className="mb-5">
                      <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                        配菜
                      </span>

                      {renderCustomItems(
                        item.customizations.included.side,
                        'included_general',
                      )}
                    </li>
                  </ul>
                  {/* 加購區 (Addons) */}

                  {hasAddonsContent && (
                    <>
                      <h4
                        className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-4"
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
                              item.customizations.addon.base,
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
                              item.customizations?.addon?.protein,
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
                              item.customizations?.addon?.sauce,
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
                              item.customizations?.addon?.side,
                              'addon',
                            )}
                          </li>
                        )}

                        {addon?.drinks?.length > 0 && (
                          <li className="mb-3">
                            <span>飲品：</span>

                            {renderCustomItems(
                              item.customizations?.addon?.drinks,
                              'addon',
                            )}
                          </li>
                        )}
                        {addon?.soup?.length > 0 && (
                          <li className="mb-3">
                            <span>湯品：</span>

                            {renderCustomItems(
                              item.customizations?.addon?.soup,
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
                  {item.product.ingredients && (
                    <>
                      <ul className="px-2">
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            基底
                          </span>
                          <span className="text-brown-300">
                            {item.product.ingredients.base}
                          </span>
                        </li>
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            主食
                          </span>
                          <span className="text-brown-300">
                            {item.product.ingredients.main}
                          </span>
                        </li>
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            醬料
                          </span>
                          <span className="text-brown-300">
                            {item.product.ingredients.source}
                          </span>
                        </li>
                        <li className="mb-5">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            配菜
                          </span>
                          <span className="text-brown-300">
                            {item.product.ingredients.side}
                          </span>
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
                              item.customizations.addon.base,
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
                              item?.customizations?.addon?.protein,
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
                              item.customizations.addon.sauce,
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
                              item.customizations.addon.side,
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
                              item.customizations.addon.drinks,
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
                              item.customizations.addon.soup,
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
          ) : (
            <div className="detail-column content-list">
              <h4
                className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-4"
              >
                <i className="bi bi-postcard-heart me-2"></i>內容物明細
              </h4>
              <ul className="px-2">
                <li className="mb-3">
                  <span className="text-brown-300">
                    {item.product.ingredients.base}
                  </span>
                </li>
              </ul>
            </div>
          )}

          <div className={`detail-column nutrition-info mb-3 `}>
            <h4
              className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-4"
            >
              <i className="bi bi-pie-chart-fill me-2"></i> 單品營養素資訊
            </h4>
            <DonutPFC
              protein={nutritionInfo?.protein}
              fat={nutritionInfo?.fat}
              carbs={nutritionInfo?.carbs}
              calories={nutritionInfo?.calories}
            />
          </div>
        </div>
      </div>
      <ConfirmModal
        style={'front'}
        show={isShowModal}
        closeModal={handleClose}
        text_icon={`bi bi-bag-check-fill`}
        text_title={'確定要刪除此商品？'}
        text_content={'請確認購物內容及金額'}
        text_cancel={'取消'}
        cancelModal={handleClose}
        text_confirm={'確認'}
        confirmModal={() => handleRemoveItem(delProductId)}
      />
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
