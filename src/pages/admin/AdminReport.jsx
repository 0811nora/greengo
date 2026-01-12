// import { useState, useEffect, useRef } from "react";
// import * as Chart from "chart.js";
import { useState } from "react";

// 假資料(先算一天)
const MockData = {
  revenue: { total: 36220, cash: 17650, card: 18570 },
  orders: { total: 150, productsType: { set: 75, custom: 75 } },
  rankings: {
    set: [
      { name: "三重蛋白活力碗", count: 31 },
      { name: "經典雙雞蛋白碗", count: 20 },
      { name: "海陸三拼能量碗", count: 11 },
      { name: "低脂雞胸活力碗", count: 5 },
      { name: "豆香高纖和風碗", count: 4 },
    ],
    custom: [
      { name: "雞胸肉", count: 60 },
      { name: "胡麻醬", count: 55 },
      { name: "水煮蛋", count: 47 },
      { name: "花椰菜", count: 22 },
      { name: "櫛瓜", count: 16 },
    ],
  },
};

// 時間篩選
const TimeFilter = ({ timeRange, setTimeRange }) => {
  const ranges = ["今日", "昨日", "當周", "當月", "本年度"];

  return (
    <div className="d-flex flex-column flex-md-row flex-wrap flex-lg-nowrap justify-content-between align-items-center mb-4">
      <h1>營運報表</h1>
      <div className="time-filter-container rounded-pill-custom d-flex">
        {ranges.map((item) => (
          <button
            key={item}
            className={`btn-filter rounded-pill-custom ${
              timeRange === item ? "active" : ""
            }`}
            onClick={() => setTimeRange(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};
// 卡片區
// 付款方式
const RevenueCard = () => {
  const { total, card } = MockData.revenue;
  const cardPercent = Math.round((card / total) * 100);

  return (
    <div className="card rounded-4 h-100 p-3">
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h6 className="mb-2">
            <i class="bi bi-cash-coin me-1"></i>總營收
          </h6>
          <h2 className=" mb-3">${total.toLocaleString()}</h2>
        </div>

        <div>
          <div className="progress mb-2">
            <div
              className="progress-bar"
              style={{ width: `${cardPercent}%`, backgroundColor: "#1B2028" }}
            ></div>
            <div
              className="progress-bar"
              style={{
                width: `${100 - cardPercent}%`,
                backgroundColor: "#FAB62C",
              }}
            ></div>
          </div>
          <div className="d-flex justify-content-between text-muted small">
            <span>
              <span className="text-gray-500">●</span> 信用卡 ({cardPercent}%)
            </span>
            <span>
              <span className="text-accent-200">●</span> 現金 (
              {100 - cardPercent}
              %)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
// 訂單+銷售類型(預計加上小圓餅圖)
const OrdersCard = () => {
  const { total } = MockData.orders;
  const { set } = MockData.orders.productsType;
  const cardPercent = Math.round((set / total) * 100);
  return (
    <div className="card card-custom rounded-4 h-100 p-3">
      <div className="card-body">
        <div className="d-flex flex-column justify-content-between mb-2">
          <h6 className="mb-2">
            <i class="bi bi-card-checklist me-1"></i>總訂單數
          </h6>
          <h2 className="fw-bold mb-3">
            {MockData.orders.total}
            <span className="fs-6 ps-2">單</span>
          </h2>
        </div>
        <div>
          <div className="d-flex justify-content-between mb-2 border-bottom pb-1">
            <span>
              <span className="text-gray-500 pe-1">●</span>固定套餐
            </span>
            <span>{cardPercent}%</span>
          </div>
          <div className="d-flex justify-content-between border-bottom pb-1">
            <span>
              <span className="text-accent-200 pe-1">●</span>自由配
            </span>
            <span>{100 - cardPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 圖表還在研究

// Top5 熱銷排行
const RankingList = ({ title, items }) => (
  <div className="">
    <h6 className="d-flex align-items-center mb-3 ">
      <span
        className={`d-inline-block rounded-circle me-2`}
        style={{ width: "8px", height: "8px" }}
      ></span>
      <i class="bi bi-trophy me-1"></i>
      {title}
    </h6>
    <div className="d-flex flex-column gap-2 ps-4">
      {items.map((item, index) => (
        <div
          key={index}
          className=" d-flex justify-content-between align-items-center py-2"
        >
          <span className="fs-sm">
            {index + 1}. {item.name}
          </span>
          <span className=" rounded-pill px-3 py-1">{item.count}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function AdminReport() {
  const [timeRange, setTimeRange] = useState("今日");
  return (
    <>
      <div className="container my-5">
        {/* 時間篩選區 */}
        <TimeFilter timeRange={timeRange} setTimeRange={setTimeRange} />
        {/* 資料呈現區 */}
        <div className="row my-2 g-2">
          {/* 付款方式 */}
          <div className="col-12 col-md-6 col-lg-3">
            <RevenueCard />
          </div>
          {/* 訂單數 */}
          <div className="col-12 col-md-6 col-lg-3">
            <OrdersCard />
          </div>
        </div>
        {/* 圖表區 */}
        <div className="admChart__container">
          <h3>圖表</h3>
        </div>
        {/* 銷售排行區 */}
        <div className="row my-2 g-2">
          <div className="col-md-6">
            <div className="card rounded-4 p-4">
              <div className="d-flex flex-column gap-4">
                <RankingList
                  title="固定套餐 Top 5"
                  items={MockData.rankings.set}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card rounded-4 p-4">
              <div className="d-flex flex-column gap-4">
                <RankingList
                  title="自由配 Top 5"
                  items={MockData.rankings.custom}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
