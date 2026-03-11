import DonutPFC from '../Custom-comp/PFC_Chart';
import CartDetailContent from './CartDetailContent';

//購物車展開明細
const CartItemDetails = ({ item, hasAddonsContent, addon }) => {
  const isCustom = item?.product?.category === 'custom';
  const isPoke = item?.product?.category === 'fixed' || isCustom;
  const nutritionInfo = item?.customizations?.total_nutrition;

  return (
    <div className="item-details-panel">
      <div className="details-grid">
        {isPoke ? (
          <div className="detail-column content-list">
            <h4
              className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-4"
            >
              <i className="bi bi-postcard-heart me-2"></i>內容物明細
            </h4>

            {isCustom ? (
              // 自選 Poke 的渲染邏輯
              <>
                <ul className="px-2">
                  <li className="mb-3">
                    <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                      基底
                    </span>
                    <CartDetailContent
                      items={item?.customizations?.included?.base}
                      mode="included_general"
                    />
                  </li>

                  <li className="mb-3">
                    <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                      主食
                    </span>
                    <CartDetailContent
                      items={item?.customizations?.included?.protein}
                      mode="included_protein"
                    />
                  </li>

                  <li className="mb-3">
                    <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                      醬料
                    </span>
                    <CartDetailContent
                      items={item?.customizations?.included?.sauce}
                      mode="included_general"
                    />
                  </li>

                  <li className="mb-5">
                    <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                      配菜
                    </span>
                    <CartDetailContent
                      items={item?.customizations?.included?.side}
                      mode="included_general"
                    />
                  </li>
                </ul>

                {/* 加購區 (Addons) */}
                {hasAddonsContent && (
                  <>
                    <h4
                      className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-4"
                    >
                      <i className="bi bi-plus-circle-fill me-2"></i> 加購明細
                    </h4>
                    <ul className="px-2">
                      {addon.base?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            基底
                          </span>
                          <CartDetailContent
                            items={item?.customizations?.addon?.base}
                            mode="addon"
                          />
                        </li>
                      )}

                      {addon.protein?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            主食
                          </span>
                          <CartDetailContent
                            items={item?.customizations?.addon?.protein}
                            mode="addon"
                          />
                        </li>
                      )}

                      {addon.sauce?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            醬料
                          </span>
                          <CartDetailContent
                            items={item?.customizations?.addon?.sauce}
                            mode="addon"
                          />
                        </li>
                      )}
                      {addon?.side?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            配菜
                          </span>
                          <CartDetailContent
                            items={item?.customizations?.addon?.side}
                            mode="addon"
                          />
                        </li>
                      )}

                      {addon?.drinks?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            飲品
                          </span>
                          <CartDetailContent
                            items={item?.customizations?.addon?.drinks}
                            mode="addon"
                          />
                        </li>
                      )}
                      {addon?.soup?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            湯品
                          </span>
                          <CartDetailContent
                            items={item?.customizations?.addon?.soup}
                            mode="addon"
                          />
                        </li>
                      )}
                    </ul>
                  </>
                )}
              </>
            ) : (
              <>
                {item.product.ingredients && (
                  <>
                    <ul className="px-2">
                      <li className="mb-3">
                        <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                          基底
                        </span>
                        <span className="text-brown-300">
                          {item.product.ingredients.base}
                        </span>
                      </li>
                      <li className="mb-3">
                        <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                          主食
                        </span>
                        <span className="text-brown-300">
                          {item.product.ingredients.main}
                        </span>
                      </li>
                      <li className="mb-3">
                        <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                          醬料
                        </span>
                        <span className="text-brown-300">
                          {item.product.ingredients.source}
                        </span>
                      </li>
                      <li className="mb-5">
                        <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                          配菜
                        </span>
                        <span className="text-brown-300">
                          {item.product.ingredients.side}
                        </span>
                      </li>
                    </ul>
                  </>
                )}

                {/* 加購區 (Addons) */}

                {hasAddonsContent && (
                  <>
                    <h4
                      className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-4"
                    >
                      <i className="bi bi-postcard-heart me-2"></i> 加購明細
                    </h4>
                    <ul className="px-2">
                      {addon.base?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            基底
                          </span>
                          <CartDetailContent
                            items={item?.customizations?.addon?.base}
                            mode="addon"
                          />
                        </li>
                      )}

                      {addon.protein?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            主食
                          </span>
                          <CartDetailContent
                            items={item?.customizations?.addon?.protein}
                            mode="addon"
                          />
                        </li>
                      )}

                      {addon.sauce?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            醬料
                          </span>
                          <CartDetailContent
                            items={item?.customizations?.addon?.sauce}
                            mode="addon"
                          />
                        </li>
                      )}
                      {addon?.side?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            配菜
                          </span>
                          <CartDetailContent
                            items={item?.customizations?.addon?.side}
                            mode="addon"
                          />
                        </li>
                      )}

                      {addon.drinks?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            飲品
                          </span>
                          <CartDetailContent
                            items={item?.customizations?.addon?.drinks}
                            mode="addon"
                          />
                        </li>
                      )}
                      {addon.soup?.length > 0 && (
                        <li className="mb-3">
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            湯品
                          </span>
                          <CartDetailContent
                            items={item?.customizations?.addon?.soup}
                            mode="addon"
                          />
                        </li>
                      )}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="detail-column content-list">
            <h4
              className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-4"
            >
              <i className="bi bi-postcard-heart me-2"></i>內容物明細
            </h4>
            <ul className="px-2">
              <li className="mb-3">
                <span className="text-brown-300">
                  {item?.product?.ingredients?.base}
                </span>
              </li>
            </ul>
          </div>
        )}

        <div className={`detail-column nutrition-info mb-3 `}>
          <h4
            className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-4"
          >
            <i className="bi bi-pie-chart-fill me-2"></i> 單品營養素資訊
          </h4>
          <DonutPFC
            protein={nutritionInfo?.protein}
            fat={nutritionInfo?.fat}
            carbs={nutritionInfo?.carbs}
            calories={nutritionInfo?.calories}
          />
        </div>
      </div>
    </div>
  );
};

export default CartItemDetails;
