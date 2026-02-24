import { PageLinks } from '../../../data/homeData';
// component
import ContentCard from '../ContentCard';
import StepCard from '../StepCard';
import FadeIn from '../FadeIn';

const CustomSection = () => {
  return (
    <>
      <section className='home__custom position-relative'>
        <div className='container mb-0'>
          <div className='row d-flex align-items-center mb-0'>
            {/* 左側卡片介紹 */}
            <div className='col-md-6'>
              <ContentCard
                subTitle='MAKE YOUR BITE'
                title={
                  <>
                    訂製自己的健康
                    <br />
                    不需要複雜
                  </>
                }
                description={
                  <>
                    從基底、主食到蔬菜與醬料，慢慢堆疊屬於自己的風味。
                    <br />
                    健康其實不難，他只需要一點點透明與理解。
                  </>
                }
                buttonText='前往客製化點餐'
                bgColor='transparent'
                textPosition='text-center'
                to={PageLinks.customLink.url}
              />
            </div>
            {/* 右側卡片說明 */}
            <div className='col-md-6 position-relative'>
              <StepCard />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default CustomSection;
