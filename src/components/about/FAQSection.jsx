import QA_item from './QaItem';
import { QA_member, QA_take, QA_order, QA_payment } from './qaData';
import { Link } from 'react-router-dom';

export default function FAQSection() {
  return (
    <>
      <div className="fifth-section" id="faq-section">
        <div className="bottomHalfImg d-flex align-items-end">
          <img src={`${import.meta.env.BASE_URL}img/about/about_bowl.png`} alt="bowl" />
        </div>
        <h1 className='text-center fifth-title fw-bold mb-9'>常見問題</h1>
        <div className='mx-auto w-75'>
          <h2 className='fifth-Q-subject'>一、訂餐相關</h2>
          {QA_order.map(order =>
            <QA_item key={order.id} item={order} />
          )}
          <h2 className='fifth-Q-subject'>二、配送／取餐</h2>
          {QA_take.map(take =>
            <QA_item key={take.id} item={take} />
          )}
          <h2 className='fifth-Q-subject'>三、付款相關</h2>
          {QA_payment.map(payment =>
            <QA_item key={payment.id} item={payment} />
          )}
          <h2 className='fifth-Q-subject'>四、會員相關</h2>
          {QA_member.map(member =>
            <QA_item key={member.id} item={member} />
          )}
        </div>
        <div className='d-flex justify-content-center py-9'>
          <Link className='home__btn-primary' to='/product'>前往點餐</Link>
        </div>
      </div>
    </>
  )
}