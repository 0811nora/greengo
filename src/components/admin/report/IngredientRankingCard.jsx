// 配料排行卡片
const IngredientRankingCard = ({ title, data, icon }) => {
  // 如果沒有資料就跳提示訊息
  if (!data || data.length === 0) {
    return (
      <div className='col-md-6 col-lg-3 mb-3'>
        <div className='card adm__report-card h-100'>
          <div className='card-body'>
            <div className='d-flex align-items-center mb-3'>
              {icon && <i className={`${icon} me-2 text-primary`}></i>}
              <h6 className='card-title mb-0'>{title}</h6>
            </div>
            <p className='text-gray-900 text-center py-4'>暫無資料</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='col-md-6 col-lg-3 mb-3'>
      <div className='card adm__report-card h-100'>
        <div className='card-body'>
          <div className='d-flex align-items-center mb-3'>
            {icon && <i className={`${icon} me-2 text-primary`}></i>}
            <h6 className='card-title mb-0'>{title}</h6>
          </div>
          {/* 排行 */}
          <div className='list-group list-group-flush'>
            {data.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className='list-group-item px-0 py-2'
              >
                <div className='d-flex justify-content-between align-items-center mb-1'>
                  <div className='d-flex align-items-center flex-grow-1'>
                    {/* 排名 badge */}
                    <span
                      className={`badge me-2 ${
                        index === 0
                          ? 'bg-error text-white'
                          : index === 1
                            ? 'bg-orange-300'
                            : 'bg-orange-200 text-white'
                      }`}
                      style={{ minWidth: '24px' }}
                    >
                      {index + 1}
                    </span>
                    {/* 配料名稱 */}
                    <span
                      className='fw-medium text-truncate'
                      style={{ maxWidth: '120px' }}
                    >
                      {item.name}
                    </span>
                  </div>
                  {/* 計算 */}
                  <span className='text-gray-500 ms-2'>
                    售出 {item.count} 份
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default IngredientRankingCard;
