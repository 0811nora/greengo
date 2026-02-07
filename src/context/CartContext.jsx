import { createContext, useState, useEffect, useContext } from "react";
import { getCart } from "../api/ApiClient";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState({ carts: [] });

  // 取得購物車列表的 API
  const getAllCart = async () => {
    try {
      const res = await getCart();
      console.log("購物車 API ：", res.data.data);
      setCartData(res.data.data);
    } catch (error) {
      console.log("取得購物車失敗", error);
    }
  };
  useEffect(() => {
    getAllCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartData, getAllCart }}>
      {children}
    </CartContext.Provider>
  );
};
// 做成 hook (待改)
export const useCart = () => {
  return useContext(CartContext);
};
