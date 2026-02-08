import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import BookIcon from '/img/about_icon_book.svg';
import ListIcon from '/img/about_icon_list.svg';
import StrongIcon from '/img/about_icon_strong.svg';

export default function About() {
    useEffect(() => {
        AOS.init({
            // // 這裡可以設定全域參數
            // duration: 1000, // 動畫持續時間
            // once: false,    // 是否只動畫一次
        });
    }, []);
    return (
        <>
            <main className="c-about">
                <div className="topHalfImg">

                    <h1 className="fw-bold text-center main-title" >GreenGo綠果</h1>
                    <p className="sub-content fs-4" >當你願意從「綠」開始，健康就會在你身上慢慢結「果」。</p>
                    {/* 這邊還沒改完，AOS動畫與transfer衝突 */}
                    <img src="/img/about_bowl.png" alt="bowl" /></div>
                <div>


                    <div className='second_section position-relative'>
                        <div className='mid-sec py-10'>
                            <div className='container-fluid'>
                                <div className='row g-3'>
                                    <div className='col-md-6'>
                                        <div className='img-border d-none d-md-block mx-10 ms-10 '>
                                            <img className='img-fluid mt-8 ms-9 ' src="/img/about_action.png" alt="bowl" />
                                        </div>

                                    </div>

                                    <div className='col-md-6 my-10'>

                                        <div className='d-none d-md-block sub-title fw-semibold fs-2 lh-sm mb-8'>
                                            <h2>行動，<span className='d-block'>然後成果。</span> </h2>
                                            <h3>The Story of GreenGo</h3>

                                        </div>
                                        <div className='pb-6'>
                                            <p >GreenGo 的名字，結合了 Green 與 Go／果。</p>
                                            <p>Green，代表自然、清新與健康；</p>

                                            <p>Go／果，則是你為自己採取行動後，在你身上慢慢開出的成果。</p>
                                        </div>
                                        <div className='pb-6'>
                                            <p>在快節奏的城市裡，外食選擇很多，</p>
                                            <p>但真正透明、直覺、能讓人安心掌控的選擇，其實不多。</p>
                                        </div>

                                        <div className='pb-6'>
                                            <p>GreenGo 的誕生，源自一個簡單卻真實的疑問：</p></div>
                                        <div>
                                            <p>「我到底吃了什麼？」</p>
                                            <p>「我吃的這份餐點，真的適合我嗎？」</p></div>

                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='third-sec position-absolute bottom-10 end-0 py-6 px-7'>
                            <p className='pb-6 pe-8'>因此，GreenGo 想陪你把「行動」變成「成果」。<p>讓你看得懂食物、自在做選擇，為自己的身體負責。</p></p>


                            <p className=''>
                                當你選擇透明、選擇可控、選擇對身體友善，<p>最終收穫的，就是屬於你的健康與自在 ——<p>那就是我們所說的「綠果」。</p></p></p>
                        </div>
                    </div>

                    <div className='third-section'>
                        <div className='pt-10 pb-9' ><h2 className='sub-title text-center'>我們相信：健康不是限制，而是自由</h2></div>

                        <div className="card-group">
                            <div className="card border-0 bg-transparent text-center mb-9">
                                <div className="card-body">
                                    <h5 className="card-title">透明</h5>
                                    <p className="card-text">食物的資訊應該被看見</p>
                                    <p className="card-text"><small className="text-body-secondary "><p>每一份主食、配料與醬汁，</p><p>我們都清楚標示熱量與營養素</p>
                                        <p>你不需要猜，也不必盲選。</p></small></p>
                                </div>
                                <img src="/img/about_tuna.jpg" className="rounded-circle mx-auto" alt="..." />
                            </div>
                            <div className="card border-0 bg-transparent text-center mb-9">

                                <img src="/img/about_tomato.jpg" className="rounded-circle mx-auto" alt="..." />
                                <div className="card-body">
                                    <h5 className="card-title">簡單</h5>
                                    <p className="card-text">食物的資訊應該被看見</p>
                                    <p className="card-text"><small className="text-body-secondary">
                                        <p>我們把系統與飲食變得更直覺</p>
                                        <p>輕鬆點兩下，一目了然營養變化，</p>
                                        <p>你不必痛苦計算，不必強迫自己。</p></small></p>
                                </div>
                            </div>
                            <div className="card border-0 bg-transparent text-center mb-9">
                                <div className="card-body">
                                    <h5 className="card-title">可控</h5>
                                    <p className="card-text">你說了算的飲食自由</p>
                                    <p className="card-text"><small className="text-body-secondary">
                                        <p>不需要被套餐限制，也不需要迎合別人的飲食方式。</p>
                                        <p>想吃什麼、想如何搭配，永遠由你決定。 </p>
                                        <p>跳脫制式套裝，你能自由組織屬於自己的餐點。</p></small></p>
                                </div>
                                <img src="/img/about_lettuce.jpg" className="rounded-circle mx-auto" alt="..." />

                            </div>

                        </div>

                        <div className='pb-10' ><h2 className='text-center fw-bold'>只要讓 GreenGo 陪伴，健康就會自然到位。</h2></div>

                    </div>

                    <div className='fourth-section'>
                        <div className='pt-10 pb-9' ><h2 className='sub-title text-center pb-6'>我們的使命：讓好的選擇變得更簡單</h2>
                            <p className='fs-6 text-center'>健康是由許多溫柔的小選擇堆疊而成，GreenGo 想幫助你</p></div>

                        <div className="container">
                            <div className="row  px-5">
                                <div className="col-md-4"><div className="card border-0 bg-transparent text-center mb-9">
                                    <img src={BookIcon} className='icon mx-auto' alt="" />
                                    <div className="card-body">
                                        <h5 className="card-title">讓你更容易看懂食物</h5>

                                    </div>

                                </div></div>

                                <div className="col-md-4"><div className="card border-0 bg-transparent text-center mb-9">

                                    <img src={ListIcon} className='icon mx-auto' alt="" />
                                    <div className="card-body">
                                        <h5 className="card-title">讓你更自在地做選擇</h5>

                                    </div>
                                </div></div>


                                <div className="col-md-4"><div className="card border-0 bg-transparent text-center mb-9">
                                    <img src={StrongIcon} className='icon mx-auto' alt="" />
                                    <div className="card-body">
                                        <h5 className="card-title">讓你感受真實的健康</h5>

                                    </div>


                                </div></div>


                            </div>
                        </div>

                        <p className='fs-6 text-center pb-4'>在你想吃的更好、想照顧自己的每一天裡，成為那個默默支持你的夥伴。</p>

                        <p className='fs-6 text-center pb-10'>每一份 GREENGo，都是你對自己的溫柔回應。是你用行動換來的成果，是屬於你的「綠果」。</p>

                    </div>

                    {/* 0208進度：做完第四個區塊，之後做問答區 */}

                </div>


            </main>
        </>
    )
}