// 統計卡片

const StatCard = ({
  title,
  value,
  subtitle = "",
  icon = "",
  bgColor = "bg-white",
}) => {
  return (
    <div className="col-md-6 col-lg-3 mb-3">
      <div className={`card ${bgColor} h-100 adm__report-card`}>
        <div className="card-body">
          {/* 卡片項目名稱 */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="card-title text-muted mb-0">{title}</h6>
            {icon && <i className={`${icon} fs-4 text-primary`}></i>}
          </div>
          {/* 該卡片的值 */}
          <div className="display-6 fw-bold text-dark mb-1">{value}</div>
          {/* 補充說明 */}
          {subtitle && <p className="fs-sm text-muted">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
