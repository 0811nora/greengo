import { useEffect, useState ,useRef, } from "react"
import { getAdmArticles , getAdmSingleArticle } from "../../api/ApiAdmin";
import { Modal } from 'bootstrap'; 
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { getAdmProductsCategory } from "../../api/ApiAdmin";



export default function AdminBlog() {
    

    const detailModal = useRef(null);
    const detailModalRef = useRef(null);
    const [ articleList , setArticleList ] = useState();
    const [ isEdit , setIsEdit ] = useState(false);
    const [ mode , setMode ] = useState("");
    const [ tempArticle , setTempArticle ] = useState("")
    const [ content, setContent ] = useState("");
    const [ singleDetail , setSingleDetail ] = useState({});
    // const [ articleData , setArticleData ] = useState({})

    const availableTags = ["減脂", "增肌", "飲食", "高蛋白", "新手教學"];


    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5 ,6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            
            [
                { 'color': [] }, 
                { 'background': [] }
            ], 
            
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    // 網頁初始化
    useEffect(()=>{

        detailModal.current = new Modal(detailModalRef.current);
        const getArticle = async () => {
            try{
                const res = await getAdmArticles()
                console.log(res)
                setArticleList(res.data.articles);

            }catch(err){
                console.log(err)
            }
        }
        getArticle();
    },[])

    // 取得單一文章資料
    const getOneArticle = async (id) => {
        try{
            const res = await  getAdmSingleArticle(id);
            setSingleDetail(res.data.article)
            setContent(res.data.article.content)
            
        }catch(err){
            console.log(err)
        }
    }
    
    // 為了看log
    useEffect(()=>{
        console.log(singleDetail)
    },[singleDetail])


    const openCreateModal = () => {
        setMode('create'); 
        setIsEdit(true);   
        setSingleDetail({      
            title: '',
            image: '',
            tag: [],
            create_at: Math.floor(Date.now() / 1000),
            description: '',
            content: '',
            isPublic: false,
            author: ''
        });
        setContent("")
        detailModal.current.show();
    };

    const openDetailModal = (id) => {
        setMode('edit');   
        setIsEdit(false);  
        getOneArticle(id)
        detailModal.current.show();
    };



    const timeChange = (time) =>{
        const date = new Date(time * (String(time).length === 10 ? 1000 : 1));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    const handleEditorChange = (value) => {
        setContent(value);
    };



    return (<>

    <main className="adm-blog">
        <div className="container py-3">
            <h1 className="fs-4 p-3">文章管理</h1>
            
            <div className="card my-3 p-4" style={{borderRadius:"28px"}}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fs-6 mb-0">文章列表</h3>
                    <div>
                        <button type="button" className="btn btn-primary text-white" 
                            style={{borderRadius:"28px"}} 
                            onClick={openCreateModal}
                        ><i className="bi bi-plus-lg me-1"></i>新增文章</button>
                    </div>
                </div>
                <div>
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th >建立時間</th>
                                <th >標題</th>
                                <th >狀態</th>
                                <th >作者</th>
                                <th >分類</th>
                                <th >操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articleList?.map((item)=>(
                                <tr key={item.id}>
                                    <td>{timeChange(item.create_at)}</td>
                                    <td className="text-truncate" style={{maxWidth: "250px"}}>{item.title}</td>
                                    <td>
                                        {item.isPublic
                                            ? <span className="badge bg-success">已發佈</span>
                                            : <span className="badge bg-secondary ">草稿</span>
                                        }
                                    </td>
                                    <td>{item.author}</td>
                                    <td className="">{item?.tag?.map((i) =>(
                                        <span className="p-1 m-1 text-nowrap lh" key={i} style={{
                                            backgroundColor:"#C5D89D",
                                            borderRadius:"10px"
                                            }}>{i}</span>
                                        ))}
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-accent-200" onClick={()=>openDetailModal(item.id)}>查看</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                

                <div className="modal fade" ref={detailModalRef} tabIndex="-1" >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" style={{ maxWidth: '900px', width: '95%' }}>
                        <div className="modal-content border-0 shadow-lg">
                            
                            {/* 1. Banner (縮短高度，減少佔用) */}
                            <div className="position-relative" style={{ height: '150px' }}>
                                <img 
                                    /* 這裡判斷：如果有圖片就用圖片，沒圖片就用 No Image 預設網址 */
                                    src={singleDetail.image || "https://placehold.co/800x200/eeeeee/999999?text=No+Image"} 
                                    className="w-100 h-100 object-fit-cover rounded-top" 
                                    alt="Cover" 
                                />
                                
                                {isEdit && (
                                    <div className="position-absolute bottom-0 start-0 w-100 p-2 bg-dark bg-opacity-50">
                                        <div className="input-group input-group-sm container">
                                            <span className="input-group-text bg-transparent text-white border-secondary">圖片連結</span>
                                            <input 
                                                type="text" 
                                                className="form-control bg-transparent text-white border-secondary" 
                                                defaultValue={singleDetail.image} 
                                                placeholder="請輸入圖片網址..."
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="modal-body p-0">
                                
                                {/* 2. 灰色資訊列：位置調整後 */}
                                <div className="bg-light border-bottom px-4 py-2 d-flex justify-content-between align-items-center">
                                    {/* 左側：現在放發佈狀態 */}
                                    <div className="d-flex align-items-center">
                                        {isEdit ? (
                                            <div className="form-check form-switch mb-0">
                                                <input className="form-check-input" type="checkbox" role="switch" id="isPublic" defaultChecked={singleDetail.isPublic} />
                                                <label className="form-check-label small text-muted" htmlFor="isPublic">公開發佈</label>
                                            </div>
                                        ) : (
                                            singleDetail.isPublic ? 
                                                <span className="badge rounded-pill text-white bg-success">已公開</span> : 
                                                <span className="badge rounded-pill text-white bg-secondary">草稿</span>
                                        )}
                                    </div>

                                    {/* 右側：作者與日期組合 */}
                                    <div className="d-flex align-items-center gap-3 text-muted small">
                                        {isEdit ? (
                                            <>
                                                <div className="d-flex align-items-center">
                                                    <label className="text-muted small me-2 mb-0 text-nowrap">作者:</label>
                                                    <input type="text" className="form-control form-control-sm" style={{ width: '100px' }} defaultValue={singleDetail.author} />
                                                </div>
                                                <input type="date" className="form-control form-control-sm" defaultValue={timeChange(singleDetail.create_at)} />
                                            </>
                                        ) : (
                                            <>
                                                <span><i className="bi bi-person me-1"></i>{singleDetail.author}</span>
                                                <span className="text-silver">|</span>
                                                <span><i className="bi bi-calendar3 me-1"></i>{timeChange(singleDetail.create_at)}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="px-4 py-3">
                                    {/* 3. 標籤選擇區 */}
                                    <div className="d-flex align-items-center mb-3">
                                        <span className="text-muted small me-3 text-nowrap">分類標籤:</span>
                                        <div className="d-flex flex-wrap gap-2">
                                            {isEdit ? (
                                                availableTags.map((tag) => (
                                                    <div key={tag} className="form-check m-0 ps-1">
                                                        <input className="btn-check" type="checkbox" id={`tag-${tag}`} defaultChecked={singleDetail.tag?.includes(tag)} />
                                                        <label className="btn btn-outline-secondary btn-sm rounded-pill py-1 px-3" style={{ fontSize: '0.75rem' }} htmlFor={`tag-${tag}`}>
                                                            {tag}
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                singleDetail?.tag?.map((i)=>(
                                                    <span key={i} className="badge border text-secondary fw-normal rounded-pill px-3">#{i}</span>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* 4. 標題與描述 */}
                                    <div className="mb-3">
                                        {isEdit 
                                            ? <input type="text" className="form-control fw-bold" placeholder="請輸入文章標題..." defaultValue={singleDetail.title}/>
                                            : <h3 className="fw-bold m-0 bg-success-subtle">{singleDetail.title}</h3>
                                        }
                                    </div>

                                    <div className="mb-4">
                                        {isEdit 
                                            ? <textarea className="form-control form-control-sm text-muted" rows="2" placeholder="請輸入文章簡述..." defaultValue={singleDetail.description}/>
                                            : <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>{singleDetail.description}</p>
                                        }
                                    </div>

                                    <hr className="my-2 opacity-10" />

                                    {/* 5. 文章內容區 */}
                                    <div className="article-content" style={{ minHeight: '300px' }}>
                                        {isEdit ? (
                                            <div className="edit-wrapper">
                                                <ReactQuill 
                                                    theme="snow" 
                                                    onChange={handleEditorChange}
                                                    value={content} 
                                                    modules={modules}
                                                    style={{ height: '350px', marginBottom: '50px' }}/>
                                            </div>
                                        ) : (
                                            <div className="ql-editor p-0" style={{ lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: content }} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 6. 底部操作區 */}
                            <div className="modal-footer border-top p-3 d-flex justify-content-between align-items-center bg-light">
                                {isEdit ? (
                                    <div className="ms-auto">
                                        {mode === 'create' ? (
                                            /* 新增模式：直接使用 BS5 原生關閉屬性，不用寫 JS */
                                            <button 
                                                type="button" 
                                                className="btn btn-sm  btn-light border me-3" 
                                                data-bs-dismiss="modal" 
                                            >
                                                取消新增
                                            </button>
                                        ) : (
                                            /* 編輯模式：不加 dismiss 屬性，只切換 React 狀態 */
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-link text-secondary text-decoration-none me-3" 
                                                onClick={() => setIsEdit(false)}
                                            >
                                                取消編輯
                                            </button>
                                        )}
                                        <button type="button" className="btn btn-primary px-4 shadow-sm">儲存文章</button>
                                    </div>
                                ) : (
                                    <>
                                        <button type="button" className="btn btn-sm btn-outline-danger px-3" >
                                            <i className="bi bi-trash3 me-1"></i>刪除文章
                                        </button>
                                        <div>
                                            <button type="button" className="btn btn-sm btn-light border px-3 me-2" data-bs-dismiss="modal">
                                                關閉
                                            </button>
                                            <button type="button" className="btn btn-sm btn-primary px-4 shadow-sm" onClick={() => setIsEdit(true)}>
                                                <i className="bi bi-pencil-square me-1"></i>編輯內容
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </main>
    </>
        
    )
}