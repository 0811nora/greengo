import { NavLink, Link } from 'react-router-dom';
import { CommentContent } from '../../../data/homeData';

// component
import CommentCard from '../CommentCard';
import FadeIn from '../FadeIn';

const TestimonialSection = () => {
  return (
    <>
      <FadeIn>
        <section className='container-fluid home__testimonials px-0 py-8 py-md-10'>
          <div className=''>
            <div className='d-flex flex-column justify-content-center align-items-center'>
              <h4 className='text-gray-200 fs-6 fs-md-4 fw-semibold mb-2'>
                TESTIMONIALS
              </h4>
              <h2 className='fs-3 fs-md-1 fw-bold mb-2 mb-md-5'>
                大家的真實分享
              </h2>
              <h4 className='text-orange-300 fs-6 fs-md-4 fw-semibold mb-2'>
                LOVE FROM OUR CUSTOMERS
              </h4>
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
          </div>
        </section>
      </FadeIn>
    </>
  );
};
export default TestimonialSection;
