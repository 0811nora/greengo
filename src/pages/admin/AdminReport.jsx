import { useState } from 'react';
// import dayjs from 'dayjs';
// import useAllOrders from '../../hooks/useAllOrders';
import useReportData from '../../hooks/useReportData';
import { DATE_RANGE_TYPES, getDateRange } from '../../utils/dateHelpers';
import { useOutletContext } from 'react-router-dom';

// 元件們
import DateRange from '../../components/admin/report/DateRange';
import StatCard from '../../components/admin/report/StatCard';
import SalesTrendChart from '../../components/admin/report/SalesTrendChart';
import PaymentPieChart from '../../components/admin/report/PaymentPieChart';
import TopRankingCard from '../../components/admin/report/TopRankingCard';
import IngredientRankingCard from '../../components/admin/report/Ingredientrankingcard';

const AdminReport = () => {
  // 選擇時間（預設今日）
  const [rangeType, setRangeType] = useState(DATE_RANGE_TYPES.TODAY);
  // 自訂時間
  const [customRange, setCustomRange] = useState(null);
  // 根據選擇時間的類型，抓開始跟結束的時間
  const { startTime, endTime } = getDateRange(rangeType, customRange);

  // 抓取所有訂單資料(載入速度慢)
  // const {
  //   orders: allOrders,
  //   loading,
  //   error,
  //   refresh,
  //   isInitialLoad,
  // } = useAllOrders();

  // 登入時就先在背景載入資料(仍花時間但相對較快)
  const {
    allOrders,
    ordersLoading: loading,
    ordersError: error,
    refreshOrders: refresh,
    isInitialLoad,
  } = useOutletContext();

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

  // 處理訂單資料刷新
  const handleRefresh = () => {
    refresh();
  };

  // loading 第一次載入頁面
  if (loading && isInitialLoad) {
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
  if (error && allOrders.length === 0) {
    return (
      <div className='container' style={{ paddingTop: '120px' }}>
        <div
          className='text-white bg-warning py-4 w-100 rounded-2 p-3'
          role='alert'
        >
          <h4 className='text-white fw-semibold'>載入失敗</h4>
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
    topOthers,
    filterOrders,
    topBases,
    topProteins,
    topSides,
    topSauces,
  } = reportData;

  // 計算今日未付款訂單（會跳提示）
  // +同時檢查 is_paid 跟 payment_status
  const unpaidTodayOrders = filterOrders.filter(
    (order) =>
      !(order.is_paid === true || order.user?.payment_status === 'paid') &&
      rangeType === DATE_RANGE_TYPES.TODAY,
  );
  const unpaidTodayAmount = unpaidTodayOrders.reduce(
    (sum, order) => sum + (order.total || 0),
    0,
  );

  return (
    <div className='container' style={{ paddingTop: '120px' }}>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h2 className='mb-0'>營運報表</h2>
        <button
          className='home__btn-link border border-1 rounded-2 p-2'
          onClick={handleRefresh}
          disabled={loading}
        >
          <i
            className={`me-2 ${loading ? 'spinner-border spinner-border-sm' : 'bi bi-arrow-clockwise'}`}
          ></i>
          {loading ? '更新資料中' : '重新整理'}
        </button>
      </div>

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
          loading={loading}
        />
        <StatCard
          title='總訂單數'
          value={statistics.orderCount.total}
          subtitle={`固定套餐: ${statistics.orderCount.fixed} / 自由配: ${statistics.orderCount.custom}`}
          icon='bi bi-receipt'
          loading={loading}
        />
        <StatCard
          title='已付款訂單'
          value={statistics.paidOrderCount}
          subtitle={`未付款: ${statistics.orderCount.total - statistics.paidOrderCount}`}
          icon='bi bi-check-circle'
          loading={loading}
        />
      </div>

      {/* 今日未付款的提示（ TODAY + unpaidTodayOrders ） */}
      {rangeType === DATE_RANGE_TYPES.TODAY && unpaidTodayOrders.length > 0 && (
        <div className='alert alert-primary mb-4' role='alert'>
          {loading ? (
            <>
              <div className='d-flex flex-column justify-content-start align-items-center'>
                <div
                  className='spinner-border spinner-border-sm text-primary'
                  role='status'
                >
                  <span className='visually-hidden'>載入中...</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {' '}
              <i className='bi bi-info-circle me-2'></i>
              <span>提示：</span>
              今日尚有 {unpaidTodayOrders.length} 筆未付款訂單（金額：NT${' '}
              {unpaidTodayAmount.toLocaleString()}），未計入營業額統計。
            </>
          )}
        </div>
      )}

      {/* 圖表區 */}
      <div className='row mb-4'>
        {/* 折線圖 */}
        <div className='col-lg-8 mb-3'>
          <SalesTrendChart data={salesTrend} loading={loading} />
        </div>
        {/* 圓餅圖 */}
        <div className='col-lg-4 mb-3'>
          <PaymentPieChart data={paymentMethod} loading={loading} />
        </div>
      </div>

      {/* 排行區 */}
      <div className='row mb-4'>
        <div className='col-12 mb-3'>
          <h4>熱銷排行</h4>
        </div>
        <TopRankingCard
          title='固定套餐 Top 5'
          data={topFixed}
          loading={loading}
        />
        {/* <TopRankingCard title='自由配 Top 5' data={topCustom} /> */}
        <TopRankingCard
          title='其他附餐 Top 5'
          data={topOthers}
          loading={loading}
        />
      </div>

      {/* 自由配各項統計區 */}
      <div className='row pb-5 pb-md-7'>
        <div className='col-12 mb-3'>
          <h4>自由配熱銷排行</h4>
        </div>
        <IngredientRankingCard
          title='基底 Top 3'
          data={topBases}
          loading={loading}
        />
        <IngredientRankingCard
          title='蛋白質 Top 5'
          data={topProteins}
          loading={loading}
        />
        <IngredientRankingCard
          title='配菜 Top 5'
          data={topSides}
          loading={loading}
        />
        <IngredientRankingCard
          title='醬料 Top 3'
          data={topSauces}
          loading={loading}
        />
      </div>
    </div>
  );
};
export default AdminReport;
