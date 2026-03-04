import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState, useRef } from 'react';
import Matter from 'matter-js';
import BookIcon from '/img/about/about_icon_book.svg';
import ListIcon from '/img/about/about_icon_list.svg';
import StrongIcon from '/img/about/about_icon_strong.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, A11y } from 'swiper/modules';
// import decomp from 'poly-decomp';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';



export default function About() {



    const MatterStepOne = () => {
        const boxRef = useRef(null);
        const canvasRef = useRef(null);
        const itemImages = [

            { url: `${import.meta.env.BASE_URL}img/items/beet.png`, scale: 0.2 },
            { url: `${import.meta.env.BASE_URL}img/items/bellPepper.png`, scale: 0.2 },
            { url: `${import.meta.env.BASE_URL}img/items/bitterMelon.png`, scale: 0.3 },
            { url: `${import.meta.env.BASE_URL}img/items/broccoli.png`, scale: 0.3 },
            { url: `${import.meta.env.BASE_URL}img/items/cabbage.png`, scale: 0.3 },
            { url: `${import.meta.env.BASE_URL}img/items/carrot.png`, scale: 0.3 },
            { url: `${import.meta.env.BASE_URL}img/items/corn.png`, scale: 0.3 },
            { url: `${import.meta.env.BASE_URL}img/items/cucumber.png`, scale: 0.3 },
            { url: `${import.meta.env.BASE_URL}img/items/eggplant.png`, scale: 0.3 },
            { url: `${import.meta.env.BASE_URL}img/items/potato.png`, scale: 0.3 },
            { url: `${import.meta.env.BASE_URL}img/items/pumpkin.png`, scale: 0.3 },
            { url: `${import.meta.env.BASE_URL}img/items/radish.png`, scale: 0.3 },
            { url: `${import.meta.env.BASE_URL}img/items/salmon.png`, scale: 0.03 },
            { url: `${import.meta.env.BASE_URL}img/items/scallion.png`, scale: 0.3 },
            { url: `${import.meta.env.BASE_URL}img/items/spinach.png`, scale: 0.3 },
            { url: `${import.meta.env.BASE_URL}img/items/tomato.png`, scale: 0.3 },
            { url: `${import.meta.env.BASE_URL}img/member/food-1.png`, scale: 0.1 },
            { url: `${import.meta.env.BASE_URL}img/member/food-2.png`, scale: 0.1 },
            { url: `${import.meta.env.BASE_URL}img/member/food-3.png`, scale: 0.1 },
            { url: `${import.meta.env.BASE_URL}img/member/food-4.png`, scale: 0.1 },
            { url: `${import.meta.env.BASE_URL}img/member/food-5.png`, scale: 0.1 },
            { url: `${import.meta.env.BASE_URL}img/member/food-6.png`, scale: 0.1 },
            { url: `${import.meta.env.BASE_URL}img/member/food-7.png`, scale: 0.1 },
            { url: `${import.meta.env.BASE_URL}img/member/food-8.png`, scale: 0.1 },
            { url: `${import.meta.env.BASE_URL}img/member/food-9.png`, scale: 0.1 },
            { url: `${import.meta.env.BASE_URL}img/member/food-10.png`, scale: 0.1 },
        ];

        useEffect(() => {
            const { Engine, Render, Runner, Bodies, Composite, Events, Body, MouseConstraint, Mouse } = Matter;
            const engine = Engine.create({});


            // 取得容器尺寸
            const width = boxRef.current.clientWidth;
            const height = boxRef.current.clientHeight;

            let render = Render.create({
                element: boxRef.current,
                engine: engine,
                canvas: canvasRef.current,
                options: {
                    width: width,
                    height: height,
                    background: 'transparent',
                    wireframes: false,
                },
            });

            const mouse = Mouse.create(render.canvas);
            const mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2, // 彈性，數值越小越有橡皮筋感
                    render: { visible: false } // 隱藏滑鼠抓取的那條線
                }
            });

            const isMobile = width < 600;

            mouse.element.removeEventListener('wheel', mouse.mousewheel);
            mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
            mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

            // if (!isMobile) {
            //     Composite.add(engine.world, mouseConstraint);

            //     // 移除桌機上的滾輪干擾
            //     mouse.element.removeEventListener('wheel', mouse.mousewheel);
            //     mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
            //     mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
            // } else {
            //     // 手機版：完全禁用 mouse 監聽，確保事件穿透到父層進行捲動
            //     mouse.element.style.pointerEvents = 'none';
            // }



            const bowlObstacle = Bodies.circle(width / 2, height + 100, 650, {
                isStatic: true,
                render: { visible: false } // 開發時可以改 true 看看圓圈在哪
            });



            const updateBowl = (w, h, isMobileNow) => {
                const radius = w * 0.4;

                Body.setPosition(bowlObstacle,
                    {
                        x: w / 2,
                        y: h + radius * (isMobileNow ? 0.15 : 0.12)

                    });

                const currentRadius = bowlObstacle.circleRadius;
                const scale = radius / currentRadius;

                Body.scale(bowlObstacle, scale, scale);
            };

            updateBowl(width, height, isMobile);



            const floor = Bodies.rectangle(
                width / 2,
                height + 20,
                width * 2,
                40,
                {
                    isStatic: true,
                    render: { fillStyle: 'transparent' },
                }
            );

            // 左牆 
            const leftWall = Bodies.rectangle(-20, // 稍微放在畫布外側 
                height / 2, 40, // 厚度 
                height * 2, // 高度要足夠 
                { isStatic: true, render: { fillStyle: 'transparent' }, }); // 右牆 

            const rightWall = Bodies.rectangle(width + 20, // 畫布右邊外側 
                height / 2, 40, height * 2, { isStatic: true, render: { fillStyle: 'transparent' }, });

            const shuffledItems = [...itemImages].sort(() => Math.random() - 0.5);

            // 3. 建立球的工廠
            const createBall = (config) => {
                const x = Math.random() * width;
                const y = Math.random() * -1000;
                const scale = isMobile ? config.scale * 0.4 : config.scale;
                return Bodies.circle(x, y, isMobile ? 15 : 35, {
                    restitution: 0.9,
                    frictionAir: 0.02,
                    render: {
                        sprite: {
                            texture: config.url,
                            xScale: scale,
                            yScale: scale,
                        }
                    }
                });
            };


            // 產生與圖片數量一致的球 (確保不重複)
            const balls = shuffledItems.map(config => createBall(config));
            Composite.add(engine.world, [mouseConstraint, bowlObstacle, floor, leftWall, rightWall, ...balls]);

            // 4. 無限循環監聽
            Events.on(engine, 'afterUpdate', () => {
                const currentHeight = boxRef.current?.clientHeight || height;
                const currentWidth = boxRef.current?.clientWidth || width;

                balls.forEach(ball => {
                    if (ball.position.y > currentHeight + 150) {
                        Body.setPosition(ball, {
                            x: Math.random() * currentWidth,
                            // 重置時也要隨機高度，才會有交錯感
                            y: Math.random() * -1000 - 100
                        });
                        Body.setVelocity(ball, { x: 0, y: 0 });
                    }
                });
            });

            Render.run(render);
            const runner = Runner.create();
            Runner.run(runner, engine);

            // 4. RWD 處理
            const handleResize = () => {
                if (!boxRef.current) return;
                const newWidth = boxRef.current.offsetWidth;
                const newHeight = boxRef.current.offsetHeight;
                const isMobileNow = newWidth < 600;
                render.canvas.width = newWidth;
                render.canvas.height = newHeight;
                render.options.width = newWidth;
                render.options.height = newHeight;

                // 移動地板位置
                Body.setPosition(floor, {
                    x: newWidth / 2,
                    y: newHeight + 20,

                });

                const currentFloorWidth = floor.bounds.max.x - floor.bounds.min.x;
                const targetFloorWidth = newWidth * 2;
                const floorScaleX = targetFloorWidth / currentFloorWidth;
                Body.scale(floor, floorScaleX, 1);   // 只拉寬，不動高度

                // 更新左右牆高度
                const currentWallHeight = leftWall.bounds.max.y - leftWall.bounds.min.y;
                const targetWallHeight = newHeight * 2;
                const wallScaleY = targetWallHeight / currentWallHeight;

                Body.setPosition(leftWall, {
                    x: -20,
                    y: newHeight / 2
                });
                Body.scale(leftWall, 1, wallScaleY);
                Body.setPosition(rightWall, {
                    x: newWidth + 20,
                    y: newHeight / 2
                });
                Body.scale(rightWall, 1, wallScaleY);

                // if (!isMobileNow) {
                //     Composite.add(engine.world, mouseConstraint);

                //     // 移除桌機上的滾輪干擾
                //     mouse.element.removeEventListener('wheel', mouse.mousewheel);
                //     mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
                //     mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
                // } else {
                //     // 手機版：完全禁用 mouse 監聽，確保事件穿透到父層進行捲動
                //     mouse.element.style.pointerEvents = 'none';
                // }

                updateBowl(newWidth, newHeight, isMobileNow);

                balls.forEach((ball, index) => {
                    const config = shuffledItems[index];
                    const newScale = isMobileNow ? config.scale * 0.4 : config.scale;
                    const newRadius = isMobileNow ? 15 : 35;

                    // 更新位置
                    Body.setPosition(ball, {
                        x: Math.random() * newWidth,
                        y: -Math.random() * 300
                    });

                    Body.setVelocity(ball, {
                        x: (Math.random() - 0.5) * 2,
                        y: 0
                    });

                    // 更新 sprite 縮放
                    ball.render.sprite.xScale = newScale;
                    ball.render.sprite.yScale = newScale;

                    // 更新物理半徑 (用 scale 調整)
                    const scaleFactor = newRadius / ball.circleRadius;
                    Body.scale(ball, scaleFactor, scaleFactor);
                });

            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                Render.stop(render);
                Runner.stop(runner);
                Engine.clear(engine);
                render.canvas.remove();
            };

        }, []);

        return (
            <div
                ref={boxRef}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 10,
                    overflow: 'hidden',

                }}
            >
                <canvas ref={canvasRef} />
            </div>
        );
    };

    const swiperConfig = {
        slidesPerView: 1,
        spaceBetween: 10,
        modules: [Autoplay, Navigation, Pagination, A11y],
        // navigation: true,
        // pagination: { clickable: true },
        loop: true,
        autoplay: {
            delay: 3000,                // 隔多久切換一次（單位：毫秒），3000 = 3秒
            disableOnInteraction: false, // 使用者操作（滑動）後，是否停止自動播放
            pauseOnMouseEnter: true,     // 滑鼠懸停時是否暫停
        },

    }

    // const [isOpen, setIsOpen] = useState(false);

    const QA_item = ({ item }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className='QA-border' data-bs-toggle="collapse"
                data-bs-target={`#${item.id}`}
                aria-expanded="false"
                aria-controls={item.id}
                onClick={() => setIsOpen(!isOpen)}>
                <div className='d-flex justify-content-between align-items-center ' >
                    <p className='fifth-Q-title '>{item.title}</p>
                    <div className='pe-2'  >
                        <i className={`bi ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}  `}></i>
                    </div>
                </div>

                <div className="collapse" id={item.id}>
                    <div className="border-0 bg-transparent pt-4">
                        <p className='fifth-A'>{item.content}</p>
                    </div>
                </div>
            </div>
        )

    };

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
            duration: 2000, // 動畫持續時間
            once: true,    // 是否只動畫一次
        });
    }, []);
    return (
        <>
            <main className="c-about">

                <div className="bgc-first">
                    <MatterStepOne />
                    <h1 className="fw-bold text-center main-title " data-aos="fade-up">GreenGo綠果</h1>
                    <p className=" main-content text-center pt-5 px-5" data-aos="fade-up">當你願意從「綠」開始，健康就會在你身上慢慢結「果」。</p>
                    <div className='topHalfImg mt-img'>
                        <img src={`${import.meta.env.BASE_URL}img/about/about_bowl.png`} alt="bowl" />
                    </div>
                </div>



                <div className='second_section position-relative d-none d-md-block'>

                    <div className='mid-sec py-10'>
                        <div className='container-fluid'>
                            <div className='row g-3'>
                                <div className='col-md-6'>
                                    <div className='img-border mx-10 ms-10 '>
                                        <img className='img-fluid mt-8 ms-9 ' src={`${import.meta.env.BASE_URL}img/about/about_action.png`} alt="making bowl" />
                                    </div>

                                </div>

                                <div className='col-md-6 my-10'>

                                    <div className=' fs-2 lh-sm mb-8' data-aos="fade-right">
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
                        <div className='pb-6 pe-8'>因此，GreenGo 想陪你把「行動」變成「成果」。<p>讓你看得懂食物、自在做選擇，為自己的身體負責。</p></div>


                        <div className=''>
                            當你選擇透明、選擇可控、選擇對身體友善，
                            <div>最終收穫的，就是屬於你的健康與自在 ——
                                <p>那就是我們所說的「綠果」。</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="second_sm_section d-md-none d-block overflow-hidden">
                    <div className='position-relative'>
                        <img className='opacity-50 ' src={`${import.meta.env.BASE_URL}img/about/about_action.png`} alt="making bowl" />
                        <div className='  position-absolute top-30 end-10' data-aos="zoom-in">
                            <h2 className='fs-2 lh-sm  sub-title'>行動，<span className='d-block sub-title'>然後成果。</span> </h2>
                            <h3 className='fs-5 lh-sm  sub-title'>The Story of GreenGo</h3>
                        </div>
                        {/* <div className="position-absolute top-10 start-10">
                            <div className='img-sm-border-1'></div>
                        </div>
                        <div className="position-absolute bottom-10 start-10">
                            <div className='img-sm-border-2'></div>
                        </div> */}
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
                            <div className='pb-6 pe-8'>因此，GreenGo 想陪你把「行動」變成「成果」。
                                <p>讓你看得懂食物、自在做選擇，為自己的身體負責。</p>
                            </div>


                            <div className=''>
                                當你選擇透明、選擇可控、選擇對身體友善，
                                <div>最終收穫的，就是屬於你的健康與自在 ——
                                    <p>那就是我們所說的「綠果」。</p>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

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
                                {/* 看以後要不要改這邊的字型排版 */}
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
                        <a className='home__btn-primary' href='#/product'>前往點餐</a>
                    </div>


                </div>







            </main>
        </>
    )
}