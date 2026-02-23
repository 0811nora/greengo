import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // 取得目前位置
  const { pathname } = useLocation();
  useEffect(() => {
    //  pathname 換頁時執行
    window.scrollTo(0, 0);
    // console.log('現在位置：', pathname);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
