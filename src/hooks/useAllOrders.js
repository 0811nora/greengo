// 抓所有訂單的 hook
import { useState, useEffect } from "react";
import { getAdmOrders } from "../api/ApiAdmin";

// 自訂：抓取所有訂單資料 + 自動處理分頁，把所有訂單都抓回來
const useAllOrders = () => {
  const [orders, setOrders] = useState([]); // 所有訂單
  const [loading, setLoading] = useState(true); // Loading 狀態
  const [error, setError] = useState(null); // 錯誤訊息

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // 儲存所有訂單的陣列
        let allOrders = [];
        let currentPage = 1;
        let hasNextPage = true;

        // 一直抓取直到沒有下一頁
        while (hasNextPage) {
          const response = await getAdmOrders(currentPage);
          const data = response.data;

          if (data.success && data.orders) {
            // 把這一頁的訂單加入陣列
            allOrders = [...allOrders, ...data.orders];

            // 檢查還有沒有下一頁
            hasNextPage = data.pagination?.has_next || false;
            currentPage += 1;
          } else {
            // 如果 API 回傳失敗
            hasNextPage = false;
            throw new Error("無法取得訂單資料");
          }
        }

        // 設定所有訂單
        setOrders(allOrders);
      } catch (err) {
        console.error("抓取訂單時發生錯誤:", err);
        setError(err.message || "載入訂單失敗");
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []); // 空陣列表示只在元件掛載時執行一次

  return { orders, loading, error };
};

export default useAllOrders;
