import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const apiPath = import.meta.env.VITE_API_PATH;

export { apiUrl, apiPath };





// ********** [ 產品 ] **********


// [GET] - 取得所有產品列表
export const getAllProducts = () => {
    return axios.get(`${apiUrl}/api/${apiPath}/products/all`);
};


// [GET] - 取得產品列表 (分頁 or 分類）
export const getProducts = (page = 1, category = "") => {
    return axios.get(`${apiUrl}/api/${apiPath}/products`, {
        params: { 
            page,
            category 
        }
    });
};


// [GET] - 取得單一產品細節
export const getSingleProduct = (id) => {
    return axios.get(`${apiUrl}/api/${apiPath}/product/${id}`);
};








// ********** [ 購物車 ] **********


// [GET] - 取得購物車列表
export const getCart = () => {
    return axios.get(`${apiUrl}/api/${apiPath}/cart`);
};

// [POST] - 加入購物車
export const postAddToCart = (data) => {
    return axios.post(`${apiUrl}/api/${apiPath}/cart`, {
        data: data
    });
};

// [PUT] - 修改購物車產品 
export const putCartItem = (id, data) => {
    return axios.put(`${apiUrl}/api/${apiPath}/cart/${id}`, {
        data: data
    });
};

// [DELETE] - 刪除購物車單一項目
export const deleteCartItem = (id) => {
    return axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`);
};

// [DELETE] - 刪除全部購物車清單
export const deleteAllCart = () => {
    return axios.delete(`${apiUrl}/api/${apiPath}/carts`);
};







// ********** [ 優惠券 ] **********

// [POST] - 套用優惠券
export const postCoupon = (code) => {
    return axios.post(`${apiUrl}/api/${apiPath}/coupon`, {
        data: { code }
    });
};






// ********** [ 結帳 ] **********


// [POST] - 送出訂單
export const postOrder = (data) => {
    return axios.post(`${apiUrl}/api/${apiPath}/order`, {
        data: data
    });
};

// [GET] - 取得所有訂單
export const getOrders = (page = 1) => {
    return axios.get(`${apiUrl}/api/${apiPath}/orders`, {
        params: { page }
    });
};

// [GET] - 取得單一訂單
export const getOrder = (orderId) => {
    return axios.get(`${apiUrl}/api/${apiPath}/order/${orderId}`);
};





// ********** [ 付款 ] **********

// [POST] - 確認付款
export const postPay = (orderId) => {
    return axios.post(`${apiUrl}/api/${apiPath}/pay/${orderId}`);
};






// ********** [ 文章 ] **********


// [GET] - 取得文章列表 (分頁)
export const getArticles = (page = 1) => {
    return axios.get(`${apiUrl}/api/${apiPath}/articles`, {
        params: { page }
    });
};

// [GET] - 取得單一文章細節
export const getSingleArticle = (id) => {
    return axios.get(`${apiUrl}/api/${apiPath}/article/${id}`);
};