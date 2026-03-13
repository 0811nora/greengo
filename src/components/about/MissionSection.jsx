import BookIcon from '/img/about/about_icon_book.svg';
import ListIcon from '/img/about/about_icon_list.svg';
import StrongIcon from '/img/about/about_icon_strong.svg';

export default function MissionSection() {
  return (
    <>
      <div className='fourth-section'>
        <div className='pt-10 pb-9' >
          <h2 className='fourth-title fw-bold text-center pb-6 d-none d-md-block' data-aos="fade-up" data-aos-duration="2000" >我們的使命：讓好的選擇變得更簡單</h2>
          <h2 className='fourth-title fw-bold text-center pb-6 d-md-none d-block' data-aos="fade-up" data-aos-duration="2000" >我們的使命：<p className='py-2'>讓好的選擇變得更簡單</p></h2>
          <p className='fs-6 text-center'>健康是由許多溫柔的小選擇堆疊而成，GreenGo 想幫助你</p>
        </div>
        <div className="container">
          <div className="row  px-5">
            <div className="col-md-4"><div className="card border-0 bg-transparent text-center mb-9">
              <img src={BookIcon} className='icon mx-auto' alt="book icon" />
              <div className="card-body">
                <h5 className="card-title">讓你更容易看懂食物</h5>
              </div>
            </div>
            </div>

            <div className="col-md-4"><div className="card border-0 bg-transparent text-center mb-9">
              <img src={ListIcon} className='icon mx-auto' alt="list icon" />
              <div className="card-body">
                <h5 className="card-title">讓你更自在地做選擇</h5>
              </div>
            </div>
            </div>

            <div className="col-md-4"><div className="card border-0 bg-transparent text-center mb-9">
              <img src={StrongIcon} className='icon mx-auto' alt="strong icon" />
              <div className="card-body">
                <h5 className="card-title">讓你感受真實的健康</h5>
              </div>
            </div>
            </div>
          </div>
        </div>
        <p className='fs-md-6 text-center pb-4 px-3'>在你想吃的更好、想照顧自己的每一天裡，成為那個默默支持你的夥伴。</p>
        <p className='fs-md-6 text-center pb-10 px-3'>每一份 GREENGo，都是你對自己的溫柔回應。是你用行動換來的成果，是屬於你的「綠果」。</p>
      </div>
    </>
  )
}