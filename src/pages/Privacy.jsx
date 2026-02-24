// import { useState } from 'react';
export default function Privacy() {
  return (
    <>
      <section className='container py-10 mt-10'>
        <div className='row justify-content-center'>
          <div className='col-md-10'>
            <h2 className='mb-4 text-primary'>隱私權政策</h2>
            <p className='text-gray-500'>最後更新日期：2026-02-24</p>
            <div className='my-3'>
              <div className='mb-7'>
                <div className='mb-4'>
                  <h5>一、資料蒐集與目的</h5>
                  <p>
                    GreenGo
                    僅蒐集為提供服務所必要之資訊（如：姓名、電話、電子郵件），主要用於：
                  </p>
                  <ul>
                    <li>會員身份辨識與訂單管理。</li>
                    <li>取餐身分核對與緊急聯繫。</li>
                    <li>提供客製化餐點紀錄與後續服務。</li>
                  </ul>
                </div>
              </div>
              <div className='mb-7'>
                <div className='mb-4'>
                  <h5>二、線上交易安全</h5>
                  <p>
                    本站使用 SSL
                    加密傳輸技術，並透過受信任之第三方支付平台進行結帳。我們不會紀錄或儲存您的信用卡完整卡號及安全碼，確保您的交易環境安全無虞。
                  </p>
                </div>
              </div>
              <div className='mb-7'>
                <div className='mb-4'>
                  <h5>三、資訊利用與保護</h5>
                  <p>
                    除非取得您的同意或法令規定，我們不會將您的個人資料提供、交換或出售給任何第三方機構。我們採用符合業界標準的資安管理，保護您的資料安全。
                  </p>
                </div>
              </div>
            </div>
            <p className='bg-primary-100 p-3 '>
              若對本政策有任何疑問，歡迎透過官方 LINE@ 或 Email 與我們聯繫。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
