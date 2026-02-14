import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';
import BookIcon from '/img/about_icon_book.svg';
import ListIcon from '/img/about_icon_list.svg';
import StrongIcon from '/img/about_icon_strong.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';



export default function About() {

    const swiperConfig = {
        slidesPerView: 1,
        spaceBetween: 10,
        modules: [Navigation, Pagination, A11y],
        // navigation: true,
        // pagination: { clickable: true },
        loop: true,

    }

    const [isOpen, setIsOpen] = useState(false);

    const QA_order = [
        {
            title: "我該如何訂購客製化餐點？",
            content: "前往自由搭配頁，依序挑選主食、蛋白質、配料與醬汁，系統會即時顯示熱量與營養素。",
            id: "howToOder1",
        },
        {
            title: "是否有最低訂購量或金額限制？",
            content: "無，歡迎盡情選購！",
            id: "howToOder2",
        },
        {
            title: "可以同時訂購固定套餐與客製化餐嗎？",
            content: "可以的，您可同時訂購固定套餐與客製化餐點，滿足不同需求。",
            id: "howToOder3",
        },
        {
            title: "如何知道我的餐點已經成功下訂？",
            content: "您可登入會員中心，前往「訂單紀錄」查看訂單狀態，若顯示訂單成立即代表已成功下訂。",
            id: "howToOder4",
        },
        {
            title: "訂單可以修改或取消嗎？什麼時候可以取消？",
            content: "訂單成立後恕無法修改，但可於「尚未付款」前自行取消訂單；若已完成付款，則無法取消。",
            id: "howToOder5",
        },
    ];

    const QA_take = [
        {
            title: "GreenGo 提供外送服務嗎？",
            content: "目前尚未提供外送服務，僅可選擇外帶服務。",
            id: "howTotake1",
        },
        {
            title: "外帶餐點可以提前多久預訂？",
            content: "外帶餐點需依訂購數量決定預訂時間；一般訂單可當天預訂，大量餐點請於 3 天前完成下訂，以利備料與安排製作。",
            id: "howTotake2",
        },
        {
            title: "取餐時需要出示什麼資訊？",
            content: "取餐時請提供會員中心「訂單紀錄」中的取餐號碼，以利我們快速為您核對餐點。",
            id: "howTotake3",
        },

    ];

    const QA_payment = [
        {
            title: "支付方式有哪些？",
            content: "目前提供信用卡／金融卡（Visa、Master、JCB）、電子支付（LINE Pay、街口支付、Apple Pay）及臨櫃現金付款。",
            id: "howToPay1",
        },
        {
            title: "線上付款安全嗎？需要輸入哪些資訊？",
            content: "我們使用的線上付款平台皆採用國際安全加密技術（HTTPS），保護您的交易資料不被竊取。只要在官方付款頁面操作，一般是非常安全的。建議您避免在陌生網站或可疑連結輸入付款資訊。",
            id: "howToPay2",
        },
        {
            title: "付款後是否可以索取電子發票或收據？",
            content: "可以的！員工會在您取餐時，隨餐一併提供電子發票或收據，麻煩協助於取餐時確認發票資訊是否正確。",
            id: "howToPay3",
        },
    ];

    const QA_member = [
        {
            title: "如何註冊／登入會員？",
            content: "您可以點擊網站右上角的「註冊／登入」按鈕，依照提示輸入手機號碼或電子信箱，完成驗證後即可成為會員並登入。",
            id: "howToMember1",
        },
        {
            title: "忘記密碼怎麼辦？",
            content: "如果忘記密碼，請點擊網站右上角的「登入」→「忘記密碼」，輸入您註冊的手機號碼或電子信箱，我們會寄送驗證連結或一次性密碼，讓您重新設定密碼並順利登入會員。",
            id: "howToMember2",
        },
        {
            title: "一定要加入會員才能點餐嗎？",
            content: "是的，我們的線上點餐服務需要會員登入才能使用。建議您先完成註冊，還能享受會員優惠。",
            id: "howToMember3",
        },
        {
            title: "可以修改個人資料嗎？",
            content: "可以的！登入會員後，進入「會員中心」或「個人資料」頁面，即可修改您的姓名、電話、電子信箱等資訊。",
            id: "howToMember4",
        },
        {
            title: "會員是否可以查看歷史訂單與訂餐紀錄？",
            content: "可以的！會員登入後，進入「訂單紀錄」頁面，即可查看過去的訂餐紀錄，包含訂單內容、付款狀態與取餐日期。",
            id: "howToMember5",
        },
        {
            title: "是否有累積點數或優惠券功能？",
            content: "我們目前沒有點數累積功能，但會員可使用系統發放的優惠券享受折扣，讓用餐更划算。",
            id: "howToMember6",
        },
    ];


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
                <div className="bgc-first">
                    <h1 className="fw-bold text-center main-title " >GreenGo綠果</h1>
                    <p className=" main-content text-center pt-5 px-5" >當你願意從「綠」開始，健康就會在你身上慢慢結「果」。</p>
                    <div className='topHalfImg mt-img'>
                        <img src={`${import.meta.env.BASE_URL}img/about_bowl.png`} alt="bowl" />
                    </div>
                </div>

                <div>


                    <div className='second_section position-relative d-none d-md-block'>
                        <div className='mid-sec py-10'>
                            <div className='container-fluid'>
                                <div className='row g-3'>
                                    <div className='col-md-6'>
                                        <div className='img-border mx-10 ms-10 '>
                                            <img className='img-fluid mt-8 ms-9 ' src={`${import.meta.env.BASE_URL}img/about_action.png`} alt="making bowl" />
                                        </div>

                                    </div>

                                    <div className='col-md-6 my-10'>

                                        <div className=' fs-2 lh-sm mb-8'>
                                            <h2 className='sub-title'>行動，<span className='d-block sub-title'>然後成果。</span> </h2>
                                            <h3 className='sub-title'>The Story of GreenGo</h3>

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
                                            <p>GreenGo 的誕生，源自一個簡單卻真實的疑問：</p>
                                        </div>
                                        <div className='text-border'>
                                            <p>「我到底吃了什麼？」</p>
                                            <p>「我吃的這份餐點，真的適合我嗎？」</p>
                                        </div>

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

                    <div className="second_sm_section d-md-none d-block overflow-hidden">
                        <div className='position-relative'>
                            <img className='opacity-50 ' src={`${import.meta.env.BASE_URL}img/about_action.png`} alt="making bowl" />
                            <div className='  position-absolute top-30 end-10'>
                                <h2 className='fs-2 lh-sm  sub-title'>行動，<span className='d-block sub-title'>然後成果。</span> </h2>
                                <h3 className='fs-5 lh-sm  sub-title'>The Story of GreenGo</h3>
                            </div>
                            <div className="position-absolute top-10 start-10">
                                <div className='img-sm-border-1'></div>
                            </div>
                            <div className="position-absolute bottom-10 start-10">
                                <div className='img-sm-border-2'></div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center align-items-center mid-sec">
                            <div className="py-8 px-5">
                                <div className='pb-6 '>
                                    <p >GreenGo 的名字，結合了 Green 與 Go／果。</p>
                                    <p>Green，代表自然、清新與健康；</p>

                                    <p>Go／果，則是你為自己採取行動後，在你身上慢慢開出的成果。</p>
                                </div>
                                <div className='pb-6'>
                                    <p>在快節奏的城市裡，外食選擇很多，</p>
                                    <p>但真正透明、直覺、能讓人安心掌控的選擇，其實不多。</p>
                                </div>

                                <div className='pb-6'>
                                    <p>GreenGo 的誕生，源自一個簡單卻真實的疑問：</p>
                                </div>
                                <div className='text-border'>
                                    <p>「我到底吃了什麼？」</p>
                                    <p>「我吃的這份餐點，真的適合我嗎？」</p>
                                </div>
                            </div>
                        </div>
                        <div className='ms-4 pb-8'>
                            <div className='third-sec  py-4 ps-6 pe-2'>
                                <p className='pb-6 pe-8'>因此，GreenGo 想陪你把「行動」變成「成果」。<p>讓你看得懂食物、自在做選擇，為自己的身體負責。</p></p>


                                <p className=''>
                                    當你選擇透明、選擇可控、選擇對身體友善，<p>最終收穫的，就是屬於你的健康與自在 ——<p>那就是我們所說的「綠果」。</p></p></p>
                            </div>
                        </div>


                    </div>

                    <div className='third-section d-none d-md-block'>
                        <div className='pt-10 pb-9' >
                            <h2 className='third-title fw-bold text-center'>我們相信：健康不是限制，而是自由</h2>
                        </div>

                        <div className="container">
                            <div className="card-group">
                                <div className="card border-0 bg-transparent text-center mb-9">
                                    <div className="card-body">
                                        <h5 className="card-title">透明</h5>
                                        <p className="card-text">食物的資訊應該被看見</p>
                                        <p className="card-text"><small className="text-body-secondary "><p>每一份主食、配料與醬汁，</p><p>我們都清楚標示熱量與營養素</p>
                                            <p>你不需要猜，也不必盲選。</p></small></p>
                                    </div>
                                    <img src={`${import.meta.env.BASE_URL}img/about_tuna.jpg`} className="rounded-circle mx-auto" alt="tuna img" />
                                </div>
                                <div className="card border-0 bg-transparent text-center mb-9">

                                    <img src={`${import.meta.env.BASE_URL}img/about_tomato.jpg`} className="rounded-circle mx-auto" alt="tomato img" />
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
                                    <img src={`${import.meta.env.BASE_URL}img/about_lettuce.jpg`} className="rounded-circle mx-auto" alt="lettuce img" />

                                </div>

                            </div>
                        </div>

                        <div className='pb-10 ' >
                            <h2 className='text-center fw-bold mb-5 third-title'>只要讓 GreenGo 陪伴，健康就會自然到位。</h2>
                        </div>

                    </div>


                    <div className="third_sm_section d-md-none d-block">
                        <div className='pt-10 pb-9' >
                            <h2 className='third-title fw-bold text-center '>我們相信：<p className='py-2'>健康不是限制，而是自由</p></h2>
                        </div>

                        <Swiper {...swiperConfig} >
                            <SwiperSlide>
                                <div className="card border-0 bg-transparent text-center mb-9">
                                    <img src={`${import.meta.env.BASE_URL}img/about_tuna.jpg`} className="rounded-circle mx-auto" alt="tuna img" />
                                    <div className="card-body">
                                        <h5 className="card-title">透明</h5>
                                        <p className="card-text">食物的資訊應該被看見</p>
                                        <p className="card-text"><small className="text-body-secondary "><p>每一份主食、配料與醬汁，</p><p>我們都清楚標示熱量與營養素</p>
                                            <p>你不需要猜，也不必盲選。</p></small></p>
                                    </div>

                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="card border-0 bg-transparent text-center mb-9">
                                    {/* 看以後要不要改這邊的字型排版 */}
                                    <img src={`${import.meta.env.BASE_URL}img/about_tomato.jpg`} className="rounded-circle mx-auto" alt="tomato img" />
                                    <div className="card-body">
                                        <h5 className="card-title">簡單</h5>
                                        <p className="card-text">食物的資訊應該被看見</p>
                                        <p className="card-text"><small className="text-body-secondary">
                                            <p>我們把系統與飲食變得更直覺</p>
                                            <p>輕鬆點兩下，一目了然營養變化，</p>
                                            <p>你不必痛苦計算，不必強迫自己。</p></small></p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="card border-0 bg-transparent text-center mb-9">
                                    <img src={`${import.meta.env.BASE_URL}img/about_lettuce.jpg`} className="rounded-circle mx-auto" alt="lettuce img" />
                                    <div className="card-body">
                                        <h5 className="card-title">可控</h5>
                                        <p className="card-text">你說了算的飲食自由</p>
                                        <p className="card-text"><small className="text-body-secondary">
                                            <p>不需要被套餐限制，也不需要迎合別人的飲食方式。</p>
                                            <p>想吃什麼、想如何搭配，永遠由你決定。 </p>
                                            <p>跳脫制式套裝，你能自由組織屬於自己的餐點。</p></small></p>
                                    </div>


                                </div>
                            </SwiperSlide>
                        </Swiper>

                        <div className='pb-10 ' >
                            <h2 className='text-center fw-bold mb-5 third-title'>只要讓 GreenGo 陪伴，
                                <p className='py-2'>健康就會自然到位。</p></h2>
                        </div>

                    </div>

                    <div className='fourth-section'>
                        <div className='pt-10 pb-9' >
                            <h2 className='fourth-title fw-bold text-center pb-6 d-none d-md-block'>我們的使命：讓好的選擇變得更簡單</h2>
                            <h2 className='fourth-title fw-bold text-center pb-6 d-md-none d-block'>我們的使命：<p className='py-2'>讓好的選擇變得更簡單</p></h2>
                            <p className='fs-6 text-center'>健康是由許多溫柔的小選擇堆疊而成，GreenGo 想幫助你</p>
                        </div>

                        <div className="container">
                            <div className="row  px-5">
                                <div className="col-md-4"><div className="card border-0 bg-transparent text-center mb-9">
                                    <img src={BookIcon} className='icon mx-auto' alt="book icon" />
                                    <div className="card-body">
                                        <h5 className="card-title">讓你更容易看懂食物</h5>

                                    </div>

                                </div></div>

                                <div className="col-md-4"><div className="card border-0 bg-transparent text-center mb-9">

                                    <img src={ListIcon} className='icon mx-auto' alt="list icon" />
                                    <div className="card-body">
                                        <h5 className="card-title">讓你更自在地做選擇</h5>

                                    </div>
                                </div></div>


                                <div className="col-md-4"><div className="card border-0 bg-transparent text-center mb-9">
                                    <img src={StrongIcon} className='icon mx-auto' alt="strong icon" />
                                    <div className="card-body">
                                        <h5 className="card-title">讓你感受真實的健康</h5>

                                    </div>


                                </div></div>


                            </div>
                        </div>

                        <p className='fs-md-6 text-center pb-4 px-3'>在你想吃的更好、想照顧自己的每一天裡，成為那個默默支持你的夥伴。</p>

                        <p className='fs-md-6 text-center pb-10 px-3'>每一份 GREENGo，都是你對自己的溫柔回應。是你用行動換來的成果，是屬於你的「綠果」。</p>

                    </div>

                    <div className="fifth-section">
                        <div className="bottomHalfImg d-flex align-items-end">
                            <img src={`${import.meta.env.BASE_URL}img/about_bowl.png`} alt="bowl" />

                        </div>
                        <h1 className='text-center fifth-title fw-bold mb-9'>常見問題</h1>


                        <div className='mx-auto w-75'>
                            <h2 className='fifth-Q-subject'>一、訂餐相關</h2>
                            {QA_order.map(order =>
                                <div className='QA-border' data-bs-toggle="collapse"
                                    data-bs-target={`#${order.id}`}
                                    aria-expanded="false"
                                    aria-controls={order.id}
                                    onClick={() => setIsOpen(!isOpen)}>
                                    <div className='d-flex justify-content-between align-items-center ' >
                                        <p className='fifth-Q-title '>{order.title}</p>
                                        <div className='pe-2'  >
                                            <i className={`bi ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}  `}></i>
                                        </div>
                                    </div>

                                    <div className="collapse" id={order.id}>
                                        <div className="border-0 bg-transparent pt-4">
                                            <p className='fifth-A'>{order.content}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <h2 className='fifth-Q-subject'>二、配送／取餐</h2>
                            {QA_take.map(take =>
                                <div className='QA-border' data-bs-toggle="collapse"
                                    data-bs-target={`#${take.id}`}
                                    aria-expanded="false"
                                    aria-controls={take.id}
                                    onClick={() => setIsOpen(!isOpen)}>
                                    <div className='d-flex justify-content-between align-items-center ' >
                                        <p className='fifth-Q-title '>{take.title}</p>
                                        <div className='pe-2'  >
                                            <i className={`bi ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}  `}></i>
                                        </div>
                                    </div>

                                    <div className="collapse" id={take.id}>
                                        <div className="border-0 bg-transparent pt-4">
                                            <p className='fifth-A'>{take.content}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <h2 className='fifth-Q-subject'>三、付款相關</h2>
                            {QA_payment.map(pay =>
                                <div className='QA-border' data-bs-toggle="collapse"
                                    data-bs-target={`#${pay.id}`}
                                    aria-expanded="false"
                                    aria-controls={pay.id}
                                    onClick={() => setIsOpen(!isOpen)}>
                                    <div className='d-flex justify-content-between align-items-center ' >
                                        <p className='fifth-Q-title '>{pay.title}</p>
                                        <div className='pe-2'  >
                                            <i className={`bi ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}  `}></i>
                                        </div>
                                    </div>

                                    <div className="collapse" id={pay.id}>
                                        <div className="border-0 bg-transparent pt-4">
                                            <p className='fifth-A'>{pay.content}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <h2 className='fifth-Q-subject'>四、會員相關</h2>
                            {QA_member.map(member =>
                                <div className='QA-border' data-bs-toggle="collapse"
                                    data-bs-target={`#${member.id}`}
                                    aria-expanded="false"
                                    aria-controls={member.id}
                                    onClick={() => setIsOpen(!isOpen)}>
                                    <div className='d-flex justify-content-between align-items-center ' >
                                        <p className='fifth-Q-title '>{member.title}</p>
                                        <div className='pe-2'  >
                                            <i className={`bi ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}  `}></i>
                                        </div>
                                    </div>

                                    <div className="collapse" id={member.id}>
                                        <div className="border-0 bg-transparent pt-4">
                                            <p className='fifth-A'>{member.content}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className='d-flex justify-content-center py-9'>
                            <a className='home__btn-primary' href='#/product'>前往點餐</a>
                        </div>


                    </div>




                </div>


            </main>
        </>
    )
}