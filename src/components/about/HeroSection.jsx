import DropVeg from "./DropVeg"

export default function HeroSection() {

  return (
    <div className="bgc-first">
      <DropVeg />
      <h1 className="fw-bold text-center main-title " data-aos="fade-up">GreenGo綠果</h1>
      <p className=" main-content text-center pt-5 px-5" data-aos="fade-up">當你願意從「綠」開始，健康就會在你身上慢慢結「果」。</p>
      <div className='topHalfImg mt-img'>
        <img src={`${import.meta.env.BASE_URL}img/about/about_bowl.png`} alt="bowl" />
      </div>
    </div>
  )
}