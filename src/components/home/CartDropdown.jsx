import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// API
import { getCart, deleteCartItem } from '../../api/ApiClient';
// component
import Loader from '../common/Loading';
// cartSilce 區
import {
  openCart,
  closeCart,
  toggleCart,
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
  selectIsDropdownOpen,
  selectIsLoading,
  selectNeedsRefresh,
  setCartData,
  setLoading,
  setError,
} from '../../store/slices/cartSlice';
import { notify } from '../Notify';

const CartDropdown = () => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectTotalItems);
  const totalPrice = useSelector(selectTotalPrice);
  const isOpen = useSelector(selectIsDropdownOpen);
  const isLoading = useSelector(selectIsLoading);
  const needsRefresh = useSelector(selectNeedsRefresh);
  // 處理 hover 狀態
  const closeTimer = useRef(null);

  // 取得購物車商品
  const getAllCart = async () => {
    dispatch(setLoading(true));
    try {
      const res = await getCart();
      dispatch(setCartData(res.data.data));
    } catch (err) {
      dispatch(setError('取得購物車失敗'));
      console.log('取得購物車失敗', err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  // 刪除購物車商品
  const handleRemove = async (id) => {
    const isConfirm = window.confirm('確定要移除該商品嗎？');
    if (!isConfirm) return;

    dispatch(setLoading(true));
    try {
      await deleteCartItem(id);
      await getAllCart();
      notify('success', '已移除商品');
    } catch (err) {
      notify('error', '移除失敗，請稍後再試');
      console.log('刪除失敗', err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    getAllCart();
  }, [needsRefresh]);

  // 處理 dropdown 狀態
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        dispatch(closeCart());
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 避免滑鼠離開 icon dropdown 就消失
  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    dispatch(openCart());
  };
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      dispatch(closeCart());
    }, 300);
  };
  // timer cleanup
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const getItemPrice = (item) => {
    if (item.customizations?.custom_total) {
      return item.customizations.custom_total;
    }
    return item.final_total ?? 0;
  };
  return (
    <div
      className='position-relative'
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 購物車 */}
      <button
        type='button'
        className='header__cartBtn position-relative text-decoration-none'
        onClick={() => dispatch(toggleCart())}
      >
        <i className='bi bi-cart fs-5'></i>
        {/* badge */}
        {totalItems > 0 && (
          <span className='badge bg-error rounded-pill position-absolute top-0 start-100 translate-middle'>
            {totalItems}
          </span>
        )}
      </button>
      {/* dropdown 區 */}
      {isOpen && (
        <div
          className='header__dropdown position-absolute end-0 mt-2 rounded-3 shadow'
          style={{ width: '320px', zIndex: 1050 }}
        >
          <div className='py-5 px-4'>
            <h6 className='fs-5 fw-bold mb-3'>購物車</h6>
            {isLoading ? (
              <div className='text-center py-4'>
                <div className='text-primary mt-10'>
                  <Loader
                    mode={'mask'}
                    show={isLoading}
                    text={'資料處理中..'}
                  />
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              // 購物車為空
              <div className='text-center py-4'>
                <i className='bi bi-cart-x fs-1 text-gray-500 mb-2 d-block'></i>
                <p className='text-gray-500 mb-0'>購物車空空如也喔！</p>
              </div>
            ) : (
              // 購物車有商品
              <>
                <ul
                  className='list-unstyled mb-0'
                  style={{ maxHeight: '300px', overflowY: 'auto' }}
                >
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className='d-flex gap-2 mb-3 pb-3 border-bottom'
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        className='rounded-1 flex-shrink-0'
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                        }}
                      />
                      <div className='flex-grow-1 overflow-hidden'>
                        <div className='fw-semibold text-gray-500 text-truncate'>
                          {item.product.title}
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-1'>
                          <span className='text-gray-300'>
                            NT${getItemPrice(item)} x {item.qty}
                          </span>
                          <button
                            type='button'
                            className='header__cart-deletebtn p-0 text-gray-300'
                            onClick={() => handleRemove(item.id)}
                          >
                            <i className='bi bi-trash header__cart-deletebtn'></i>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {/* 總計 */}
                <div className='d-flex justify-content-between align-items-center mt-4 mb-2'>
                  <span className='fs-6 text-gray-500'>總計</span>
                  <h5 className='text-primary mb-0'>NT${totalPrice}</h5>
                </div>
                {/* 前往購物車頁面 */}
                <Link
                  to='/cart'
                  className='home__btn-primary w-100 rounded-pill mt-3'
                  onClick={() => dispatch(closeCart())}
                >
                  前往結帳
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default CartDropdown;
