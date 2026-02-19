// import { useState } from 'react';
import { FixedMeals } from '../../data/homeData';
import { notify } from '../Notify';

// header 購物車
import { useDispatch } from 'react-redux';
import { renderRefresh } from '../../store/slices/cartSlice';

// API
import { postAddToCart } from '../../api/ApiClient';

// swiper
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const BestSellerSwiper = () => {
  const dispatch = useDispatch();

  // 加入購物車
  const addCartBtn = async (id = '', qty = 1) => {
    try {
      const cartData = {
        product_id: id,
        qty: qty,
      };
      const res = await postAddToCart(cartData);
      console.log('加入購物車資料:', res.data);
      notify('success', '成功加入購物車！');
      dispatch(renderRefresh());
    } catch (error) {
      notify('error', '加入失敗');
      console.log(error, error.data);
    }
  };
  return (
    <>
      {' '}
      <Swiper
        className='fixed-swiper'
        modules={[Navigation, A11y]}
        spaceBetween={24}
        slidesPerView={1.5}
        navigation
        breakpoints={{
          576: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          992: { slidesPerView: 4 },
        }}
        style={{
          paddingBottom: '10px',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
      >
        {/* 待調整 */}
        {FixedMeals.map((product) => (
          <SwiperSlide key={product.id}>
            <div className='home__fixed-card h-100'>
              <div className='position-relative overflow-hidden rounded-3'>
                {product.rank && (
                  <span className='badge rounded-pill bg-success position-absolute top-0 start-0 mt-2 ms-2 z-3'>
                    {product.rank}
                  </span>
                )}
                <button
                  type='button'
                  className='home__swiper-btn position-absolute bottom-0 end-0 mb-2 me-2 z-3'
                  aria-label='加入購物車'
                  onClick={() => addCartBtn(product.id, 1)}
                >
                  <i className='bi bi-bag'></i>
                </button>
                <img
                  src={product.img}
                  className='card-img-top object-fit-cover'
                  alt={product.name}
                />
              </div>
              <div className='card-body mt-4'>
                <div className='d-flex justify-content-between align-items-center mb-1'>
                  <h5 className='fs-6 fs-md-5 fw-bold mb-0'>{product.name}</h5>
                  <span className='ft-en fs-6 fs-md-5 fw-bold'>
                    ${product.price}
                  </span>
                </div>
                <p className='ft-en fw-medium text-gray-300 mb-3'>
                  {product.kcal} kcal
                </p>
                <div className='d-flex flex-wrap gap-2'>
                  {product.tags.map((item, index) => (
                    <span key={index} className='tag-item'>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
export default BestSellerSwiper;
