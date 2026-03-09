import { Swiper, SwiperSlide } from 'swiper/react';
import { swiperConfig } from './swiperConfig';

export default function BeliefSection() {
  return (
    <>
      <div className='third-section d-none d-md-block'>
        <div className='pt-10 pb-9' >
          <h2 className='third-title fw-bold text-center' data-aos="fade-up">我們相信：健康不是限制，而是自由</h2>
        </div>
        <div className="container">
          <div className="card-group">
            <div className="card border-0 bg-transparent text-center mb-9">
              <div className="card-body">
                <h5 className="card-title fw-bold fs-4 third-title">透明</h5>
                <p className="card-text fw-bold fs-6">食物的資訊應該被看見</p>
                <div className="card-text"><small className="text-body-secondary ">
                  <p>每一份主食、配料與醬汁，</p>
                  <p>我們都清楚標示熱量與營養素</p>
                  <p>你不需要猜，也不必盲選。</p>
                </small>
                </div>
              </div>
              <img src={`${import.meta.env.BASE_URL}img/about/about_tuna.jpg`} className="rounded-circle mx-auto" alt="tuna img" />
            </div>
            <div className="card border-0 bg-transparent text-center mb-9">
              <img src={`${import.meta.env.BASE_URL}img/about/about_tomato.jpg`} className="rounded-circle mx-auto" alt="tomato img" />
              <div className="card-body">
                <h5 className="card-title fw-bold fs-4 third-title">簡單</h5>
                <p className="card-text fw-bold fs-6">食物的資訊應該被看見</p>
                <div className="card-text"><small className="text-body-secondary">
                  <p>我們把系統與飲食變得更直覺</p>
                  <p>輕鬆點兩下，一目了然營養變化，</p>
                  <p>你不必痛苦計算，不必強迫自己。</p></small></div>
              </div>
            </div>
            <div className="card border-0 bg-transparent text-center mb-9">
              <div className="card-body">
                <h5 className="card-title fw-bold fs-4 third-title">可控</h5>
                <p className="card-text fw-bold fs-6">你說了算的飲食自由</p>
                <div className="card-text"><small className="text-body-secondary">
                  <p>不需要被套餐限制，也不需要迎合別人的飲食方式。</p>
                  <p>想吃什麼、想如何搭配，永遠由你決定。 </p>
                  <p>跳脫制式套裝，你能自由組織屬於自己的餐點。</p></small></div>
              </div>
              <img src={`${import.meta.env.BASE_URL}img/about/about_lettuce.jpg`} className="rounded-circle mx-auto" alt="lettuce img" />
            </div>
          </div>
        </div>

        <div className='pb-10 ' >
          <h2 className='text-center fw-bold mb-5 third-title'>只要讓 GreenGo 陪伴，健康就會自然到位。</h2>
        </div>
      </div>

      <div className="third_sm_section d-md-none d-block">
        <div className='pt-10 pb-9' >
          <h2 className='third-title fw-bold text-center ' data-aos="fade-up">我們相信：<p className='py-2'>健康不是限制，而是自由</p></h2>
        </div>
        <Swiper {...swiperConfig} >
          <SwiperSlide>
            <div className="card border-0 bg-transparent text-center mb-9">
              <img src={`${import.meta.env.BASE_URL}img/about/about_tuna.jpg`} className="rounded-circle mx-auto" alt="tuna img" />
              <div className="card-body">
                <h5 className="card-title third-title fs-4 fw-bold">透明</h5>
                <p className="card-text fs-6 fw-semibold">食物的資訊應該被看見</p>
                <div className="card-text"><small className="text-body-secondary "><p>每一份主食、配料與醬汁，</p><p>我們都清楚標示熱量與營養素</p>
                  <p>你不需要猜，也不必盲選。</p></small></div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card border-0 bg-transparent text-center mb-9">
              <img src={`${import.meta.env.BASE_URL}img/about/about_tomato.jpg`} className="rounded-circle mx-auto" alt="tomato img" />
              <div className="card-body">
                <h5 className="card-title third-title fs-4 fw-bold">簡單</h5>
                <p className="card-text fs-6 fw-semibold">食物的資訊應該被看見</p>
                <div className="card-text"><small className="text-body-secondary">
                  <p>我們把系統與飲食變得更直覺</p>
                  <p>輕鬆點兩下，一目了然營養變化，</p>
                  <p>你不必痛苦計算，不必強迫自己。</p></small></div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card border-0 bg-transparent text-center mb-9">
              <img src={`${import.meta.env.BASE_URL}img/about/about_lettuce.jpg`} className="rounded-circle mx-auto" alt="lettuce img" />
              <div className="card-body">
                <h5 className="card-title third-title fs-4 fw-bold">可控</h5>
                <p className="card-text fs-6 fw-semibold">你說了算的飲食自由</p>
                <div className="card-text"><small className="text-body-secondary">
                  <p>不需要被套餐限制，也不需要迎合別人的飲食方式。</p>
                  <p>想吃什麼、想如何搭配，永遠由你決定。 </p>
                  <p>跳脫制式套裝，你能自由組織屬於自己的餐點。</p></small></div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

        <div className='pb-10 ' >
          <h2 className='text-center fw-bold mb-5 third-title'>只要讓 GreenGo 陪伴，
            <p className='py-2'>健康就會自然到位。</p></h2>
        </div>
      </div>

    </>
  )
}