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

                <div data-aos="fade-up" data-aos-duration="3000">
                    <p >第二區塊</p>
                </div>
            </main>
        </>
    )
}