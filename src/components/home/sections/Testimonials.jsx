import { NavLink, Link } from 'react-router-dom';
import { CommentContent } from '../../../data/homeData';

// component
import CommentCard from '../CommentCard';
import ContentCard from '../ContentCard';
import FadeIn from '../FadeIn';

const TestimonialSection = () => {
  return (
    <>
      <section className='container-fluid home__testimonials px-0 py-8 py-md-10'>
        <FadeIn>
          <div className='d-flex flex-column justify-content-center align-items-center'>
            <ContentCard
              hasBorde
              subTitle='TESTIMONIALS'
              title='大家的真實分享'
              bgColor='transparent'
              textPosition='text-center'
              contentPadding='py-0 mt-0 mb-0'
            />
            <p className='text-orange-300 fs-6 fs-md-4 fw-semibold mb-2'>
              LOVE FROM OUR CUSTOMERS
            </p>
          </div>
          <section className='py-5' style={{ overflowX: 'hidden' }}>
            <div
              className='d-flex gap-2 mb-3 scroll-container'
              style={{ marginLeft: '-50px' }}
            >
              <div className='scroll-track-left'>
                {CommentContent.map((item, index) => (
                  <CommentCard
                    key={index}
                    commentContent={item.commentContent}
                    customer={item.customer}
                    star={item.star}
                  />
                ))}
              </div>
            </div>
            <div
              className='d-flex gap-2 mb-3 scroll-container'
              style={{ marginLeft: '50px' }}
            >
              <div className='scroll-track-right'>
                {CommentContent.map((item, index) => (
                  <CommentCard
                    key={index}
                    commentContent={item.commentContent}
                    customer={item.customer}
                    star={item.star}
                  />
                ))}
              </div>
            </div>
          </section>
        </FadeIn>
      </section>
    </>
  );
};
export default TestimonialSection;
