import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // 取得目前位置
  const { pathname } = useLocation();
  // 記錄上一次的路徑
  const prevPathname = useRef();

  useEffect(() => {
    // 判斷頁面
    const isToDetail =
      prevPathname.current?.startsWith('/product') &&
      pathname.startsWith('/product') &&
      pathname !== prevPathname.current;

    // pathname 換頁時執行，如果是從 product 前往 id 頁則不觸發
    if (!isToDetail) {
      window.scrollTo(0, 0);
      // console.log('現在位置：', pathname);
    }

    // 最後再更新舊路徑的紀錄
    prevPathname.current = pathname;
  }, [pathname]);
  return null;
};

export default ScrollToTop;
