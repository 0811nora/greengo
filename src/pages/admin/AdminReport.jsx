import { useState } from 'react';
import dayjs from 'dayjs';
import useAllOrders from '../../hooks/useAllOrders';
import useReportData from '../../hooks/useReportData';
import { DATE_RANGE_TYPES, getDateRange } from '../../utils/dateHelpers';

// 元件們
import DateRange from '../../components/admin/report/DateRange';
import StatCard from '../../components/admin/report/StatCard';
import SalesTrendChart from '../../components/admin/report/SalesTrendChart';
import PaymentPieChart from '../../components/admin/report/PaymentPieChart';
import TopRankingCard from '../../components/admin/report/TopRankingCard';

const AdminReport = () => {
  // 選擇時間（預設今日）
  const [rangeType, setRangeType] = useState(DATE_RANGE_TYPES.TODAY);
  // 自訂時間
  const [customRange, setCustomRange] = useState(null);
  // 根據選擇時間的類型，抓開始跟結束的時間
  const { startTime, endTime } = getDateRange(rangeType, customRange);
  // 抓取所有訂單資料
  const { orders: allOrders, loading, error } = useAllOrders();
  // 根據被選擇的時間範圍處理資料
  const reportData = useReportData(allOrders, rangeType, startTime, endTime);
  // 處理時間切換
  const handleRangeChange = (newRangeType) => {
    setRangeType(newRangeType);
  };
  // 處理自訂範圍
  const handleCustomRangeChange = (range) => {
    setCustomRange(range);
  };

  // loading (樣式可以再調整)
  if (loading) {
    return (
      <div className='container text-center' style={{ paddingTop: '120px' }}>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>載入中...</span>
        </div>
        <p className='mt-3'>正在載入報表資料...</p>
      </div>
    );
  }

  // if error
  if (error) {
    return (
      <div className='container' style={{ paddingTop: '120px' }}>
        <div className='alert alert-danger' role='alert'>
          <h4 className='alert-heading'>載入失敗</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // 解構 useReportData 資料
  const {
    statistics,
    paymentMethod,
    salesTrend,
    topFixed,
    topCustom,
    topOthers,
    filterOrders,
  } = reportData;

  // 測試 API 抓訂單用，先不要刪
  console.log('-----時間範圍:-----', rangeType);
  console.log(
    '-----起始時間:-----',
    startTime,
    dayjs.unix(startTime).format('YYYY/MM/DD HH:mm'),
  );
  console.log(
    '-----結束時間:-----',
    endTime,
    dayjs.unix(endTime).format('YYYY/MM/DD HH:mm'),
  );
  console.log('-----篩選後訂單數:-----', filterOrders.length);
  console.log('-----銷售趨勢資料:-----', salesTrend);
  console.log('-----支付方式分布:-----', paymentMethod);

  // 計算今日未付款訂單（會跳提示）
  const unpaidTodayOrders = filterOrders.filter(
    (order) => !order.is_paid && rangeType === DATE_RANGE_TYPES.TODAY,
  );
  const unpaidTodayAmount = unpaidTodayOrders.reduce(
    (sum, order) => sum + (order.total || 0),
    0,
  );

  return (
    <div className='container' style={{ paddingTop: '120px' }}>
      <h2 className='mb-4'>營運報表</h2>

      {/* 時間選擇區 */}
      <DateRange
        activeRange={rangeType}
        onRangeChange={handleRangeChange}
        onCustomRangeChange={handleCustomRangeChange}
      />

      {/* 自訂的提示區 */}
      {rangeType === DATE_RANGE_TYPES.CUSTOM && customRange && (
        <div className='alert alert-primary mb-4' role='alert'>
          <i className='bi bi-calendar-range me-2'></i>
          <span>自訂範圍：</span>
          {customRange.startDate.format('YYYY/MM/DD')} ~{' '}
          {customRange.endDate.format('YYYY/MM/DD')}
          （共 {customRange.endDate.diff(customRange.startDate, 'day') + 1} 天）
        </div>
      )}

      {/* 統計卡片區 */}
      <div className='row mb-4'>
        <StatCard
          title='營業額'
          value={`NT$ ${statistics.revenue.total.toLocaleString()}`}
          subtitle={`信用卡: ${statistics.revenue.creditCard.toLocaleString()} / 現金: ${statistics.revenue.cash.toLocaleString()} / 電子支付: ${statistics.revenue.ePayment.toLocaleString()}`}
          icon='bi bi-cash-stack'
        />
        <StatCard
          title='總訂單數'
          value={statistics.orderCount.total}
          subtitle={`固定套餐: ${statistics.orderCount.fixed} / 自由配: ${statistics.orderCount.custom}`}
          icon='bi bi-receipt'
        />
        <StatCard
          title='已付款訂單'
          value={statistics.paidOrderCount}
          subtitle={`未付款: ${statistics.orderCount.total - statistics.paidOrderCount}`}
          icon='bi bi-check-circle'
        />
        <StatCard
          title='平均客單價'
          value={`NT$ ${statistics.averageOrderValue.toLocaleString()}`}
          subtitle='每筆訂單平均金額'
          icon='bi bi-graph-up'
        />
      </div>

      {/* 今日未付款的提示（ TODAY + unpaidTodayOrders ） */}
      {rangeType === DATE_RANGE_TYPES.TODAY && unpaidTodayOrders.length > 0 && (
        <div className='alert alert-primary mb-4' role='alert'>
          <i className='bi bi-info-circle me-2'></i>
          <span>提示：</span>
          今日尚有 {unpaidTodayOrders.length} 筆未付款訂單（金額：NT${' '}
          {unpaidTodayAmount.toLocaleString()}）， 未計入營業額統計。
        </div>
      )}

      {/* 圖表區 */}
      <div className='row mb-4'>
        {/* 折線圖 */}
        <div className='col-lg-8 mb-3'>
          <SalesTrendChart data={salesTrend} />
        </div>
        {/* 圓餅圖 */}
        <div className='col-lg-4 mb-3'>
          <PaymentPieChart data={paymentMethod} />
        </div>
      </div>

      {/* 排行區 */}
      <div className='row'>
        <div className='col-12 mb-3'>
          <h4>熱銷排行榜</h4>
        </div>
        <TopRankingCard title='固定套餐 Top 5' data={topFixed} />
        <TopRankingCard title='自由配 Top 5' data={topCustom} />
        <TopRankingCard title='其他附餐 Top 5' data={topOthers} />
      </div>
    </div>
  );
};

export default AdminReport;
