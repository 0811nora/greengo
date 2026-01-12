import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const apiPath = import.meta.env.VITE_API_PATH;

export { apiUrl, apiPath };

// 提醒：登入時拿到token要設定全域權限，這樣管理者API可以不用帶header
// axios.defaults.headers.common['Authorization'] = res.data.token;


//----- Admin 後台管理者 ------

// [POST] 管理者登入
export const admSignin = (data) =>{
    return axios.post(`${apiUrl}/admin/signin`,data);
}

// [POST] - 驗證管理者登入狀態
export const userCheck = () =>{
    return axios.post(`${apiUrl}/api/user/check`,{});
}

// [POST] - 管理者登出
export const userLogout = () =>{
    return axios.post(`${apiUrl}/logout`,{});
}

//--產品管理 --

// [GET] - 後台取得所有產品列表
export const getProducts = () =>{
    return axios.get(`${apiUrl}/api/${path}/admin/products/all`);
};

// [POST] - 後台新增單一產品
export const postNewProduct = (content) =>{
    return axios.post(`${apiUrl}/api/${path}/admin/product`, {
        data: content
    });
};

// [PUT] - 後台修改單一產品
export const putSingleProduct = (id,content) =>{
    return axios.put(`${apiUrl}/api/${path}/admin/product/${id}`, {
        data: content
    });
};

// [DELETE] - 後台刪除單一產品
export const delSingleProduct = (id) =>{
    return axios.delete(`${apiUrl}/api/${path}/admin/product/${id}`);
};

//--文章管理 --

// [GET] - 後台取得所有文章列表
export const getArticles = (token,page = 1) =>{
    return axios.get(`${apiUrl}/api/${apiPath}/admin/articles`,{
        params: {
            page
        },
        headers: {
            'Authorization': token
        }
    });
}

// [GET] - 後台取得單一文章列表
export const getSingleArticle = (token,id) =>{
    return axios.get(`${apiUrl}/api/${apiPath}/admin/article/${id}`,{
        headers: {
            'Authorization': token
        }
    });
}