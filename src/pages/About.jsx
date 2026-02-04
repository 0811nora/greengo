import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

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
                    <img src="../public/img/about_bowl.png" alt="bowl" /></div>
                <div>


                    <div className='second_section position-relative'>
                        <div className='mid-sec  position-absolute top-0 start-0 py-10'>
                            <div className='container-fluid'>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className='img-border d-none d-md-block mt-10 ms-10 '>
                                            <img className='img-fluid mt-md-8 ms-md-9 ' src="../public/img/about_action.png" alt="bowl" />
                                        </div>

                                    </div>

                                    <div className='col-md-6 mt-10'>
                                        <div className='d-none d-md-block sub-title fw-semibold fs-2 lh-sm mt-6'>
                                            <h2>行動，<span className='d-block'>然後成果。</span> </h2>
                                            <h3>The Story of GreenGo</h3>
                                        </div>
                                        {/* 0205進度 */}
                                        <div><p >GreenGo 的名字，結合了 Green 與 Go／果。Green，代表自然、清新與健康；Go／果，則是你為自己採取行動後，在你身上慢慢開出的成果。</p></div>

                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='third-sec position-absolute bottom-10 end-0 py-6 px-7'>
                            <p>因此，GreenGo 想陪你把「行動」變成「成果」。讓你看得懂食物、自在做選擇，為自己的身體負責。</p>
                            <p>
                                當你選擇透明、選擇可控、選擇對身體友善，最終收穫的，就是屬於你的健康與自在 ——那就是我們所說的「綠果」。</p>
                        </div>
                    </div>

                </div>


            </main>
        </>
    )
}