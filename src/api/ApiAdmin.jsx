import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const apiPath = import.meta.env.VITE_API_PATH;

export { apiUrl, apiPath };

// 提醒：登入時拿到token要設定全域權限，這樣管理者API可以不用帶header
// axios.defaults.headers.common['Authorization'] = res.data.token;




// ********** [ 登入管理 ] **********

// [POST] 管理者登入
export const admSignin = (data) =>{
    return axios.post(`${apiUrl}/admin/signin`,data);
}

// [POST] - 驗證管理者登入狀態
export const admUserCheck = () =>{
    return axios.post(`${apiUrl}/api/user/check`,{});
}

// [POST] - 管理者登出
export const admUserLogout = () =>{
    return axios.post(`${apiUrl}/logout`,{});
}






// ********** [ 產品管理 ] **********

// [GET] - 取得所有產品列表
export const getAdmProducts = () =>{
    return axios.get(`${apiUrl}/api/${apiPath}/admin/products/all`);
};


// [GET] - 取得單一類別產品列表
export const getAdmProductsCategory = (category, page = 1) => {
    return axios.get(`${apiUrl}/api/${apiPath}/admin/products`, {
        params: {
            category, 
            page,    
        }
    });
};

// [POST] - 新增單一產品
export const postAdmNewProduct = (content) =>{
    return axios.post(`${apiUrl}/api/${apiPath}/admin/product`, {
        data: content
    });
};

// [PUT] - 修改單一產品
export const putAdmSingleProduct = (id,content) =>{
    return axios.put(`${apiUrl}/api/${apiPath}/admin/product/${id}`, {
        data: content
    });
};

// [DELETE] - 刪除單一產品
export const delAdmSingleProduct = (id) =>{
    return axios.delete(`${apiUrl}/api/${apiPath}/admin/product/${id}`);
};






// ********** [ 訂單管理 ] **********


// [GET] - 取得所有訂單列表
export const getAdmOrders = (page = 1) => {
    return axios.get(`${apiUrl}/api/${apiPath}/admin/orders`, {
        params: {page}
    });
};

// [PUT] - 修改單一訂單
export const putAdmSingleOrder = (id, content) => {
    return axios.put(`${apiUrl}/api/${apiPath}/admin/order/${id}`, {
        data: content
    });
};

// [DELETE] - 刪除單一訂單
export const delAdmSingleOrder = (id) => {
    return axios.delete(`${apiUrl}/api/${apiPath}/admin/order/${id}`);
};

// [DELETE] - 刪除全部訂單
export const delAdmAllOrders = () => {
    return axios.delete(`${apiUrl}/api/${apiPath}/admin/orders/all`);
};






// ********** [ 優惠券管理 ] **********


// [GET] - 取得優惠券列表
export const getAdminCoupons = (page = 1) => {
    return axios.get(`${apiUrl}/api/${apiPath}/admin/coupons`, {
        params: {page}
    });
};

// [POST] - 新增單一優惠券
export const postAdmNewCoupon = (content) => {
    return axios.post(`${apiUrl}/api/${apiPath}/admin/coupon`, {
        data: content
    });
};

// [PUT] - 修改單一優惠券
export const putAdmSingleCoupon = (id, content) => {
    return axios.put(`${apiUrl}/api/${apiPath}/admin/coupon/${id}`, {
        data: content
    });
};

// [DELETE] - 刪除單一優惠券
export const delAdmSingleCoupon = (id) => {
    return axios.delete(`${apiUrl}/api/${apiPath}/admin/coupon/${id}`);
};




// ********** [ 上傳圖片 ] **********
export const upload = (content) =>{
    return axios.post(`${apiUrl}/api/${apiPath}/admin/upload`, content);
};



// ********** [ 文章管理 ] **********

// [GET] - 後台取得所有文章列表
export const getAdmArticles = (page = 1) =>{
    return axios.get(`${apiUrl}/api/${apiPath}/admin/articles`,{
        params: {
            page
        },
    });
}



// [GET] - 後台取得單一文章
export const getAdmSingleArticle = (id) =>{
    return axios.get(`${apiUrl}/api/${apiPath}/admin/article/${id}`);
}



// [POST] - 新增文章
export const postAdminAddArticle = (content) => {
    return axios.post(`${apiUrl}/api/${apiPath}/admin/article`, {
        data: content
    });
};

// [PUT] - 修改文章
export const putAdmEditArticle = (id, content) => {
    return axios.put(`${apiUrl}/api/${apiPath}/admin/article/${id}`, {
        data: content
    });
};

// [DELETE] - 刪除文章
export const delAdmSingleArticle = (id) => {
    return axios.delete(`${apiUrl}/api/${apiPath}/admin/article/${id}`);
};