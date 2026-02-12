import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartDropdown = () => {
  const { cartData } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 切換 dropdown 開關
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // 點擊外部關閉 dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 計算總和
  const totalPrice = cartData.carts.reduce((acc, item) => {
    return acc + item.customizations.custom_total * item.qty;
  }, 0);

  return (
    <div className='position-relative' ref={dropdownRef}>
      {/* 購物車按鈕 */}
      <button
        type='button'
        className='btn btn-link position-relative p-0 text-decoration-none'
        onClick={toggleDropdown}
        onMouseEnter={() => setIsOpen(true)}
      >
        <i className='bi bi-cart fs-5'></i>
        {cartData.carts?.length > 0 && (
          <span className='badge bg-error rounded-pill position-absolute top-0 start-100 translate-middle'>
            {cartData.carts.length}
          </span>
        )}
      </button>

      {/* Dropdown 內容 */}
      {isOpen && (
        <div
          className='position-absolute end-0 mt-2 bg-white border rounded-3 shadow'
          style={{
            width: '320px',
            maxHeight: '450px',
            zIndex: 1050,
          }}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className='p-3'>
            <h6 className='fw-bold mb-3'>購物車</h6>

            {cartData.carts?.length === 0 ? (
              <div className='text-center py-4'>
                <i className='bi bi-cart-x fs-1 text-gray-500 mb-2'></i>
                <p className='text-gray-500 mb-0'>購物車空空如也喔！</p>
              </div>
            ) : (
              <>
                {/* 購物車商品列表 */}
                <div
                  style={{
                    overflowY: 'auto',
                  }}
                >
                  {cartData.carts.map((item) => (
                    <div key={item.id}>
                      <ul className='list-unstyled mb-0'>
                        <li className='d-flex gap-2 mb-3 pb-3 border-bottom'>
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.title}
                            className='rounded-1'
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover',
                              flexShrink: 0,
                            }}
                          />
                          <div className='flex-grow-1 overflow-hidden'>
                            <div className='fw-semibold text-gray-500'>
                              {item.product.title}
                            </div>
                            <div className='text-gray-300 d-flex justify-content-between'>
                              <span>
                                ${item.customizations.custom_total} x {item.qty}
                              </span>
                              <span className='pe-2'>
                                ${item.customizations.custom_total * item.qty}
                              </span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  ))}

                  {/* 總計 */}
                  <div className='d-flex justify-content-between align-items-center'>
                    <span>總計：</span>
                    <h4 className='text-primary'>${totalPrice}</h4>
                  </div>
                </div>

                {/* 前往結帳 */}
                <div className='pt-3 mt-2'>
                  <Link
                    to='/cart'
                    className='btn btn-primary w-100 rounded-pill'
                    onClick={() => setIsOpen(false)}
                  >
                    前往結帳
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default CartDropdown;
