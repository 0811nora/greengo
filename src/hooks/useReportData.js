// 2/25新增自由配類型跟配料統計（這行可刪）
// 處理報表資料的 hook
import { useMemo } from 'react';
import {
  isOrderInRange,
  generateTimeLabels,
  getTimeLabelIndex,
} from '../utils/dateHelpers';
import {
  calculateStatistics,
  calculatePaymentMethod,
  calculateSalesTrend,
  calculateTopProducts,
  calculateCustomTypeStats, // 自由配類型
  calculateIngredientRanking, // 配料排行
} from '../utils/reportCalculators';

const useReportData = (allOrders, rangeType, startTime, endTime) => {
  // 使用 useMemo (抓快取)來避免重複計算，只在資料改變時才重新計算
  const reportData = useMemo(() => {
    // 先篩選時間範圍內的訂單
    const filterOrders = allOrders.filter((order) =>
      isOrderInRange(order.create_at, startTime, endTime),
    );
    // 計算統計數據
    const statistics = calculateStatistics(filterOrders);
    // 計算支付方式
    const paymentMethod = calculatePaymentMethod(filterOrders);
    // 產生時間標籤（給折線圖的 X 軸用）
    const timeLabels = generateTimeLabels(rangeType, startTime, endTime);
    // 計算銷售趨勢資料（給折線圖用）
    const salesTrend = calculateSalesTrend(filterOrders, timeLabels, (order) =>
      getTimeLabelIndex(order.create_at, rangeType, startTime, endTime),
    );

    // 計算 top 排行
    const topFixed = calculateTopProducts(filterOrders, 'fixed', 5);
    const topCustom = calculateTopProducts(filterOrders, 'custom', 5);
    const topOthers = calculateTopProducts(filterOrders, 'other', 5);

    // 計算自由配類型統計
    const customTypeStats = calculateCustomTypeStats(filterOrders);
    // 自由配配料排行+數量(抓到TOP幾)
    const topBases = calculateIngredientRanking(filterOrders, 'base', 3);
    const topProteins = calculateIngredientRanking(filterOrders, 'protein', 5);
    const topSides = calculateIngredientRanking(filterOrders, 'side', 5);
    const topSauces = calculateIngredientRanking(filterOrders, 'sauce', 3);

    return {
      filterOrders, // 篩選後的訂單
      statistics, // 統計數據
      paymentMethod,
      salesTrend, // 銷售趨勢
      topFixed,
      topCustom, // <- 還要嗎？
      topOthers,
      customTypeStats, // 自由配類型(3種)
      topBases, // 基底
      topProteins, // 蛋白質
      topSides, // 配菜
      topSauces, // 醬料
    };
  }, [allOrders, rangeType, startTime, endTime]);

  return reportData;
};
export default useReportData;
