import { useEffect } from 'react';
import AdmButton from '../../../components/admin/common/AdmButton';
import { useForm, useWatch } from 'react-hook-form';

const TAG_DATA = {
  // 固定餐 (Poke)
  set: {
    tab_collection: [
      { value: 'popular', label: '人氣推薦' },
      { value: 'highProtein', label: '多多蛋白' },
      { value: 'lowFat', label: '低卡低脂' },
      { value: 'veg', label: '新鮮蔬食' },
    ],
    include_tags: [
      { value: 'beef', label: '牛肉' },
      { value: 'pork', label: '豬肉' },
      { value: 'seafood', label: '海鮮' },
      { value: 'spicy', label: '辣' },
    ],
  },
  // 飲料
  drinks: {
    tab_collection: [
      { key: 'tea', label: '茶' },
      { key: 'coffee', label: '咖啡' },
      { key: 'juice', label: '果汁' },
    ],
    include_tags: [
      { key: 'alcohol', label: '酒精' },
      { key: 'caffeine', label: '咖啡因' },
      { key: 'sugar', label: '糖' },
    ],
  },
  // 湯品
  soup: {
    tab_collection: [
      { key: 'freshSoup', label: '清爽湯' },
      { key: 'proteinSoup', label: '高蛋白湯' },
      { key: 'vegSoup', label: '素食湯' },
    ],
    include_tags: [
      { key: 'beef', label: '牛肉' },
      { key: 'daily', label: '奶' },
    ],
  },
};

export default function AdmProductModal({
  isOpen,
  mode,
  data,
  onClose,
  onConfirm,
}) {
  const defaultImageUrl =
    'https://storage.googleapis.com/vue-course-api.appspot.com/greengo/1770837970270.png';
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      category: 'item',
      product_type: '',
      price: 0,
      grams: 0,
      description: '',
      imageUrl: '',
      is_enabled: false,
      is_stock: false,
      nutrition: {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
      },
      ingredients: {
        base: '',
        main: '',
        side: '',
        source: '',
      },
      tab_collection: [],
      include_tags: [],
    },
  });

  useEffect(() => {
    if (isOpen && data) {
      reset(data);
    }
  }, [isOpen, data, reset]);

  const watchedCategory = useWatch({ control, name: 'category' });
  const watchedProductType = useWatch({ control, name: 'product_type' });
  const watchedImageUrl = useWatch({ control, name: 'imageUrl' });

  const onSubmit = (formData) => {
    onConfirm(formData);
  };

  if (!isOpen) return null;

  const categoryConfig = {
    fixed: {
      titleLabel: '商品名稱 (Title)',
      gramsLabel: '份量 (Grams)',
      showProductType: false,
      showComplexFields: true,
    },
    item: {
      titleLabel: '食材名稱 (Title)',
      gramsLabel: '份量 (Grams)',
      showProductType: true,
      options: [
        { value: 'base', label: '基底 (Base)' },
        { value: 'protein', label: '蛋白質 (Protein)' },
        { value: 'side', label: '配菜 (Side)' },
        { value: 'sauce', label: '醬汁 (Sauce)' },
      ],
      showComplexFields: false,
    },
    other: {
      titleLabel: '飲品湯品名稱 (Title)',
      gramsLabel: '容量 (Grams)',
      showProductType: true,
      options: [
        { value: 'soup', label: '湯品 (Soup)' },
        { value: 'drinks', label: '飲料 (Drinks)' },
      ],
      showComplexFields: true,
      isOther: true,
    },
  };

  const config = categoryConfig[watchedCategory] || categoryConfig.item;

  const getCurrentTagOptions = () => {
    let currentTags = { tab_collection: [], include_tags: [] };

    if (watchedCategory === 'fixed') {
      currentTags = TAG_DATA.set;
    } else if (watchedCategory === 'other') {
      if (watchedProductType === 'soup') {
        currentTags = TAG_DATA.soup;
      } else if (watchedProductType === 'drinks') {
        currentTags = TAG_DATA.drinks;
      }
    }

    return {
      tabOptions: currentTags?.tab_collection || [],
      includeOptions: currentTags?.include_tags || [],
    };
  };

  const { tabOptions, includeOptions } = getCurrentTagOptions();

  const renderTagCheckbox = (fieldName, option) => {
    const optionValue = option.value || option.key;

    return (
      <div key={`${fieldName}-${optionValue}`} className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id={`${fieldName}-${optionValue}`}
          value={optionValue}
          {...register(fieldName)}
        />
        <label
          className="form-check-label"
          htmlFor={`${fieldName}-${optionValue}`}
        >
          {option.label}
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
        <div className="adm-product-modal-header">
          <h5 className="adm-product-modal-title">
            <span>{mode === 'add' ? '新增產品' : '編輯產品'}</span>
          </h5>
          <button className="close-x" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="adm-product-modal-body">
            <div className="row justify-content-between">
              <div className="col-sm-4">
                <div className="p-5 adm__glassbg rounded-4">
                  <label className="form-label">
                    圖片網址 (ImageUrl) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control rounded-pill mb-7  ${errors.imageUrl ? 'is-invalid' : ''}`}
                    {...register('imageUrl', {
                      required: '圖片網址為必填欄位',
                    })}
                  />
                  {errors.imageUrl && (
                    <div className="invalid-feedback">
                      {errors.imageUrl.message}
                    </div>
                  )}
                  <img
                    src={watchedImageUrl || defaultImageUrl}
                    className="img-fluid rounded shadow-sm"
                    alt="Product"
                    onError={(e) => {
                      if (e.target.src !== defaultImageUrl) {
                        e.target.src = defaultImageUrl;
                      }
                    }}
                  />
                </div>
              </div>

              <div className="col-sm-8">
                <div className="p-7 mb-4 adm__glassbg rounded-4">
                  <h4 className="mb-5">基本資訊</h4>
                  <div className="row g-3 mb-4">
                    <div className="d-flex ps-4 py-2 mb-4 bg-dark rounded-pill text-white">
                      <div className="col-6">
                        <div className="form-check form-switch ps-0 ">
                          <label className="form-check-label d-flex align-items-center gap-2">
                            <p className="fs-6">上架狀態</p>
                            <input
                              className="form-check-input ms-1 pt-4 px-4 m-0"
                              type="checkbox"
                              role="switch"
                              {...register('is_enabled')}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-check form-switch ps-0 ">
                          <label className="form-check-label d-flex align-items-center gap-2">
                            <p className="fs-6 mb-0">庫存狀態</p>
                            <input
                              className="form-check-input ms-1 pt-4 px-4 m-0"
                              type="checkbox"
                              role="switch"
                              {...register('is_stock')}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label d-block">
                        {config.titleLabel}{' '}
                        <span className="text-danger">*</span>
                        <input
                          type="text"
                          className={`form-control rounded-pill ${errors.title ? 'is-invalid' : ''}`}
                          {...register('title', {
                            required: '商品名稱為必填欄位',
                          })}
                        />
                        {errors.title && (
                          <div className="invalid-feedback">
                            {errors.title.message}
                          </div>
                        )}
                      </label>
                    </div>

                    <div
                      className={config.showProductType ? 'col-6' : 'col-12'}
                    >
                      <label className="form-label d-block">
                        類別 (Category)
                        <select
                          className="form-select rounded-pill"
                          {...register('category')}
                          disabled
                        >
                          <option value="fixed">主題Poke</option>
                          <option value="item">食材</option>
                          <option value="other">飲料、湯品</option>
                        </select>
                      </label>
                    </div>

                    {config.showProductType && (
                      <div className="col-6">
                        <label className="form-label d-block">
                          分類 (Product type){' '}
                          <span className="text-danger">*</span>
                          <select
                            className={`form-select rounded-pill ${errors.product_type ? 'is-invalid' : ''}`}
                            {...register('product_type', {
                              required: '請選擇分類',
                            })}
                          >
                            <option value="noChoice" disabled>
                              請選擇分類
                            </option>
                            {config.options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        {errors.product_type && (
                          <div className="invalid-feedback">
                            {errors.product_type.message}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="col-6">
                      <label className="form-label d-block">
                        售價 (Price) <span className="text-danger">*</span>
                        <input
                          type="number"
                          className={`form-control rounded-pill ${errors.price ? 'is-invalid' : ''}`}
                          {...register('price', {
                            required: '售價為必填欄位',
                            valueAsNumber: true,
                            min: { value: 0, message: '售價不能小於 0' },
                          })}
                        />
                      </label>
                      {errors.price && (
                        <div className="invalid-feedback">
                          {errors.price.message}
                        </div>
                      )}
                    </div>
                    <div className="col-6">
                      <label className="form-label d-block">
                        {config.gramsLabel}{' '}
                        <span className="text-danger">*</span>
                        <input
                          type="number"
                          className={`form-control rounded-pill ${errors.grams ? 'is-invalid' : ''}`}
                          {...register('grams', {
                            required: '份量/容量為必填欄位',
                          })}
                        />
                      </label>
                      {errors.grams && (
                        <div className="invalid-feedback">
                          {errors.grams.message}
                        </div>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label d-block">
                        描述 (Description){' '}
                        <span className="text-danger">*</span>
                        <textarea
                          className={`form-control rounded-3 mt-1 ${errors.description ? 'is-invalid' : ''}`}
                          rows="2"
                          {...register('description', {
                            required: '商品描述為必填欄位',
                          })}
                        ></textarea>
                        {errors.description && (
                          <div className="invalid-feedback">
                            {errors.description.message}
                          </div>
                        )}
                      </label>
                    </div>

                    {tabOptions.length > 0 && (
                      <div className="col-md-12 mb-3">
                        <label className="form-label d-block mb-2">
                          商品標籤 (Tab_collection)
                        </label>
                        <div className="d-flex flex-wrap gap-3">
                          {tabOptions.map((option) =>
                            renderTagCheckbox('tab_collection', option),
                          )}
                        </div>
                      </div>
                    )}

                    {includeOptions.length > 0 && (
                      <div className="col-md-12 mb-3">
                        <label className="form-label d-block mb-2">
                          忌口標籤 (Include_tags)
                        </label>
                        <div className="d-flex flex-wrap gap-3">
                          {includeOptions.map((option) =>
                            renderTagCheckbox('include_tags', option),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-7 mb-4 adm__glassbg rounded-4">
                  <h4 className="mb-5">營養標示 (Nutrition)</h4>
                  <div className="row g-3">
                    {Object.entries({
                      calories: '卡路里 (Calories)',
                      protein: '蛋白質 (Protein)',
                      fat: '脂肪 (Fat)',
                      carbs: '碳水化合物 (Carbs)',
                    }).map(([field, label]) => (
                      <div className="col-md-6" key={field}>
                        <label className="form-label d-block">
                          {label} <span className="text-danger">*</span>
                          <input
                            type="number"
                            className={`form-control rounded-pill ${errors.nutrition?.[field] ? 'is-invalid' : ''}`}
                            min="0"
                            {...register(`nutrition.${field}`, {
                              required: `${label} 為必填`,
                              valueAsNumber: true,
                              min: { value: 0, message: '數值不能小於 0' },
                            })}
                          />
                          {errors.nutrition?.[field] && (
                            <div className="invalid-feedback">
                              {errors.nutrition[field].message}
                            </div>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {config.showComplexFields && (
                  <div className="p-7 adm__glassbg rounded-4">
                    <h4 className="mb-5">內容配置</h4>

                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label d-block">
                          基底 (Base) <span className="text-danger">*</span>
                          <input
                            type="text"
                            className={`form-control rounded-pill ${errors.ingredients?.base ? 'is-invalid' : ''}`}
                            {...register('ingredients.base', {
                              required: '基底為必填欄位',
                            })}
                          />
                          {errors.ingredients?.base && (
                            <div className="invalid-feedback">
                              {errors.ingredients.base.message}
                            </div>
                          )}
                        </label>
                      </div>
                      {config.isOther ? (
                        ''
                      ) : (
                        <>
                          <div className="col-12">
                            <label className="form-label d-block">
                              主食 (Main) <span className="text-danger">*</span>
                              <input
                                type="text"
                                className={`form-control rounded-pill ${errors.ingredients?.main ? 'is-invalid' : ''}`}
                                {...register('ingredients.main', {
                                  required: '主食為必填欄位',
                                })}
                              />
                              {errors.ingredients?.main && (
                                <div className="invalid-feedback">
                                  {errors.ingredients.main.message}
                                </div>
                              )}
                            </label>
                          </div>
                          <div className="col-12">
                            <label className="form-label d-block">
                              配菜 (Side) <span className="text-danger">*</span>
                              <textarea
                                type="text"
                                className={`form-control rounded-3 mt-1 ${errors.ingredients?.side ? 'is-invalid' : ''}`}
                                rows="2"
                                {...register('ingredients.side', {
                                  required: '配菜為必填欄位',
                                })}
                              ></textarea>
                              {errors.ingredients?.side && (
                                <div className="invalid-feedback">
                                  {errors.ingredients.side.message}
                                </div>
                              )}
                            </label>
                          </div>
                          <div className="col-12">
                            <label className="form-label d-block">
                              醬料 (Source){' '}
                              <span className="text-danger">*</span>
                              <input
                                type="text"
                                className={`form-control rounded-pill ${errors.ingredients?.source ? 'is-invalid' : ''}`}
                                {...register('ingredients.source', {
                                  required: '醬料為必填欄位',
                                })}
                              />
                              {errors.ingredients?.source && (
                                <div className="invalid-feedback">
                                  {errors.ingredients.source.message}
                                </div>
                              )}
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="adm-product-modal-footer">
            <AdmButton
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              text={'取消'}
              color={'tertiary'}
              size={'lg'}
              className={'me-5'}
            />

            <AdmButton
              type="submit"
              text={mode === 'add' ? '新增' : '修改'}
              color={'secondary'}
              size={'lg'}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
