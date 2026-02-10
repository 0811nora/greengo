import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
          <span className='badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle'>
            {cartData.carts.length}
          </span>
        )}
      </button>

      {/* Dropdown 內容 */}
      {isOpen && (
        <div
          className='position-absolute end-0 mt-2 bg-white border rounded shadow-lg'
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
                <i className='bi bi-cart-x fs-1 text-muted mb-2'></i>
                <p className='text-muted mb-0'>購物車空空如也喔！</p>
              </div>
            ) : (
              <>
                {/* 購物車商品列表 */}
                <div
                  style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                  }}
                >
                  <ul className='list-unstyled mb-0'>
                    {cartData.carts.map((item) => (
                      <li
                        key={item.id}
                        className='d-flex gap-2 mb-3 pb-3 border-bottom'
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className='rounded'
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            flexShrink: 0,
                          }}
                        />
                        <div className='flex-grow-1 overflow-hidden'>
                          <div className='fw-semibold text-truncate'>
                            {item.product.title}
                          </div>
                          <div className='text-muted'>
                            ${item.product.price} x {item.qty}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 前往結帳按鈕 */}
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
