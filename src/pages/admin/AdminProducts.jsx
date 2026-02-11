import { useState, useEffect, useRef } from 'react';
import AdmMainButton from '../../components/admin/common/AdmMainButton';
import AdmButton from '../../components/admin/common/AdmButton';
import AdmProductModal from '../../components/admin/products/AdmProductModal';
import { notify } from '../../components/Notify';

import {
  getAdmProducts,
  postAdmNewProduct,
  putAdmSingleProduct,
  delAdmSingleProduct,
} from '../../api/ApiAdmin';

export default function AdminProducts() {
  const [productData, setProductData] = useState([]);
  const initialPokeProductState = {
    title: '',
    category: '',
    product_type: 'noChoice',
    description: '',
    price: '',
    origin_price: 0,
    is_enabled: 1,
    is_stock: 1,
    unit: '份',
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
    tab_collection: [],
    include_tags: [],
    imageUrl: '',
  };
  const [newProductData, setNewProductData] = useState(initialPokeProductState);
  const [modalMode, setModalMode] = useState('');
  const [preImageUrl, setPreImageUrl] = useState(null);
  const [currentTab, setCurrentTab] = useState('fixed');
  const [subTab, setSubTab] = useState('all');
  const [pokeModalOpen, setPokeModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [otherModalOpen, setOtherModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [delProductId, setDelProductId] = useState('');

  const PRODUCT_TYPE_LABELS = {
    base: '基底',
    protein: '蛋白質',
    side: '配菜',
    sauce: '醬汁',
    soup: '湯品',
    drinks: '飲料',
  };
  const TYPE_COLORS = {
    protein: 'bg-danger-subtle text-danger',
    base: 'bg-success-subtle text-success',
    side: 'bg-warning-subtle text-dark',
    sauce: 'bg-orange-100 text-brown-300',
    soup: 'bg-primary-subtle text-primary',
    drinks: 'bg-secondary-subtle text-secondary',
  };

  const handleInputChange = (e, stateType) => {
    const { name, value, type, checked, dataset } = e.target;
    const setter = stateType === 'auth' ? setFormData : setNewProductData;
    const group = dataset.group;

    if (name === 'imageUrl') {
      setPreImageUrl(value);
    }

    let newValue = value;

    if (type === 'checkbox' && !Array.isArray(value)) {
      newValue = name === 'is_enabled' ? (checked ? 1 : 0) : checked;
    } else if (type === 'number') {
      newValue = value === '' ? 0 : Number(value);
    }

    setter((prevData) => {
      if (group) {
        return {
          ...prevData,
          [group]: { ...prevData[group], [name]: newValue },
        };
      }
      return { ...prevData, [name]: newValue };
    });
  };

  //取得資料
  const getProducts = async () => {
    try {
      const res = await getAdmProducts();
      // console.log('取得產品：', res.data.products);
      setProductData(Object.values(res.data.products));
    } catch (error) {
      notify('error', `取得產品失敗:${error.response.data.message}`);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  //依據Tab分類
  const filteredData = productData.filter((product) => {
    // 1. 先過濾大分類 (fixed / item / other)
    if (product.category !== currentTab) return false;

    // 2. 如果子分類不是 'all'，則過濾 product_type
    if (subTab !== 'all') {
      return product.product_type === subTab;
    }

    return true;
  });

  // 切換大 Tab
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setSubTab('all');
  };

  //依據點選的tab判斷要渲染的內容
  const renderContent = () => {
    // 食材的分項
    const itemSubTabs = [
      { label: '全部', value: 'all' },
      { label: '基底 (Base)', value: 'base' },
      { label: '蛋白質 (Protein)', value: 'protein' },
      { label: '配菜 (Side)', value: 'side' },
      { label: '醬汁 (Sauce)', value: 'sauce' },
    ];

    // 其他（飲料湯品）的分項
    const otherSubTabs = [
      { label: '全部', value: 'all' },
      { label: '湯品 (Soup)', value: 'soup' },
      { label: '飲料 (Drinks)', value: 'drinks' },
    ];

    // 商品標籤
    const productTagOptions = [
      { label: '多多蛋白', value: 'highProtein' },
      { label: '低脂低卡', value: 'lowFat' },
      { label: '人氣推薦', value: 'popular' },
      { label: '新鮮蔬食', value: 'veg' },
    ];

    //固定餐
    if (currentTab === 'fixed') {
      return (
        <>
          <div className="adm-pro-table-layout mt-4 adm__glassbg">
            <table className="table adm-pro-table mb-0">
              <thead>
                <tr>
                  <th width="80">狀態</th>
                  <th width="100">圖片</th>
                  <th>商品名稱</th>
                  <th>商品標籤</th>
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
                        {product.tab_collection.map((tag, index) => {
                          const tagOption = productTagOptions.find(
                            (opt) => opt.value === tag,
                          );
                          const tagName = tagOption ? tagOption.label : tag;
                          return (
                            <span
                              key={index}
                              className="badge small fw-medium px-3 py-3 rounded-pill  bg-primary-100 me-2 text-primary  "
                            >
                              {tagName}
                            </span>
                          );
                        })}
                      </td>
                      <td>{product.price}</td>
                      <td>{product.nutrition.calories}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm rounded-pill"
                          onClick={() =>
                            openProductModal('edit', currentTab, product)
                          }
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm rounded-pill"
                          onClick={() => openConfirmModal(product.id)}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
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

    //食材
    if (currentTab === 'item') {
      return (
        <>
          <div className="adm-pro-table-layout mt-4 adm__glassbg">
            <div className="nav mt-3 mb-8">
              <div className="nav-item d-flex mx-auto rounded-pill adm__glassbg p-2">
                {itemSubTabs.map((tab) => (
                  <button
                    key={tab.value}
                    className={`nav-link rounded-pill mx-2 ${subTab === tab.value ? 'active' : ''}`}
                    onClick={() => setSubTab(tab.value)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <table className="table mt-4 adm-pro-table">
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
                          <span
                            className={`badge rounded-pill px-4 py-3 fw-medium ${TYPE_COLORS[product.product_type] || 'bg-light text-dark'}`}
                          >
                            {PRODUCT_TYPE_LABELS[product.product_type] ||
                              product.product_type}
                          </span>
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
                        <td className="num-cell">{product.grams}</td>
                        <td className="num-cell">
                          {product.nutrition.calories}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm rounded-pill"
                            onClick={() =>
                              openProductModal('edit', currentTab, product)
                            }
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm rounded-pill"
                            onClick={() => openConfirmModal(product.id)}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    }

    //飲料、湯品
    if (currentTab === 'other') {
      return (
        <>
          <div className="adm-pro-table-layout mt-4 adm__glassbg">
            <div className="nav mt-3 mb-8">
              <div className="nav-item d-flex mx-auto rounded-pill adm__glassbg p-2">
                {otherSubTabs.map((tab) => (
                  <button
                    key={tab.value}
                    className={`nav-link rounded-pill mx-2 ${subTab === tab.value ? 'active' : ''}`}
                    onClick={() => setSubTab(tab.value)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <table className="table mt-4 adm-pro-table">
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
                          <span
                            className={`badge rounded-pill  px-4 py-3 fw-medium ${TYPE_COLORS[product.product_type] || 'bg-light text-dark'}`}
                          >
                            {PRODUCT_TYPE_LABELS[product.product_type] ||
                              product.product_type}
                          </span>
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
                        <td className="num-cell">{product.grams}</td>
                        <td className="num-cell">
                          {product.nutrition.calories}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm rounded-pill"
                            onClick={() =>
                              openProductModal('edit', currentTab, product)
                            }
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm rounded-pill"
                            onClick={() => openConfirmModal(product.id)}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    }
  };

  const openProductModal = (mode, currentTab, product = null) => {
    setModalMode(mode);
    if (mode === 'add') {
      let initialState = {};
      if (currentTab === 'fixed') {
        initialState = {
          ...initialPokeProductState,
          category: 'fixed',
          product_type: 'set',
        };
      } else if (currentTab === 'item') {
        initialState = { ...initialPokeProductState, category: 'item' };
      } else {
        initialState = { ...initialPokeProductState, category: 'other' };
      }
      setNewProductData(initialState);
    } else {
      setNewProductData(product);
    }
    toggleModal(currentTab);
  };

  const toggleModal = (currentTab) => {
    if (currentTab === 'fixed') {
      setPokeModalOpen(!pokeModalOpen);
      setPreImageUrl('');
    } else if (currentTab === 'item') {
      setItemModalOpen(!itemModalOpen);
      setPreImageUrl('');
    } else {
      setOtherModalOpen(!otherModalOpen);
      setPreImageUrl('');
    }
  };

  // 修改為接收參數
  const handleUpdateProduct = async (dataFromForm) => {
    const processedContent = {
      ...dataFromForm,
      tab_collection: Array.isArray(dataFromForm.tab_collection)
        ? dataFromForm.tab_collection
        : [],
      is_enabled: dataFromForm.is_enabled ? 1 : 0,
      is_stock: dataFromForm.is_stock ? 1 : 0,
    };

    let apiCall;
    if (modalMode === 'edit') {
      const id = dataFromForm.id;
      apiCall = putAdmSingleProduct(id, processedContent);
    } else {
      apiCall = postAdmNewProduct(processedContent);
    }

    try {
      const res = await apiCall;
      const message = modalMode === 'add' ? '新增成功' : '修改成功';
      notify('success', message);
      toggleModal(currentTab);
      setNewProductData(initialPokeProductState);
      getProducts();
    } catch (error) {
      const errorMsg = error.response?.data?.message || '未知錯誤';
      notify('error', `操作失敗: ${errorMsg}`);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await delAdmSingleProduct(id);
      notify('success', '刪除成功');
      getProducts();
      setConfirmModalOpen(false);
    } catch (error) {
      notify('error', `刪除產品失敗:${error.response.data.message}`);
    }
  };

  const openConfirmModal = (id) => {
    setConfirmModalOpen(true);
    setDelProductId(id);
  };

  return (
    <>
      <div className="adm-product-page">
        <div className="container py-5">
          <h1 className="fs-4 px-3 fw-bold">商品管理</h1>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <button
                  className={`nav-link mx-2 ${currentTab === 'fixed' ? 'active' : ''}`}
                  onClick={() => handleTabChange('fixed')}
                >
                  主題Poke
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link mx-2 ${currentTab === 'item' ? 'active' : ''}`}
                  onClick={() => handleTabChange('item')}
                >
                  食材管理
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link mx-2 ${currentTab === 'other' ? 'active' : ''}`}
                  onClick={() => handleTabChange('other')}
                >
                  飲料湯品管理
                </button>
              </li>
            </ul>
            <AdmButton
              onClick={() => openProductModal('add', currentTab)}
              size={'md'}
            >
              建立新的產品 <i className="bi bi-plus-lg ms-1"></i>
            </AdmButton>
          </div>

          {renderContent()}
        </div>

        <AdmProductModal
          isOpen={pokeModalOpen || itemModalOpen || otherModalOpen}
          mode={modalMode}
          data={newProductData}
          onChange={handleInputChange}
          onClose={() => toggleModal(currentTab)}
          onConfirm={handleUpdateProduct}
        />

        {confirmModalOpen && (
          <div className="adm-product-modal-overlay">
            <div className="adm-product-confirmModal-content adm__glassbg">
              <div className="text-center">
                <i className="bi bi-trash-fill fs-1"></i>
                <p className="fs-6 px-5 py-8">確認要刪除此產品嗎？</p>
              </div>
              <div className="d-flex pt-4">
                <AdmButton
                  onClick={() => setConfirmModalOpen(false)}
                  text={'取消'}
                  color={'tertiary'}
                  size={'md'}
                  className={'me-5 flex-fill'}
                />

                <AdmButton
                  onClick={() => deleteProduct(delProductId)}
                  text={'確認'}
                  color={'secondary'}
                  size={'md'}
                  className="flex-fill"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
