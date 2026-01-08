import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const apiPath = import.meta.env.VITE_API_PATH;

export { apiUrl, apiPath };


//----- Admin 後台管理者 ------

// [POST] 管理者登入
export const admSignin = (data) =>{
    return axios.post(`${apiUrl}/admin/signin`,data);
}



//--文章管理 --

// [GET] 取得所有文章列表
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

// [GET] 取得單一文章列表
export const getSingleArticle = (token,id) =>{
    return axios.get(`${apiUrl}/api/${apiPath}/admin/article/${id}`,{
        headers: {
            'Authorization': token
        }
    });
}