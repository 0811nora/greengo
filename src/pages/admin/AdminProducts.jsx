import { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';

import {
  getAdmProducts,
  postAdmNewProduct,
  putAdmSingleProduct,
  delAdmSingleProduct,
} from '../../api/ApiAdmin';

export default function AdminProducts() {
  const admProductsModal = useRef(null);
  const admProductsModalRef = useRef(null);
  const [productData, setProductData] = useState([]);
  const initialProductState = {
    title: '',
    category: 'fixed',
    product_type: '',
    description: '',
    price: '',
    origin_price: 0,
    is_enabled: 1,
    unit: '',
    grams: '',
    ingredients: {
      base: '',
      main: '',
      source: '',
      side: '',
    },
    nutrition: {
      calories: '',
      protein: '',
      fat: '',
      carbs: '',
    },
    content: {
      plan_type: 'balanced',
      base_limit: '',
      protein_limit: '',
      side_limit: '',
      sauce_limit: '',
    },
    tab_collection: [],
    include_tags: [],
    imageUrl: ' ',
  };
  const [newProductData, setNewProductData] = useState(initialProductState);
  const [modalMode, setModalMode] = useState('');
  const [preImageUrl, setPreImageUrl] = useState('請輸入網址後點選預覽圖片');
  const [currentTab, setCurrentTab] = useState('fixed');

  const handleInputChange = (e, stateType) => {
    const { name, value, type, checked, dataset } = e.target;
    const setter = stateType === 'auth' ? setFormData : setNewProductData;
    const group = dataset.group;

    let newValue = value;
    if (type === 'checkbox') {
      newValue = name === 'is_enabled' ? (checked ? 1 : 0) : checked;
    } else if (type === 'number') {
      newValue = value === '' ? 0 : Number(value);
    }

    setter((prevData) => {
      // 如果有分組 (例如：nutrition, ingredients)
      if (group) {
        return {
          ...prevData,
          [group]: {
            ...prevData[group],
            [name]: newValue,
          },
        };
      }
      // 如果是第一層 (例如：title, price)
      return {
        ...prevData,
        [name]: newValue,
      };
    });
  };

  const getProducts = async () => {
    try {
      const res = await getAdmProducts();
      console.log('取得產品：', res.data.products);
      setProductData(Object.values(res.data.products));
    } catch (error) {
      alert('取得失敗: ' + error.response.data.message);
    }
  };
  const filteredData = productData.filter(
    (product) => product.category === currentTab
  );

  useEffect(() => {
    getProducts();
    admProductsModal.current = new Modal(admProductsModalRef.current);
  }, []);

  //依據點選的tab判斷要渲染的內容
  const renderContent = () => {
    if (currentTab === 'fixed') {
      return (
        <table className="table mt-4 custom-table">
          <thead>
            <tr>
              <th width="80">狀態</th>
              <th width="100">圖片</th>
              <th>商品名稱</th>
              <th>標籤</th>
              <th>價格</th>
              <th>熱量(kcal)</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((product) => {
              return (
                <tr key={product.id}>
                  <td>
                    {product.is_enabled ? (
                      <span className="text-success">
                        <i className="bi bi-check-lg"></i>
                      </span>
                    ) : (
                      <span className="text-danger">
                        <i className="bi bi-x-lg"></i>
                      </span>
                    )}
                  </td>
                  <td>
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="rounded"
                      style={{
                        height: '40px',
                        width: '40px',
                        objectFit: 'cover',
                      }}
                    />
                  </td>
                  <td>
                    <div className="prod-title">{product.title}</div>
                  </td>
                  <td>
                    <span className="tag">人氣推薦</span>
                    <span className="tag">低脂低卡</span>
                    <span className="tag">多多蛋白</span>
                  </td>
                  <td>{product.price}</td>
                  <td>368 kcal</td>
                  <td>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm "
                        onClick={() => openProductModal('edit', product)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        type="button"
                        className="btn  btn-sm"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    if (currentTab === 'ingredients') {
      return (
        <>
          <div className="nav nav-pills mb-4">
            <div className="nav-item d-flex">
              <button className="nav-link active">全部</button>
              <button className="nav-link">基底 (Base)</button>
              <button className="nav-link">蛋白質 (Protein)</button>
              <button className="nav-link">配料 (Toppings)</button>
              <button className="nav-link">醬料 (Sauces)</button>
            </div>
          </div>

          <div>
            <table className="table mt-4 custom-table">
              <thead>
                <tr>
                  <th width="80">狀態</th>
                  <th>分類</th>
                  <th width="100">圖片</th>
                  <th>食材名稱</th>
                  <th className="num-cell">價格</th>
                  <th className="num-cell">份量 (g)</th>
                  <th className="num-cell">熱量 (kcal)</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((product) => {
                  return (
                    <tr key={product.id}>
                      <td>
                        {product.is_enabled ? (
                          <span className="text-success">
                            <i className="bi bi-check-lg"></i>
                          </span>
                        ) : (
                          <span className="text-danger">
                            <i className="bi bi-x-lg"></i>
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="tag">基底</span>
                      </td>
                      <td>
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="rounded"
                          style={{
                            height: '40px',
                            width: '40px',
                            objectFit: 'cover',
                          }}
                        />
                      </td>
                      <td>
                        <div className="prod-title">{product.title}</div>
                      </td>
                      <td className="num-cell">{product.price}</td>
                      <td className="num-cell">100g</td>
                      <td className="num-cell">111</td>
                      <td>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm "
                            onClick={() => openProductModal('edit', product)}
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            type="button"
                            className="btn  btn-sm"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    if (currentTab === 'item') {
      return (
        <>
          <div className="nav nav-pills mb-4">
            <div className="nav-item d-flex">
              <button className="nav-link active">全部</button>
              <button className="nav-link">飲料 (Beverages)</button>
              <button className="nav-link">湯品 (Soup)</button>
            </div>
          </div>

          <div>
            <table className="table mt-4 custom-table">
              <thead>
                <tr>
                  <th width="80">狀態</th>
                  <th>分類</th>
                  <th width="100">圖片</th>
                  <th>品項名稱</th>
                  <th className="num-cell">價格</th>
                  <th className="num-cell">容量 (ml)</th>
                  <th className="num-cell">熱量 (kcal)</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((product) => {
                  return (
                    <tr key={product.id}>
                      <td>
                        {product.is_enabled ? (
                          <span className="text-success">
                            <i className="bi bi-check-lg"></i>
                          </span>
                        ) : (
                          <span className="text-danger">
                            <i className="bi bi-x-lg"></i>
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="tag">飲料</span>
                      </td>
                      <td>
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="rounded"
                          style={{
                            height: '40px',
                            width: '40px',
                            objectFit: 'cover',
                          }}
                        />
                      </td>
                      <td>
                        <div className="prod-title">{product.title}</div>
                      </td>
                      <td className="num-cell">{product.price}</td>
                      <td className="num-cell">100g</td>
                      <td className="num-cell">111</td>
                      <td>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm "
                            onClick={() => openProductModal('edit', product)}
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            type="button"
                            className="btn  btn-sm"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      );
    }
  };

  const openProductModal = (mode, product = null) => {
    setModalMode(mode);
    if (mode === 'add') {
      setNewProductData(initialProductState);
    } else {
      setNewProductData(product);
    }
    admProductsModal.current.show();
  };

  const handleUpdateProduct = async () => {
    const processedContent = {
      ...newProductData,
      tab_collection:
        typeof newProductData.tab_collection === 'string'
          ? newProductData.tab_collection
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag !== '')
          : newProductData.tab_collection,
      is_enabled: newProductData.is_enabled ? 1 : 0,
    };

    let apiCall;
    if (modalMode === 'edit') {
      const id = newProductData.id;
      apiCall = putAdmSingleProduct(id, processedContent);
    } else {
      apiCall = postAdmNewProduct(processedContent);
    }

    try {
      const res = await apiCall;
      const message = modalMode === 'add' ? '新增成功' : '修改成功';
      alert(message);

      admProductsModal.current.hide();
      setNewProductData(initialProductState);
      getProducts();
    } catch (error) {
      alert('新增失敗: ' + error.response.data.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await delAdmSingleProduct(id);
      alert('刪除成功');
      getProducts();
    } catch (error) {
      alert('新增失敗: ' + error.response.data.message);
    }
  };

  return (
    <>
      <div>
        <div className="container">
          <div className="d-flex justify-content-between  align-items-center mt-4">
            <h1 className="h3">商品管理</h1>
            <button
              className="btn btn-main primary-bg rounded-pill"
              onClick={() => openProductModal('add')}
            >
              建立新的產品
              <i className="bi bi-plus-lg ms-1"></i>
            </button>
          </div>

          <ul className="nav nav-pills mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${currentTab === 'fixed' ? 'active' : ''}`}
                onClick={() => setCurrentTab('fixed')}
              >
                主題Poke
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  currentTab === 'ingredients' ? 'active' : ''
                }`}
                onClick={() => setCurrentTab('ingredients')}
              >
                食材管理
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${currentTab === 'item' ? 'active' : ''}`}
                onClick={() => setCurrentTab('item')}
              >
                飲料湯品管理
              </button>
            </li>
          </ul>
          {renderContent()}
        </div>
      </div>

      <div
        id="productModal"
        className="modal fade"
        tabIndex="-1"
        ref={admProductsModalRef}
      >
        <div className="modal-dialog modal-xl ">
          <div className="modal-content border-0 custom-modal text-start">
            <div className="modal-header text-white">
              <h5 id="productModalLabel" className="modal-title">
                <span>{modalMode === 'add' ? '新增產品' : '編輯產品'}</span>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body custom-modal-content">
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        name="imageUrl"
                        type="text"
                        className="form-control rounded-pill"
                        placeholder="請輸入圖片連結"
                        value={newProductData.imageUrl}
                        onChange={(e) => handleInputChange(e, 'product')}
                      />
                    </div>
                  </div>
                  {/* <div className="d-flex mb-3">
                    <button
                      className="btn btn-main primary-bg rounded-pill w-100 me-2"
                      onClick={() => setPreImageUrl(newProductData.imageUrl)}
                    >
                      預覽圖片
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-main border-white rounded-pill w-100"
                      onClick={() => setPreImageUrl(null)}
                    >
                      刪除圖片
                    </button>
                  </div> */}
                  {modalMode === 'add' ? (
                    <img src={preImageUrl} alt="" />
                  ) : (
                    <img src={newProductData.imageUrl} alt="" />
                  )}
                </div>
                <div className="col-sm-8">
                  {/* --- 基本資訊 --- */}
                  <h4 className="mb-3">基本資訊</h4>
                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <label className="form-label d-block">
                        商品名稱 (Title)
                        <input
                          type="text"
                          name="title"
                          className="form-control rounded-pill mt-1"
                          placeholder="請輸入標題"
                          value={newProductData.title}
                          onChange={(e) => handleInputChange(e, 'product')}
                        />
                      </label>
                    </div>
                    <div className="col-4">
                      <label className="form-label d-block">
                        類別 (Category)
                        <select
                          name="category"
                          className="form-select rounded-pill mt-1"
                          defaultValue="fixed"
                        >
                          <option value="fixed">主題Poke</option>
                          <option value="ingredients">食材</option>
                          <option value="item">飲料湯品管理</option>
                        </select>
                      </label>
                    </div>
                    <div className="col-4">
                      <label className="form-label d-block">
                        售價 (Price)
                        <input
                          type="number"
                          name="price"
                          className="form-control rounded-pill mt-1"
                          min="0"
                          placeholder="請輸入售價"
                          value={newProductData.price}
                          onChange={(e) => handleInputChange(e, 'product')}
                        />
                      </label>
                    </div>
                    <div className="col-4">
                      <label className="form-label d-block">
                        單位
                        <input
                          type="text"
                          name="unit"
                          className="form-control rounded-pill mt-1"
                          placeholder="請輸入單位"
                          value={newProductData.unit}
                          onChange={(e) => handleInputChange(e, 'product')}
                        />
                      </label>
                    </div>
                    <div className="col-12">
                      <label className="form-label d-block">
                        商品描述
                        <textarea
                          rows="2"
                          className="form-control rounded-3 mt-1"
                          name="description"
                          placeholder="請輸入產品描述"
                          value={newProductData.description}
                          onChange={(e) => handleInputChange(e, 'product')}
                        ></textarea>
                      </label>
                    </div>
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <label className="form-check-label d-flex align-items-center gap-2">
                          <input
                            className="form-check-input ms-0"
                            type="checkbox"
                            role="switch"
                            name="is_enabled"
                            defaultChecked={!!newProductData.is_enabled}
                            onChange={(e) => handleInputChange(e, 'product')}
                          />
                          是否啟用
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* --- 營養標示部分 --- */}
                  <div className="p-3 mb-4 bg-light rounded">
                    <h4 className="mb-3">營養標示 (Nutrition)</h4>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label d-block">
                          卡路里
                          <input
                            name="calories"
                            data-group="nutrition"
                            type="number"
                            className="form-control rounded-pill mt-1"
                            min="0"
                            value={newProductData.nutrition.calories}
                            onChange={(e) => handleInputChange(e, 'product')}
                          />
                        </label>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label d-block">
                          蛋白質 (g)
                          <input
                            name="protein"
                            data-group="nutrition"
                            type="number"
                            className="form-control rounded-pill mt-1"
                            min="0"
                            value={newProductData.nutrition.protein}
                            onChange={(e) => handleInputChange(e, 'product')}
                          />
                        </label>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label d-block">
                          脂肪 (g)
                          <input
                            name="fat"
                            data-group="nutrition"
                            type="number"
                            className="form-control rounded-pill mt-1"
                            min="0"
                            value={newProductData.nutrition.fat}
                            onChange={(e) => handleInputChange(e, 'product')}
                          />
                        </label>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label d-block">
                          碳水 (g)
                          <input
                            name="carbs"
                            data-group="nutrition"
                            type="number"
                            className="form-control rounded-pill mt-1"
                            min="0"
                            value={newProductData.nutrition.carbs}
                            onChange={(e) => handleInputChange(e, 'product')}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* --- 內容配置部分 --- */}
                  <div className="mb-4">
                    <h4 className="mb-3">內容配置 (Content & Limits)</h4>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <label className="form-label d-block">
                          方案類型 (Plan Type)
                          <select
                            data-group="content"
                            name="plan_type"
                            className="form-select rounded-pill mt-1"
                            defaultValue="balanced"
                          >
                            <option value="balanced">均衡 (Balanced)</option>
                            <option value="light">輕食 (Light)</option>
                            <option value="highProtein">
                              高蛋白 (High Protein)
                            </option>
                          </select>
                        </label>
                      </div>
                      <div className="col-md-3">
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
                      </div>
                      <div className="col-md-12">
                        <label className="form-label d-block">
                          標籤 (Tags)
                          <input
                            name="tab_collection"
                            type="text"
                            className="form-control rounded-pill mt-1"
                            defaultValue='["多多蛋白","低脂低卡","人氣推薦"]'
                            value={newProductData.tab_collection}
                            onChange={(e) => handleInputChange(e, 'product')}
                          />
                        </label>
                      </div>
                      <div className="col-12">
                        <label className="form-label d-block">
                          基底 (Base)
                          <input
                            name="base"
                            data-group="ingredients"
                            type="text"
                            className="form-control rounded-pill mt-1"
                            defaultValue="生菜"
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
                            defaultValue="水煮蛋、雞胸肉 x 2"
                            value={newProductData.ingredients.main}
                            onChange={(e) => handleInputChange(e, 'product')}
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
                            defaultValue="小黃瓜、番茄、洋蔥、彩椒、醃黃瓜"
                            value={newProductData.ingredients.side}
                            onChange={(e) => handleInputChange(e, 'product')}
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
                            value={newProductData.ingredients.source}
                            onChange={(e) => handleInputChange(e, 'product')}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <hr />
                  <hr />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary btn-main rounded-pill"
                data-bs-dismiss="modal"
                onClick={() => setPreImageUrl(null)}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-main primary-bg rounded-pill"
                onClick={handleUpdateProduct}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
