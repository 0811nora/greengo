import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isoWeek from 'dayjs/plugin/isoWeek'; // 確保從每週一算起
import 'dayjs/locale/zh-tw';
dayjs.locale('zh-tw');

// dayjs 插件
dayjs.extend(isBetween);
dayjs.extend(isoWeek);

// 時間範圍類型
export const DATE_RANGE_TYPES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  THIS_YEAR: 'this_year',
  CUSTOM: 'custom',
};

// 根據範圍類型取得起始和結束時間
export const getDateRange = (rangeType, customRange = null) => {
  const now = dayjs();

  switch (rangeType) {
    case DATE_RANGE_TYPES.TODAY:
      // 今日 00:00:00 ~ 23:59:59
      return {
        startTime: now.startOf('day').unix(),
        endTime: now.endOf('day').unix(),
      };

    case DATE_RANGE_TYPES.YESTERDAY:
      // 昨日 00:00:00 ~ 23:59:59
      const yesterday = now.subtract(1, 'day');
      return {
        startTime: yesterday.startOf('day').unix(),
        endTime: yesterday.endOf('day').unix(),
      };

    case DATE_RANGE_TYPES.THIS_WEEK:
      // 每週一 00:00:00 ~ 現在
      return {
        startTime: now.startOf('isoWeek').unix(),
        endTime: now.endOf('isoWeek').unix(),
      };

    case DATE_RANGE_TYPES.THIS_MONTH:
      // 每月1  00:00:00 ~ 現在
      return {
        startTime: now.startOf('month').unix(),
        endTime: now.endOf('month').unix(),
      };

    case DATE_RANGE_TYPES.THIS_YEAR:
      // 今年1/1 00:00:00 ~ 現在
      return {
        startTime: now.startOf('year').unix(),
        endTime: now.endOf('year').unix(),
      };

    case DATE_RANGE_TYPES.CUSTOM:
      // 自訂範圍
      if (customRange && customRange.startDate && customRange.endDate) {
        return {
          startTime: customRange.startDate.startOf('day').unix(),
          endTime: customRange.endDate.endOf('day').unix(),
        };
      }
      // 如果沒有提供自訂範圍 -> 預設為今日
      return {
        startTime: now.startOf('day').unix(),
        endTime: now.endOf('day').unix(),
      };

    default:
      return {
        startTime: now.startOf('day').unix(),
        endTime: now.endOf('day').unix(),
      };
  }
};

// 檢查訂單的時間範圍
export const isOrderInRange = (orderTimestamp, startTime, endTime) => {
  return orderTimestamp >= startTime && orderTimestamp <= endTime;
};

// 根據時間範圍產生圖表的時間軸 label
export const generateTimeLabels = (rangeType, startTime, endTime) => {
  const labels = [];
  const start = dayjs.unix(startTime);
  const end = dayjs.unix(endTime);

  switch (rangeType) {
    case DATE_RANGE_TYPES.TODAY:
    case DATE_RANGE_TYPES.YESTERDAY:
      // 今日 / 昨日，按小時
      for (let i = 0; i < 24; i++) {
        labels.push(`${i}`); // 改轉成字串
      }
      break;

    case DATE_RANGE_TYPES.THIS_WEEK:
      // 週 - 從週一開始
      let current = start;
      while (current.isBefore(end) || current.isSame(end, 'day')) {
        labels.push(current.format('MM/DD'));
        current = current.add(1, 'day');
      }
      break;

    case DATE_RANGE_TYPES.THIS_MONTH:
      // 月份
      let day = start;
      while (day.isBefore(end) || day.isSame(end, 'day')) {
        labels.push(day.format('MM/DD'));
        day = day.add(1, 'day');
      }
      break;

    case DATE_RANGE_TYPES.THIS_YEAR:
      // 本年度
      let month = start;
      while (month.isBefore(end) || month.isSame(end, 'month')) {
        labels.push(month.format('M月'));
        month = month.add(1, 'month');
      }
      break;

    case DATE_RANGE_TYPES.CUSTOM:
      // 自訂範圍 - 根據天數決定顯示方式
      const daysSet = end.diff(start, 'day') + 1;
      if (daysSet <= 1) {
        // 1 天以內 - 按小時顯示
        for (let i = 0; i < 24; i++) {
          labels.push(i);
        }
      } else if (daysSet <= 31) {
        // 31 天以內 - 按日期顯示
        let currentDay = start;
        while (currentDay.isBefore(end) || currentDay.isSame(end, 'day')) {
          labels.push(currentDay.format('MM/DD'));
          currentDay = currentDay.add(1, 'day');
        }
      } else {
        // 超過 31 天 - 按月份顯示
        // let currentMonth = start.startOf('month');
        // while (
        //   currentMonth.isBefore(end) ||
        //   currentMonth.isSame(end, 'month')
        // ) {
        //   labels.push(currentMonth.format('M月'));
        //   currentMonth = currentMonth.add(1, 'month');
        // }
        let currentMonth = start.startOf('month');
        while (
          currentMonth.isBefore(end) ||
          currentMonth.isSame(end, 'month')
        ) {
          const isCrossYear = start.year() !== end.year();
          const formatStr = isCrossYear ? 'YYYY/MM' : 'M月';
          labels.push(currentMonth.format(formatStr));
          currentMonth = currentMonth.add(1, 'month');
        }
      }
      break;
    default:
      break;
  }

  return labels;
};

// 將訂單的時間戳轉換為對應的時間 label (對應上面的)
export const getTimeLabelIndex = (
  orderTimestamp,
  rangeType,
  startTime,
  endTime,
) => {
  const orderTime = dayjs.unix(orderTimestamp);
  const start = dayjs.unix(startTime);
  const end = dayjs.unix(endTime);

  switch (rangeType) {
    case DATE_RANGE_TYPES.TODAY:
    case DATE_RANGE_TYPES.YESTERDAY:
      // 回傳小時數 (0-23)
      return `${orderTime.hour()}`;

    case DATE_RANGE_TYPES.THIS_WEEK:
    case DATE_RANGE_TYPES.THIS_MONTH:
      // 回傳日期格式 "MM/DD"
      return orderTime.format('MM/DD');

    case DATE_RANGE_TYPES.THIS_YEAR:
      // 回傳月份格式 "M月"
      return orderTime.format('M月');

    case DATE_RANGE_TYPES.CUSTOM:
      // 自訂範圍：根據天數決定
      const daysSet = end.diff(start, 'day') + 1;
      if (daysSet <= 1) {
        // 按小時
        return `${orderTime.hour()}`;
      } else if (daysSet <= 31) {
        // 按日期
        return orderTime.format('MM/DD');
      } else {
        // 按月份 + 如果有跨年份
        const isCrossYear = start.year() !== end.year();
        const formatStr = isCrossYear ? 'YYYY/MM' : 'M月';
        return orderTime.format(formatStr);
      }

    default:
      return '';
  }
};
