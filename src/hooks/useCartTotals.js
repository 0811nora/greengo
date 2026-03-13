import { useMemo } from 'react';

// 計算購物車金額
export const useCartTotals = (cartItems = [], discount = 0) => {
  const totals = useMemo(() => {
    if (!Array.isArray(cartItems)) {
      return {
        baseSubtotal: 0,
        totalAddons: 0,
        cartItemsQty: 0,
        finalTotal: 0,
      };
    }

    const { baseSubtotal, totalAddons, cartItemsQty } = cartItems.reduce(
      (acc, item) => {
        const itemBasePrice = item?.customizations?.plan_info?.base_price || 0;
        const itemExtraPrice = item?.customizations?.extra_price || 0;
        const qty = item?.qty || 0;

        acc.baseSubtotal += itemBasePrice * qty;
        acc.totalAddons += itemExtraPrice * qty;
        acc.cartItemsQty += qty;

        return acc;
      },
      { baseSubtotal: 0, totalAddons: 0, cartItemsQty: 0 },
    );

    const finalTotal = Math.max(0, baseSubtotal + totalAddons - discount);

    return { baseSubtotal, totalAddons, cartItemsQty, finalTotal };
  }, [cartItems, discount]);

  return totals;
};
