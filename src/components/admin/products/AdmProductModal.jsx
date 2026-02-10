import AdmButton from "../../../components/admin/common/AdmButton";
export default function AdmProductModal({
  isOpen,
  mode,
  data,
  preImageUrl,
  onChange,
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  const categoryConfig = {
    fixed: {
      titleLabel: "商品名稱 (Title)",
      gramsLabel: "份量 (Grams)",
      showProductType: false,
      showComplexFields: true,
    },
    item: {
      titleLabel: "食材名稱 (Title)",
      gramsLabel: "份量 (Grams)",
      showProductType: true,
      options: [
        { value: "base", label: "基底 (Base)" },
        { value: "protein", label: "蛋白質 (Protein)" },
        { value: "side", label: "配菜 (Side)" },
        { value: "sauce", label: "醬汁 (Sauce)" },
      ],
    },
    other: {
      titleLabel: "飲品湯品名稱 (Title)",
      gramsLabel: "容量 (Grams)",
      showProductType: true,
      options: [
        { value: "soup", label: "湯品 (Soup)" },
        { value: "drinks", label: "飲料 (Drinks)" },
      ],
    },
  };

  const config = categoryConfig[data.category] || categoryConfig.item;

  const renderTagCheckbox = (fieldName, tag) => {
    const tagList = Array.isArray(data[fieldName]) ? data[fieldName] : [];
    const isChecked = tagList.includes(tag);

    return (
      <div key={`${fieldName}-${tag}`} className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id={`${fieldName}-${tag}`}
          checked={isChecked}
          onChange={(e) => {
            const checked = e.target.checked;
            const nextTags = checked
              ? [...tagList, tag]
              : tagList.filter((t) => t !== tag);

            const syntheticEvent = {
              target: {
                name: fieldName,
                value: nextTags,
                type: "checkbox",
                dataset: { group: "" },
              },
            };
            onChange(syntheticEvent, "product");
          }}
        />
        <label className="form-check-label" htmlFor={`${fieldName}-${tag}`}>
          {tag}
        </label>
      </div>
    );
  };

  return (
    <div className="adm-product-modal-overlay" onClick={onClose}>
      <div
        className="adm-product-modal-content adm__glassbg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="adm-product-modal-header">
          <h5 className="adm-product-modal-title">
            <span>{mode === "add" ? "新增產品" : "編輯產品"}</span>
          </h5>
          <button className="close-x" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="adm-product-modal-body">
          <div className="row justify-content-between">
            {/* 左側：圖片區 */}
            <div className="col-sm-4">
              <div className="mb-3">
                <label className="form-label">圖片網址 (ImageUrl)</label>
                <input
                  name="imageUrl"
                  type="text"
                  className="form-control rounded-pill"
                  value={data.imageUrl || ""}
                  onChange={(e) => onChange(e, "product")}
                />
              </div>
              <img
                src={
                  mode === "add" ? preImageUrl || data.imageUrl : data.imageUrl
                }
                className="img-fluid rounded"
                alt=""
              />
            </div>

            {/* 右側：表單區 */}
            <div className="col-sm-8">
              <div className="d-flex ps-4 py-2 mb-4 bg-dark rounded-pill text-white">
                <div className="col-6">
                  <div className="form-check form-switch ps-0 ">
                    <label className="form-check-label d-flex align-items-center gap-2">
                      <p className="fs-6">上架狀態</p>
                      <input
                        className="form-check-input ms-1 pt-4 px-4"
                        type="checkbox"
                        role="switch"
                        name="is_enabled"
                        checked={!!data.is_enabled}
                        onChange={(e) => onChange(e, "product")}
                      />
                    </label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-check form-switch ps-0 ">
                    <label className="form-check-label d-flex align-items-center gap-2">
                      <p className="fs-6 mb-0">庫存狀態</p>
                      <input
                        className="form-check-input ms-1 pt-4 px-4"
                        type="checkbox"
                        role="switch"
                        name="is_stock"
                        checked={!!data.is_stock}
                        onChange={(e) => onChange(e, "product")}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-5 mb-4 adm__glassbg rounded-4">
                <h4 className="mb-3">基本資訊</h4>
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <label className="form-label d-block">
                      {config.titleLabel}
                      <input
                        type="text"
                        name="title"
                        className="form-control rounded-pill mt-1"
                        value={data.title || ""}
                        onChange={(e) => onChange(e, "product")}
                      />
                    </label>
                  </div>

                  <div className={config.showProductType ? "col-6" : "col-12"}>
                    <label className="form-label d-block">
                      類別 (Category)
                    </label>
                    <select
                      name="category"
                      className="form-select rounded-pill mt-1"
                      value={data.category}
                      disabled
                    >
                      <option value="fixed">主題Poke</option>
                      <option value="item">食材</option>
                      <option value="other">飲料、湯品</option>
                    </select>
                  </div>

                  {config.showProductType && (
                    <div className="col-6">
                      <label className="form-label d-block">
                        分類 (Product type)
                      </label>
                      <select
                        name="product_type"
                        className="form-select rounded-pill mt-1"
                        value={data.product_type || ""}
                        onChange={(e) => onChange(e, "product")}
                      >
                        <option value=" " disabled>
                          請選擇分類
                        </option>
                        {config.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="col-6">
                    <label className="form-label d-block">售價 (Price)</label>
                    <input
                      type="number"
                      name="price"
                      className="form-control rounded-pill mt-1"
                      value={data.price}
                      onChange={(e) => onChange(e, "product")}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label d-block">
                      {config.gramsLabel}
                    </label>
                    <input
                      type="text"
                      name="grams"
                      className="form-control rounded-pill mt-1"
                      value={data.grams || ""}
                      onChange={(e) => onChange(e, "product")}
                    />
                  </div>
                  {config.showComplexFields && (
                    <>
                      <div className="col-12">
                        <label className="form-label d-block">
                          描述 (Description)
                          <textarea
                            name="description"
                            className="form-control rounded-3 mt-1"
                            rows="2"
                            value={data.description}
                            onChange={(e) => onChange(e, "product")}
                          ></textarea>
                        </label>
                      </div>

                      <div className="col-md-12 mb-3">
                        <label className="form-label d-block mb-2">
                          商品標籤 (Tab_collection)
                        </label>
                        <div className="d-flex flex-wrap gap-3">
                          {["多多蛋白", "低脂低卡", "人氣推薦", "新鮮蔬食"].map(
                            (tag) => renderTagCheckbox("tab_collection", tag),
                          )}
                        </div>
                      </div>

                      <div className="col-md-12 mb-3">
                        <label className="form-label d-block mb-2">
                          忌口標籤 (Include_tags)
                        </label>
                        <div className="d-flex flex-wrap gap-3">
                          {["人氣推薦", "海鮮", "辣", "牛"].map((tag) =>
                            renderTagCheckbox("include_tags", tag),
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 營養標示 */}
              <div className="p-5 mb-4 adm__glassbg rounded-4">
                <h4 className="mb-3">營養標示 (Nutrition)</h4>
                <div className="row g-3">
                  {/* 定義中文標籤對照表 */}
                  {Object.entries({
                    calories: "卡路里 (Calories)",
                    protein: "蛋白質 (Protein)",
                    fat: "脂肪 (Fat)",
                    carbs: "碳水化合物 (Carbs)",
                  }).map(([field, label]) => (
                    <div className="col-md-6" key={field}>
                      <label className="form-label d-block">
                        {label}
                        <input
                          name={field}
                          data-group="nutrition"
                          type="number"
                          className="form-control rounded-pill mt-1"
                          min="0"
                          value={data.nutrition?.[field]}
                          onChange={(e) => onChange(e, "product")}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {config.showComplexFields && (
                <div className="p-5 mb-4 adm__glassbg rounded-4">
                  <h4 className="mb-3">內容配置</h4>
                  <div className="row g-3">
                    {/* <div className="col-md-12">
                      <label className="form-label d-block">
                        方案類型 (Plan Type)
                        <select
                          data-group="content"
                          name="plan_type"
                          className="form-select rounded-pill mt-1"
                          value={data.content.plan_type}
                          onChange={(e) => onChange(e, "product")}
                        >
                          <option value=" " disabled>
                            請選擇方案
                          </option>

                          <option value="balanced">均衡 (Balanced)</option>
                          <option value="light">輕食 (Light)</option>
                          <option value="highProtein">
                            高蛋白 (High Protein)
                          </option>
                        </select>
                      </label>
                    </div> */}
                    {/* <div className="col-md-3">
                          <label className="form-label d-block">
                            基底限制
                            <input
                              data-group="content"
                              name="base_limit"
                              type="number"
                              min="0"
                              className="form-control rounded-pill mt-1"
                              value={newProductData.content.base_limit}
                              onChange={(e) => handleInputChange(e, 'product')}
                            />
                          </label>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label d-block">
                            蛋白質限制
                            <input
                              data-group="content"
                              name="protein_limit"
                              type="number"
                              min="0"
                              className="form-control rounded-pill mt-1"
                              value={newProductData.content.protein_limit}
                              onChange={(e) => handleInputChange(e, 'product')}
                            />
                          </label>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label d-block">
                            配菜限制
                            <input
                              data-group="content"
                              name="side_limit"
                              type="number"
                              min="0"
                              className="form-control rounded-pill mt-1"
                              value={newProductData.content.side_limit}
                              onChange={(e) => handleInputChange(e, 'product')}
                            />
                          </label>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label d-block">
                            醬料限制
                            <input
                              data-group="content"
                              name="sauce_limit"
                              type="number"
                              min="0"
                              className="form-control rounded-pill mt-1"
                              value={newProductData.content.sauce_limit}
                              onChange={(e) => handleInputChange(e, 'product')}
                            />
                          </label>
                        </div> */}

                    <div className="col-12">
                      <label className="form-label d-block">
                        基底 (Base)
                        <input
                          name="base"
                          data-group="ingredients"
                          type="text"
                          className="form-control rounded-pill mt-1"
                          value={data.ingredients.base}
                          onChange={(e) => onChange(e, "product")}
                        />
                      </label>
                    </div>
                    <div className="col-12">
                      <label className="form-label d-block">
                        主食 (Main)
                        <input
                          name="main"
                          data-group="ingredients"
                          type="text"
                          className="form-control rounded-pill mt-1"
                          value={data.ingredients.main}
                          onChange={(e) => onChange(e, "product")}
                        />
                      </label>
                    </div>
                    <div className="col-12">
                      <label className="form-label d-block">
                        配菜 (Side)
                        <textarea
                          name="side"
                          data-group="ingredients"
                          className="form-control rounded-3 mt-1"
                          rows="2"
                          value={data.ingredients.side}
                          onChange={(e) => onChange(e, "product")}
                        ></textarea>
                      </label>
                    </div>
                    <div className="col-12">
                      <label className="form-label d-block">
                        醬料 (Source)
                        <input
                          name="source"
                          data-group="ingredients"
                          type="text"
                          className="form-control rounded-pill mt-1"
                          value={data.ingredients.source}
                          onChange={(e) => onChange(e, "product")}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="adm-product-modal-footer">
          <AdmButton
            onClick={onClose}
            text={"取消"}
            color={"tertiary"}
            size={"lg"}
            className={"me-5"}
          />
          <AdmButton
            onClick={onConfirm}
            text={mode === "add" ? "新增" : "修改"}
            color={"secondary"}
            size={"lg"}
          />
        </div>
      </div>
    </div>
  );
}
