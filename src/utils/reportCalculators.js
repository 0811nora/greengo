// 計算報表邏輯
// 計算報表統計數據

export const calculateStatistics = (orders) => {
  // 初始化統計數據
  const stats = {
    // 營業額（只計算已付款訂單）
    revenue: {
      total: 0,
      creditCard: 0,
      cash: 0,
      ePayment: 0,
    },
    // 訂單數（包含未付款）
    orderCount: {
      total: 0,
      fixed: 0,
      custom: 0,
    },
    // 已付款訂單數
    paidOrderCount: 0,
    // 平均客單價（只算已付款訂單）
    averageOrderValue: 0,
  };

  // 遍歷每筆訂單
  orders.forEach((order) => {
    const total = order.total || 0;
    const isPaid = order.is_paid;

    // 只有已付款的訂單才計入營業額
    if (isPaid) {
      stats.revenue.total += total;
      stats.paidOrderCount += 1;

      // 統計支付方式（只統計已付款的）
      // payment_method 放在 user 物件裡
      const paymentMethod = order.user?.payment_method;
      if (paymentMethod === "credit_card") {
        stats.revenue.creditCard += total;
      } else if (paymentMethod === "cash") {
        stats.revenue.cash += total;
      } else if (paymentMethod === "e_payment") {
        stats.revenue.ePayment += total;
      }
    }

    // 計算總訂單數（包含未付款）
    stats.orderCount.total += 1;

    // 判斷訂單類型（根據訂單中的商品）
    const products = order.products || {};
    let hasFixed = false;
    let hasCustom = false;

    Object.values(products).forEach((item) => {
      const productType = item.product?.product_type;
      if (productType === "set") {
        hasFixed = true;
      } else if (productType === "combo") {
        hasCustom = true;
      }
    });

    // 固定套餐
    if (hasFixed) {
      stats.orderCount.fixed += 1;
    }
    // 自由配
    if (hasCustom) {
      stats.orderCount.custom += 1;
    }
  });

  // 計算平均客單價（已付款訂單）
  stats.averageOrderValue =
    stats.paidOrderCount > 0
      ? Math.round(stats.revenue.total / stats.paidOrderCount)
      : 0;

  return stats;
};

// 計算圓餅圖支付方式
export const calculatePaymentMethod = (orders) => {
  let creditCardTotal = 0;
  let cashTotal = 0;
  let ePaymentTotal = 0;

  orders.forEach((order) => {
    // 統計已付款訂單
    if (order.is_paid) {
      const total = order.total || 0;
      // payment_method 現在在 user 物件裡
      const paymentMethod = order.user?.payment_method;

      if (paymentMethod === "credit_card") {
        creditCardTotal += total;
      } else if (paymentMethod === "cash") {
        cashTotal += total;
      } else if (paymentMethod === "e_payment") {
        ePaymentTotal += total;
      }
    }
  });

  return [
    { name: "信用卡", value: creditCardTotal },
    { name: "現金", value: cashTotal },
    { name: "電子支付", value: ePaymentTotal },
  ];
};

// 計算折線圖資料
export const calculateSalesTrend = (orders, timeLabels, getTimeLabelFn) => {
  // 初始化每個時間點的資料
  const trendData = timeLabels.map((label) => ({
    time: label,
    revenue: 0,
    cash: 0,
    creditCard: 0,
    ePayment: 0,
  }));

  // 統計每筆訂單到對應的時間點
  orders.forEach((order) => {
    // 統計已付款訂單
    if (order.is_paid) {
      const timeLabel = getTimeLabelFn(order);
      const index = timeLabels.indexOf(timeLabel);

      if (index !== -1) {
        const total = order.total || 0;
        // payment_method 現在在 user 物件裡
        const paymentMethod = order.user?.payment_method;

        trendData[index].revenue += total;

        if (paymentMethod === "credit_card") {
          trendData[index].creditCard += total;
        } else if (paymentMethod === "cash") {
          trendData[index].cash += total;
        } else if (paymentMethod === "e_payment") {
          trendData[index].ePayment += total;
        }
      }
    }
  });

  return trendData;
};

// 計算熱銷商品排行 (待修改)
export const calculateTopProducts = (orders, category, topN = 5) => {
  const productSales = {}; // { productId: { name, count, revenue } }

  orders.forEach((order) => {
    const products = order.products || {};

    Object.values(products).forEach((item) => {
      const product = item.product;
      if (!product) return; // 如果沒有商品資料就跳過

      const productType = product.product_type;
      const productCategory = product.category;

      // 根據類別篩選商品
      let shouldCount = false;

      if (category === "fixed") {
        // 固定套餐：product_type "set" / category "固定餐"
        if (productType === "set" || productCategory === "固定餐") {
          shouldCount = true;
        }
      } else if (category === "custom") {
        // 自由配：product_type "combo" / category "custom"
        if (productType === "combo" || productCategory === "custom") {
          shouldCount = true;
        }
      } else if (category === "other" || category === "item") {
        // 其他 other 或 item
        // product_type -> drink / soup
        // category 飲品、湯品，有其他品項可以再增加
        const otherCategories = ["飲品", "湯品"];
        if (
          productType === "drink" ||
          productType === "soup" ||
          otherCategories.includes(productCategory)
        ) {
          shouldCount = true;
        }
      }

      if (shouldCount) {
        const productId = item.product_id;
        const qty = item.qty || 0;
        const total = item.total || 0;

        if (!productSales[productId]) {
          productSales[productId] = {
            name: product.title || "未知商品",
            count: 0,
            revenue: 0,
          };
        }

        productSales[productId].count += qty;
        productSales[productId].revenue += total;
      }
    });
  });

  // 轉換成陣列並排行
  const sortedProducts = Object.entries(productSales)
    .map(([id, data]) => ({
      id,
      name: data.name,
      count: data.count,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.count - a.count) // 按售出數量排行
    .slice(0, topN); // 取前 5 名

  return sortedProducts;
};

// 計算自由配的配料/附餐排行
// 統計自由配中各種 base, protein, sides 等的使用次數
export const calculateCustomIngredientsTop = (
  orders,
  ingredientType,
  topN = 5,
) => {
  const ingredientCount = {}; // { 配料名稱: 次數 }

  orders.forEach((order) => {
    const products = order.products || {};

    Object.values(products).forEach((item) => {
      const product = item.product;
      const productType = product?.product_type;

      // 只統計自由配 (combo)
      if (productType === "combo" || product?.category === "custom") {
        const customizations = item.customizations;
        if (!customizations) return;

        const qty = item.qty || 1;

        // 配料們
        if (ingredientType === "base") {
          // 基底
          const base = customizations.included?.base;
          if (base) {
            ingredientCount[base] = (ingredientCount[base] || 0) + qty;
          }
        } else if (ingredientType === "protein") {
          // 蛋白質
          const proteins = customizations.included?.proteins || [];
          proteins.forEach((p) => {
            const name = p.title;
            const proteinQty = p.qty || 1;
            if (name) {
              ingredientCount[name] =
                (ingredientCount[name] || 0) + qty * proteinQty;
            }
          });
        } else if (ingredientType === "sides") {
          // 配菜
          const sides = customizations.included?.sides || [];
          sides.forEach((s) => {
            const name = s.title;
            const sideQty = s.qty || 1;
            if (name) {
              ingredientCount[name] =
                (ingredientCount[name] || 0) + qty * sideQty;
            }
          });
        } else if (ingredientType === "sauce") {
          // 醬料
          const sauce = customizations.included?.sauce;
          if (sauce) {
            ingredientCount[sauce] = (ingredientCount[sauce] || 0) + qty;
          }
        } else if (ingredientType === "drink" || ingredientType === "soup") {
          // 附餐（飲料或湯） 資料結構 addons: [...]
          const addons = customizations.addons;
          if (Array.isArray(addons)) {
            // addons -> 陣列
            addons.forEach((addon) => {
              const name = addon.title;
              const addonQty = addon.qty || 1;
              if (name) {
                ingredientCount[name] =
                  (ingredientCount[name] || 0) + qty * addonQty;
              }
            });
          } else if (addons && typeof addons === "object") {
            // 或 addons.drinks + addons.soup
            const items =
              addons[ingredientType + "s"] || addons[ingredientType] || [];
            items.forEach((addon) => {
              const name = addon.title;
              const addonQty = addon.qty || 1;
              if (name) {
                ingredientCount[name] =
                  (ingredientCount[name] || 0) + qty * addonQty;
              }
            });
          }
        }
      }
    });
  });

  // 轉成陣列並排行
  const sortedIngredients = Object.entries(ingredientCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);

  return sortedIngredients;
};
