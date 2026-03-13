import { Autoplay, Navigation, Pagination, A11y } from 'swiper/modules';

export const swiperConfig = {
  slidesPerView: 1,
  spaceBetween: 10,
  modules: [Autoplay, Navigation, Pagination, A11y],
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },

}