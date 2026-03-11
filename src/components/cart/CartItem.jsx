import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { deleteCartItem, putCartItem } from '../../api/ApiClient';
import { notify } from '../Notify';
import { renderRefresh } from '../../store/slices/cartSlice';
import Loader from '../common/Loading';
import { ConfirmModal } from '../common/Modal';
import CartItemDetails from './CartItemDetails';
import debounce from 'lodash/debounce';

// 購物車品項
const CartItem = ({ item, getCarts }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [localQty, setLocalQty] = useState(item?.qty);
  const qtyRef = useRef(item?.qty);

  const unitPrice = item?.customizations?.custom_total;
  const itemTotalPrice = unitPrice * item?.qty;

  const addon = item?.customizations?.addon;
  const dispatch = useDispatch();

  const hasAddonsContent =
    addon &&
    (addon.base?.length > 0 ||
      addon.protein?.length > 0 ||
      addon.sauce?.length > 0 ||
      addon.side?.length > 0 ||
      addon.drinks?.length > 0 ||
      addon.soup?.length > 0);

  useEffect(() => {
    qtyRef.current = item?.qty;
    setLocalQty(item?.qty);
  }, [item?.qty]);

  const updateCartApi = useCallback(
    async (id, qty) => {
      try {
        await putCartItem(id, { product_id: item.product_id, qty });
        getCarts();
        dispatch(renderRefresh());
      } catch (error) {
        notify('error', `調整失敗:${error.response.data.message}`);
        setLocalQty(qtyRef.current);
      }
    },
    [item.product_id, getCarts, dispatch],
  );

  const debouncedUpdateCart = useMemo(
    () => debounce((id, qty) => updateCartApi(id, qty), 500),
    [updateCartApi],
  );
  const handleQtyChange = (newQty) => {
    if (newQty < 1) return;
    setLocalQty(newQty);
    debouncedUpdateCart(item.id, newQty);
  };

  const handleRemoveItem = async (id) => {
    setIsLoading(true);
    try {
      await deleteCartItem(id);
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
          <img src={item?.product?.imageUrl} alt={item?.product?.title} />
        </div>

        <div className="item-info">
          <h3 className="fs-6 mb-2">{item?.product?.title}</h3>

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
            onClick={() => handleQtyChange(localQty - 1)}
            disabled={localQty <= 1}
          >
            <i className="bi bi-dash"></i>
          </button>
          <input type="number" value={localQty} readOnly />
          <button
            type="button"
            className="qty-btn plus"
            onClick={() => handleQtyChange(localQty + 1)}
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
          onClick={() => openConfirmModal(item?.id)}
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
      <CartItemDetails
        item={item}
        hasAddonsContent={hasAddonsContent}
        addon={addon}
      />
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

export default CartItem;
