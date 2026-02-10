import { createContext, useState, useEffect, useContext } from 'react';
import { getCart } from '../api/ApiClient';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartData, setCartData] = useState({ carts: [] });

  // 取得購物車列表的 API
  const getAllCart = async () => {
    try {
      const res = await getCart();
      console.log('購物車 API ：', res.data.data);
      setCartData(res.data.data);
    } catch (error) {
      console.log('取得購物車失敗', error);
    }
  };
  // 計算數量
  const getTotalItems = () => {
    return cartData.carts?.reduce((total, item) => total + item.qty, 0) || 0;
  };
  // 計算總金額
  const getTotalPrice = () => {
    return (
      cartData.carts?.reduce(
        (total, item) => total + item.product.price * item.qty,
        0,
      ) || 0
    );
  };

  useEffect(() => {
    getAllCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartData,
        getAllCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
// 做成 hook (待改)
export const useCart = () => {
  return useContext(CartContext);
};
