import { useEffect, useState } from 'react';
import {
  getCart,
  putCartItem,
  deleteCartItem,
  deleteAllCart,
} from '../api/ApiClient';

import { NavLink, useNavigate } from 'react-router-dom';

//單個購物車項目 (CartItem)
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isCustom = item.product.category === 'custom';
  const isPoke = item.product.category === 'fixed' || isCustom;
  const unitPrice = isCustom
    ? item.customizations.custom_total
    : item.product.price;
  const itemTotalPrice = unitPrice * item.qty;
  const nutritionInfo = isCustom
    ? item.customizations.total_nutrition
    : item.product.nutrition;

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

  const addon = item.customizations?.addon;

  const hasAddonsContent =
    addon &&
    (addon.base?.length > 0 ||
      addon.protein?.length > 0 ||
      addon.sauce?.length > 0 ||
      addon.side?.length > 0 ||
      addon.drinks?.length > 0 ||
      addon.soup?.length > 0);

  return (
    <div className={`cart-item ${isOpen ? 'details-open' : ''}`}>
      <div className="item-main">
        <div className="item-image">
          <img src={item.product.imageUrl} alt={item.product.title} />
        </div>

        <div className="item-info">
          <h3 className="fs-6 mb-2">{item.product.title}</h3>

          <p className="unit-price">
            單價： <i class="bi bi-currency-dollar"></i> {unitPrice}
          </p>

          <button
            type="button"
            className="toggle-details-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isPoke ? '查看明細與營養素' : '查看營養素'}
            <i
              className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}
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
          <i class="bi bi-currency-dollar"></i> {itemTotalPrice}
        </div>

        <button
          type="button"
          className="delete-btn"
          onClick={() => {
            if (window.confirm('確定要刪除這項商品嗎？')) {
              onRemove(item.id);
            }
          }}
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>

      <div className="item-details-panel">
        <div className="details-grid">
          {isPoke && (
            <div className="detail-column content-list">
              <h4 className="fs-sm text-gray-300 mb-2 d-flex align-items-center">
                <i class="bi bi-postcard-heart me-2"></i>內容物明細
              </h4>
              <ul>
                {isCustom ? (
                  // 自選 Poke 的渲染邏輯
                  <>
                    <li>
                      <span>基底：</span>

                      {renderCustomItems(
                        item.customizations.included.base,
                        'included_general',
                      )}
                    </li>

                    <li>
                      <span>主食：</span>

                      {renderCustomItems(
                        item.customizations.included.protein,
                        'included_protein',
                      )}
                    </li>

                    <li>
                      <span>醬料：</span>

                      {renderCustomItems(
                        item.customizations.included.sauce,
                        'included_general',
                      )}
                    </li>

                    <li>
                      <span>配菜：</span>

                      {renderCustomItems(
                        item.customizations.included.side,
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
                                item.customizations.addon.base,
                                'addon',
                              )}
                            </li>
                          )}

                          {addon.protein?.length > 0 && (
                            <li>
                              <span>主食：</span>
                              {renderCustomItems(
                                item.customizations.addon.protein,
                                'addon',
                              )}
                            </li>
                          )}

                          {addon.sauce?.length > 0 && (
                            <li>
                              <span>醬料：</span>

                              {renderCustomItems(
                                item.customizations.addon.sauce,
                                'addon',
                              )}
                            </li>
                          )}
                          {addon?.side?.length > 0 && (
                            <li>
                              <span>配菜：</span>

                              {renderCustomItems(
                                item.customizations.addon.side,
                                'addon',
                              )}
                            </li>
                          )}

                          {addon.drinks?.length > 0 && (
                            <li>
                              <span>飲品：</span>

                              {renderCustomItems(
                                item.customizations.addon.drinks,
                                'addon',
                              )}
                            </li>
                          )}
                          {addon.soup?.length > 0 && (
                            <li>
                              <span>湯品：</span>

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
                ) : (
                  <>
                    {item.product.ingredients && (
                      <>
                        <li>
                          <span>基底：</span>
                          <span>{item.product.ingredients.base}</span>
                        </li>
                        <li>
                          <span>主食：</span>
                          <span>{item.product.ingredients.main}</span>
                        </li>
                        <li>
                          <span>醬料：</span>
                          <span>{item.product.ingredients.source}</span>
                        </li>
                        <li>
                          <span>配菜：</span>
                          <span>{item.product.ingredients.side}</span>
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
                                item.customizations.addon.base,
                                'addon',
                              )}
                            </li>
                          )}

                          {addon.protein?.length > 0 && (
                            <li>
                              <span>主食：</span>
                              {renderCustomItems(
                                item.customizations.addon.protein,
                                'addon',
                              )}
                            </li>
                          )}

                          {addon.sauce?.length > 0 && (
                            <li>
                              <span>醬料：</span>

                              {renderCustomItems(
                                item.customizations.addon.sauce,
                                'addon',
                              )}
                            </li>
                          )}
                          {addon?.side?.length > 0 && (
                            <li>
                              <span>配菜：</span>

                              {renderCustomItems(
                                item.customizations.addon.side,
                                'addon',
                              )}
                            </li>
                          )}

                          {addon.drinks?.length > 0 && (
                            <li>
                              <span>飲品：</span>

                              {renderCustomItems(
                                item.customizations.addon.drinks,
                                'addon',
                              )}
                            </li>
                          )}
                          {addon.soup?.length > 0 && (
                            <li>
                              <span>湯品：</span>

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
              </ul>
            </div>
          )}

          <div
            className={`detail-column nutrition-info ${!isPoke ? 'full-width' : ''}`}
          >
            <h4 className="fs-sm text-gray-300 mb-2 d-flex align-items-center">
              <i class="bi bi-pie-chart-fill me-2"></i> 營養素資訊
            </h4>

            {nutritionInfo && (
              <div className="nutri-badges">
                <div className="badge">
                  <span className="label">熱量</span>
                  <span className="value">{nutritionInfo.calories}</span>
                  <span className="unit">Kcal</span>
                </div>
                <div className="badge">
                  <span className="label">蛋白</span>
                  <span className="value">{nutritionInfo.protein}</span>
                  <span className="unit">g</span>
                </div>
                <div className="badge">
                  <span className="label">脂肪</span>
                  <span className="value">{nutritionInfo.fat}</span>
                  <span className="unit">g</span>
                </div>
                <div className="badge">
                  <span className="label">碳水</span>
                  <span className="value">{nutritionInfo.carbs}</span>
                  <span className="unit">g</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 子組件：右側費用總覽 (CartSummary)

const CartSummary = ({ baseSubtotal, totalAddons, discount, finalTotal }) => {
  const navigate = useNavigate();
  return (
    <aside className="cart-summary col-lg-4">
      <div className="summary-card">
        <h4 className="text-primary pt-3 border-bottom border-gray-100 pb-3 mb-4">
          費用總覽
        </h4>

        <div className="d-flex justify-content-between mb-2">
          <span>小計</span>
          <span>
            <i class="bi bi-currency-dollar"></i>{' '}
            {baseSubtotal.toLocaleString()}
          </span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>加購</span>
          <span>
            <i class="bi bi-currency-dollar"></i> {totalAddons.toLocaleString()}
          </span>
        </div>

        <div className="d-flex justify-content-between mt-3 pt-3 border-top border-gray-100">
          <span className="fs-5 fw-medium">總計</span>
          <span className="fs-5 fw-medium text-primary">
            <i class="bi bi-currency-dollar"></i> {finalTotal.toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          className="btn checkout-btn"
          disabled={baseSubtotal <= 0}
          onClick={() => navigate('/checkout')}
        >
          下一步
        </button>
      </div>
    </aside>
  );
};

// 4. 主組件：購物車頁面 (Cart Page)

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0); // 預留優惠碼功能

  const getCarts = async () => {
    try {
      const res = await getCart();
      setCartItems(res.data.data.carts);
      console.log(res.data.data.carts);
    } catch (error) {
      alert('取得失敗: ' + error.response.data.message);
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
    try {
      const res = await putCartItem(id, data);
      getCarts();
      alert('調整成功');
    } catch (error) {
      alert('取得失敗: ' + error.response.data.message);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const res = await deleteCartItem(id);
      getCarts();
      alert('刪除成功');
    } catch (error) {
      alert('刪除失敗: ' + error.response.data.message);
    }
  };

  const { baseSubtotal, totalAddons } = cartItems.reduce(
    (acc, item) => {
      const isCustom = item.product.category === 'custom';

      const itemBasePrice = item.product.price;

      const itemExtraPrice =
        isCustom && item.customizations?.extra_price
          ? item.customizations.extra_price
          : 0;

      acc.baseSubtotal += itemBasePrice * item.qty;
      acc.totalAddons += itemExtraPrice * item.qty;

      return acc;
    },
    { baseSubtotal: 0, totalAddons: 0 }, // 初始值
  );

  const finalTotal = baseSubtotal + totalAddons - discount;

  return (
    <div className="cart-container container-xl">
      <h1 className="page-title">您的購物車</h1>
      <div className="row g-5">
        {/* 左側：商品列表 */}
        <section className="col-lg-8">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleCartItem}
                onRemove={handleRemoveItem}
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
          discount={discount}
          finalTotal={finalTotal}
        />
      </div>
    </div>
  );
};

export default Cart;
