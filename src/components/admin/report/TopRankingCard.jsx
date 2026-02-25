// 熱銷排行卡片
const TopRankingCard = ({ title, data }) => {
  // 如果沒有資料就跳提示訊息
  if (!data || data.length === 0) {
    return (
      <div className='col-md-6 mb-3'>
        <div className='card adm__report-card h-100'>
          <div className='card-body'>
            <h5 className='card-title mb-3'>{title}</h5>
            <p className='text-gray-900 text-center py-4'>暫無資料</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='col-md-6 mb-3'>
      <div className='card adm__report-card h-100'>
        <div className='card-body'>
          <h5 className='card-title text-gray-900 mb-3'>{title}</h5>
          {/* 排行卡片內容 */}
          <div className='list-group list-group-flush'>
            {data.map((item, index) => (
              <div
                key={item.id || index}
                className='list-group-item d-flex justify-content-between align-items-center px-0'
              >
                <div className='d-flex align-items-center'>
                  {/* 排名 badge + 名次顏色排序(待調整) */}
                  <span
                    className={`badge me-3 ${
                      index === 0
                        ? 'bg-error text-white'
                        : index === 1
                          ? 'bg-orange-300 text-white'
                          : 'bg-orange-200 text-white'
                    }`}
                  >
                    {index + 1}
                  </span>

                  {/* 商品名稱 */}
                  <div>
                    <div className='fw-medium'>{item.name}</div>
                    <small className='text-brown-300'>
                      售出 {item.count} 份
                    </small>
                  </div>
                </div>

                {/* 銷售額 */}
                <div className='text-end'>
                  <div className='fw-bold text-gray-900'>
                    NT$ {item.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopRankingCard;
