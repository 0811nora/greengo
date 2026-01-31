// 時間範圍選擇器
import { useState } from "react";
import dayjs from "dayjs";
import { DATE_RANGE_TYPES } from "../../../utils/dateHelpers";

const DateRange = ({ activeRange, onRangeChange, onCustomRangeChange }) => {
  // 時間範圍選項
  const rangeOptions = [
    { value: DATE_RANGE_TYPES.TODAY, label: "今日" },
    { value: DATE_RANGE_TYPES.YESTERDAY, label: "昨日" },
    { value: DATE_RANGE_TYPES.THIS_WEEK, label: "本週" },
    { value: DATE_RANGE_TYPES.THIS_MONTH, label: "本月" },
    { value: DATE_RANGE_TYPES.THIS_YEAR, label: "本年度" },
  ];

  // 自訂範圍日期
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  // 控制 modal 開關
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 開關 modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 確認自訂範圍
  const handleConfirm = () => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // 驗證日期
    if (!start.isValid() || !end.isValid()) {
      alert("請輸入有效的日期");
      return;
    }
    if (start.isAfter(end)) {
      alert("開始日期不能晚於結束日期");
      return;
    }

    // 通知父元件
    onCustomRangeChange({
      startDate: start,
      endDate: end,
    });
    // 切換到自訂時間模式
    onRangeChange(DATE_RANGE_TYPES.CUSTOM);
    closeModal();
  };

  // 快速選擇邏輯：最近7天
  const quickSelect7Days = () => {
    const end = dayjs();
    const start = end.subtract(6, "day");
    setStartDate(start.format("YYYY-MM-DD"));
    setEndDate(end.format("YYYY-MM-DD"));
  };

  // 快速選擇邏輯：最近30天
  const quickSelect30Days = () => {
    const end = dayjs();
    const start = end.subtract(29, "day");
    setStartDate(start.format("YYYY-MM-DD"));
    setEndDate(end.format("YYYY-MM-DD"));
  };

  return (
    <>
      <div className="mb-4 position-relative">
        {/* 時間範圍按鈕 */}
        <div className="date-nav">
          <div className="date-container">
            {rangeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`date-btn ${
                  activeRange === option.value ? "active" : ""
                }`}
                onClick={() => onRangeChange(option.value)}
              >
                {option.label}
              </button>
            ))}
            {/* 自訂時間按鈕 */}
            <button
              type="button"
              className={`date-btn ${
                activeRange === DATE_RANGE_TYPES.CUSTOM ? "active" : ""
              }`}
              onClick={openModal}
            >
              自訂範圍
            </button>
            <svg
              className="date-outline"
              overflow="visible"
              width="500"
              height="50"
              viewBox="0 0 500 50"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                className="date-rect"
                pathLength="100"
                x="0"
                y="0"
                width="500"
                height="50"
                fill="transparent"
                stroke-width="5"
              ></rect>
            </svg>
          </div>
        </div>
      </div>

      {/* 自訂時間 modal */}
      {isModalOpen && (
        <div className="adm__report-modal-overlay" onClick={closeModal}>
          <div
            className="adm__report-modal-content text-white"
            // 停止冒泡事件
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm__report-modal-header">
              <h5 className="fs-6 text-white">自訂時間範圍</h5>
              <button className="adm__report-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="adm__report-modal-body">
              {/* 快速選擇 */}
              <div className="mb-3">
                <label className="form-label">快速選擇</label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-accent-200 text-gray-500 flex-fill"
                    onClick={quickSelect7Days}
                  >
                    最近 7 天
                  </button>
                  <button
                    type="button"
                    className="btn btn-accent-200 text-gray-500 flex-fill"
                    onClick={quickSelect30Days}
                  >
                    最近 30 天
                  </button>
                </div>
              </div>

              {/* 開始日期 */}
              <div className="mb-3">
                <label htmlFor="startDate" className="form-label">
                  開始日期
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={dayjs().format("YYYY-MM-DD")}
                />
              </div>

              {/* 結束日期 */}
              <div className="mb-3">
                <label htmlFor="endDate" className="form-label">
                  結束日期
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  max={dayjs().format("YYYY-MM-DD")}
                />
              </div>

              {/* 自訂時間後提示 */}
              <div className="alert alert-danger mb-0">
                <p>
                  <i className="bi bi-info-circle me-2"></i>
                  已選擇：
                  <span>
                    {dayjs(startDate).format("YYYY/MM/DD")} ~{" "}
                    {dayjs(endDate).format("YYYY/MM/DD")}
                  </span>
                  （共 {dayjs(endDate).diff(dayjs(startDate), "day") + 1} 天）
                </p>
              </div>
            </div>
            <div className="adm__report-modal-footer">
              <button
                type="button"
                className="btn btn-secondary px-3"
                onClick={closeModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-primary-300 px-3"
                onClick={handleConfirm}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DateRange;
