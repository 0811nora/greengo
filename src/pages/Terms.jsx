// import { useState } from 'react';
export default function Terms() {
  return (
    <>
      <section className='container py-10 mt-10'>
        <div className='row justify-content-center'>
          <div className='col-md-10'>
            <div className='mb-6'>
              <h2 className='mb-4 text-primary'>使用者與取餐條款</h2>
              <p className='text-gray-600'>
                請在下單前詳閱以下規則，開始使用服務即代表您同意本條款。
              </p>
            </div>

            <div className='mb-7'>
              <h5>一、訂購與客製化規範</h5>
              <p>
                GreenGo
                提供客製化餐盒服務，請務必確認選擇之食材與數量。訂單送出後若需修改，請於取餐時間前
                2 小時聯繫門市，否則恕無法變更內容。
              </p>
            </div>

            <div className='mb-7'>
              <h5>二、取餐說明（無外送服務）</h5>
              <ul className='text-gray-500'>
                <li>
                  <span className='fw-bold text-gray-600'>取餐方式：</span>
                  本站僅提供「線上點餐、實體店面取餐」，目前暫無提供宅配或外送服務。
                </li>
                <li>
                  <span className='fw-bold text-gray-600'>核對資訊：</span>
                  取餐時請出示訂單編號或提供訂購人電話進行核對。
                </li>
                <li>
                  <span className='fw-bold text-gray-600'>逾期處理：</span>{' '}
                  餐點為新鮮熟食，若超過取餐時間 1
                  小時未領取，為維護食安標準，我們將不予保留餐點，且因已進入製作流程，線上支付之款項恕不退還。
                </li>
              </ul>
            </div>
            <div className='mb-7'>
              <h5>三、退換貨政策</h5>
              <p>
                依據消保法規定，易腐敗之熟食不適用 7
                天鑑賞期。若收到餐點有內容物錯誤或瑕疵，請「當場」向店員反映，我們將立即為您重製或退費。
              </p>
            </div>
            <div className='mb-7'>
              <h5>四、免責聲明</h5>
              <p>
                我們會盡力確保網頁食材圖片與實品一致，但因季節性供應問題，部分配菜可能微調，請以實體店面供應為準。
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
