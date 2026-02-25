// import { useState } from 'react';
import { FixedMeals } from '../../data/homeData';
import { notify } from '../Notify';
import { Link } from 'react-router-dom';

// header 購物車
import { useDispatch } from 'react-redux';
import { renderRefresh } from '../../store/slices/cartSlice';

// API
import { postAddToCart, getSingleProduct } from '../../api/ApiClient';

// swiper
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// {
//     "customizations": {
//         "custom_total": 240,
//         "extra_price": 0,
//         "plan_info": {
//             "base_price": 240,
//             "plan_type": "set"
//         },
//         "total_nutrition": {
//             "calories": 368,
//             "carbs": 12,
//             "fat": 13,
//             "protein": 60
//         }
//     },
//     "final_total": 240,
//     "id": "-OmEb8y6cQ-0-TCXk8J6",
//     "product": {
//         "category": "fixed",
//         "nutrition": {
//             "calories": 368,
//             "carbs": 12,
//             "fat": 13,
//             "protein": 60
//         },
//         "origin_price": 0,
//         "price": 240,
//         "product_type": "set",
//         "tab_collection": [
//             "highProtein",
//             "lowFat",
//             "popular"
//         ],
//         "title": "低​脂雞胸​活力​碗",
//         "unit": "份"
//     },
//     "product_id": "-OkcMxg4fqkTz7s1cTZa",
//     "qty": 1,
//     "total": 240
// }

const BestSellerSwiper = () => {
  const dispatch = useDispatch();

  // 加入購物車
  const addCartBtn = async (id = '', qty = 1) => {
    try {
      // 先取得產品資訊
      const productRes = await getSingleProduct(id);
      const productData = productRes.data.product;
      // 算金額
      const totalPrice = productData.price * qty;
      // 傳送購物車資料(包含 customizations)
      const cartData = {
        product_id: id,
        qty: qty,
        total: totalPrice,
        customizations: {
          custom_total: totalPrice,
          extra_price: 0,
          plan_info: {
            base_price: productData.price,
            plan_type: productData.product_type || 'set',
          },
          total_nutrition: {
            calories: productData.nutrition.calories,
            carbs: productData.nutrition.carbs,
            fat: productData.nutrition.fat,
            protein: productData.nutrition.protein,
          },
        },
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
      <Swiper
        className='fixed-swiper'
        modules={[Navigation, A11y]}
        spaceBetween={24}
        slidesPerView={1.2}
        navigation
        breakpoints={{
          576: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1296: { slidesPerView: 4 },
        }}
      >
        <div style={{ width: '1296px' }}>
          {FixedMeals.map((product) => (
            <SwiperSlide key={product.id}>
              <Link
                to={`/product/${product.id}`}
                className='text-decoration-none'
              >
                <div className='home__fixed-card h-100'>
                  <div className='position-relative overflow-hidden'>
                    {product.rank && (
                      <span className='badge rounded-pill bg-accent text-gray-600 position-absolute top-0 start-0 mt-2 ms-2 z-3'>
                        {product.rank}
                      </span>
                    )}
                    <button
                      type='button'
                      className='home__swiper-btn position-absolute bottom-0 end-0 mb-2 me-2 z-3'
                      onClick={(e) => {
                        e.preventDefault();
                        addCartBtn(product.id, 1);
                      }}
                    >
                      <i className='bi bi-bag'></i>
                    </button>
                    <img
                      src={product.img}
                      className='card-img-top object-fit-contain rounded-bottom-0'
                      alt={product.name}
                    />
                  </div>
                  <div className='card-body py-3 px-5'>
                    <div className='d-flex justify-content-between align-items-center text-gray-600 mb-1'>
                      <h5
                        className='fs-6 fs-md-5 fw-bold mb-0'
                        title={product.name}
                      >
                        {product.name}
                      </h5>
                      <span className='fs-6 fs-md-5 fw-bold'>
                        ${product.price}
                      </span>
                    </div>
                    <p className='fw-medium text-primary-300 mb-3 d-flex justify-content-between'>
                      <span title='熱量'>
                        {product.nutrition.calories} kcal
                      </span>
                      <span title='P：蛋白質｜F：脂肪｜C：碳水'>
                        P&nbsp;{product.nutrition.protein}&nbsp;|&nbsp;F&nbsp;
                        {product.nutrition.fat}&nbsp;|&nbsp;C&nbsp;
                        {product.nutrition.carbs}
                      </span>
                    </p>
                    <div className='d-flex flex-wrap gap-2'>
                      {product.tags.map((item, index) => (
                        <span key={index} className='tag-item' title={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </>
  );
};
export default BestSellerSwiper;
