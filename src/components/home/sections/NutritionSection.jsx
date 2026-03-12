// import { useState, useEffect, useRef } from 'react';
import { PageLinks } from '../../../data/homeData';
import FadeIn from '../FadeIn';
import FeatureCard from '../FeatureCard';
import ContentCard from '../ContentCard';

const NutritionSection = () => {
  return (
    <>
      {/* Nutrition */}
      <section className='container-fluid home__nur-section py-8 py-md-10'>
        <FadeIn>
          {' '}
          <div className='container py-6'>
            <div className='row'>
              {/* 說明 */}
              <div className='d-flex align-item-center mb-5'>
                {/* 標題文字區 */}
                <div>
                  <ContentCard
                    subTitle='YOUR NUTRITION, DECODED'
                    title={
                      <>
                        拒絕盲吃！
                        <br />
                        營養成分，
                        <span className=''>即時看得見</span>。
                      </>
                    }
                    description={
                      <>別讓算熱量成了負擔，你的每一份營養，由我們幫你把關。</>
                    }
                    bgColor='transparent'
                    textPosition='text-start'
                    contentPosition='align-items-start'
                  />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-6 mb-4 mb-md-0'>
                <FeatureCard
                  to={PageLinks.productLink.url}
                  imgSrc={`${import.meta.env.BASE_URL}img/items/bowl-3.png`}
                  bubbleClass='bg-bubble'
                  tagText='為你搭配好'
                  tagIcon='bi-stars'
                  title='綠果精選系列'
                  description={
                    <>
                      營養師與主廚共同研發，把完美的巨量營養素比例藏在美味裡。
                      <br />
                      把營養交給我們，你只需要張開嘴巴安心吃就好！
                    </>
                  }
                  linkText={PageLinks.productLink.title}
                />
              </div>
              <div className='col-md-6 mb-4 mb-md-0'>
                <FeatureCard
                  to={PageLinks.customLink.url}
                  imgSrc={`${import.meta.env.BASE_URL}img/items/bowl-4.png`}
                  bubbleClass='bg-bubble2'
                  tagText='由你自由配'
                  tagIcon='bi-asterisk'
                  title='客製自由配'
                  description={
                    <>
                      今天想多點肉？還是嚴格無澱粉？
                      <br />
                      超過 15
                      種健康配料任你挑選，點餐時即時計算總熱量，打造專屬於你的超完美餐盒。
                    </>
                  }
                  linkText={PageLinks.customLink.title}
                />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
};
export default NutritionSection;
