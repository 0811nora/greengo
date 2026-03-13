import DonutPFC from '../Custom-comp/PFC_Chart';
import CartDetailContent from './CartDetailContent';

//訂單產品明細
const RecipeModal = ({ product, onClose }) => {
  if (!product) return null;

  const isCustom = product.product.category === 'custom';
  const addon = product.customizations?.addon;
  const hasAddonsContent =
    addon &&
    (addon.base?.length > 0 ||
      addon.protein?.length > 0 ||
      addon.sauce?.length > 0 ||
      addon.side?.length > 0 ||
      addon.drinks?.length > 0 ||
      addon.soup?.length > 0);

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-orange-100 border-bottom-0 p-5">
            <h5 className="modal-title fs-6">{product.product.title} 明細</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body p-6 text-gray-300 fs-sm">
            <h4
              className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-2"
            >
              <i className="bi bi-coin me-2"></i>費用明細
            </h4>
            <div
              className="text-brown-300 mb-6 px-2"
              style={{ maxWidth: '220px' }}
            >
              <p className="d-flex justify-content-between mb-1">
                <span className="me-5">原價</span>
                <span>
                  <i className="bi bi-currency-dollar"></i>
                  {product?.customizations?.plan_info?.base_price}
                </span>
              </p>
              {hasAddonsContent && (
                <p className="d-flex justify-content-between mb-1">
                  <span className="me-5">加購</span>
                  <span>
                    <i className="bi bi-currency-dollar"></i>
                    {product?.customizations?.extra_price}
                  </span>
                </p>
              )}

              <p className="d-flex justify-content-between">
                <span className="me-5">單品合計</span>
                <span>
                  <i className="bi bi-currency-dollar"></i>
                  {product?.customizations?.custom_total}
                </span>
              </p>
            </div>
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
                      items={product?.customizations?.included?.base}
                      mode="included_general"
                    />
                  </li>

                  <li className="mb-3">
                    <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                      主食
                    </span>
                    <CartDetailContent
                      items={product?.customizations?.included?.protein}
                      mode="included_protein"
                    />
                  </li>

                  <li className="mb-3">
                    <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                      醬料
                    </span>
                    <CartDetailContent
                      items={product?.customizations?.included?.sauce}
                      mode="included_general"
                    />
                  </li>

                  <li className="mb-3">
                    <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                      配菜
                    </span>
                    <CartDetailContent
                      items={product?.customizations?.included?.side}
                      mode="included_general"
                    />
                  </li>
                </ul>

                {/* 加購區 (Addons) */}
                {hasAddonsContent && (
                  <>
                    <h4
                      className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-4 mt-5"
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
                            items={product?.customizations?.addon?.base}
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
                            items={product?.customizations?.addon?.protein}
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
                            items={product?.customizations?.addon?.sauce}
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
                            items={product?.customizations?.addon?.side}
                            mode="addon"
                          />
                        </li>
                      )}

                      {addon?.drinks?.length > 0 && (
                        <li className="mb-3">
                          <span>飲品：</span>
                          <CartDetailContent
                            items={product?.customizations?.addon?.drinks}
                            mode="addon"
                          />
                        </li>
                      )}
                      {addon?.soup?.length > 0 && (
                        <li className="mb-3">
                          <span>湯品：</span>
                          <CartDetailContent
                            items={product?.customizations?.addon?.soup}
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
                {product?.product.ingredients && (
                  <>
                    <ul className="px-2">
                      <li className="mb-3">
                        {product?.product.category !== 'other' ? (
                          <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                            基底
                          </span>
                        ) : (
                          ''
                        )}

                        <span className="text-brown-300">
                          {product?.product.ingredients.base}
                        </span>
                      </li>
                      {product?.product.category !== 'other' && (
                        <>
                          <li className="mb-3">
                            <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                              主食
                            </span>
                            <span className="text-brown-300">
                              {product?.product.ingredients.main}
                            </span>
                          </li>
                          <li className="mb-3">
                            <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                              醬料
                            </span>
                            <span className="text-brown-300">
                              {product?.product.ingredients.source}
                            </span>
                          </li>
                          <li className="mb-5">
                            <span className="bg-primary-100 px-2 py-1 rounded-4 me-2">
                              配菜
                            </span>
                            <span className="text-brown-300">
                              {product?.product.ingredients.side}
                            </span>
                          </li>
                        </>
                      )}
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
                            items={product?.customizations?.addon?.base}
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
                            items={product?.customizations?.addon?.protein}
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
                            items={product?.customizations?.addon?.sauce}
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
                            items={product?.customizations?.addon?.side}
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
                            items={product?.customizations?.addon?.drinks}
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
                            items={product?.customizations?.addon?.soup}
                            mode="addon"
                          />
                        </li>
                      )}
                    </ul>
                  </>
                )}
              </>
            )}
            <h4
              className="fs-sm text-brown-300 mb-2 d-flex align-items-center px-1 pb-1 border-bottom
                      border-5 border-gray-100 mb-4 mt-5"
            >
              <i className="bi bi-pie-chart-fill me-2"></i> 單品營養素資訊
            </h4>
            <DonutPFC
              protein={product?.customizations?.total_nutrition?.protein}
              fat={product?.customizations?.total_nutrition?.fat}
              carbs={product?.customizations?.total_nutrition?.carbs}
              calories={product?.customizations?.total_nutrition?.calories}
            />
          </div>
          <div className="modal-footer border-gray-50">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RecipeModal;
