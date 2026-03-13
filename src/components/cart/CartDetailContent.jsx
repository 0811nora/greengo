// 選購的商品明細 渲染邏輯
const CartDetailContent = ({ items, mode = 'addon' }) => {
  if (!items || items.length === 0) return null;

  return items.map((subItem, index) => {
    const unitPrice = subItem.price || 0;
    const qty = subItem.qty || 1;
    let displayPrice = 0;

    if (mode === 'included_protein') {
      displayPrice = Math.max(0, unitPrice - 30) * qty;
    } else if (mode === 'included_general') {
      displayPrice = 0;
    } else {
      displayPrice = unitPrice * qty;
    }

    return (
      <span
        className="text-brown-300"
        key={`${subItem.title}-${index}`}
        style={{ marginRight: '8px' }}
      >
        {subItem.title}
        {qty > 1 && ` X${qty}`}
        {displayPrice > 0 && ` (+${displayPrice})`}
        {index < items.length - 1 && '、'}
      </span>
    );
  });
};

export default CartDetailContent;
