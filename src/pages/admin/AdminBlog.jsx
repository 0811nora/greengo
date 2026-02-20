import { useEffect, useState ,useRef, } from "react"
import { getAdmArticles , getAdmSingleArticle , putAdmEditArticle , postAdminAddArticle , delAdmSingleArticle } from "../../api/ApiAdmin";
import { Modal } from 'bootstrap'; 
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import SmallModal from "../../components/admin/SmallModal";
import Pagination from 'react-bootstrap/Pagination';
import Loader from "../../components/common/Loading";




export default function AdminBlog() {
    
    const detailModal = useRef(null);
    const detailModalRef = useRef(null);
    const [ articleList , setArticleList ] = useState();
    const [ isEdit , setIsEdit ] = useState(false);
    const [ mode , setMode ] = useState("");
    const [ confirmMode , setConfirmMode] = useState("");
    const [ singleDetail , setSingleDetail ] = useState({});
    const [ detailStorage , setDetailStorage ] = useState({});
    const [ isOpenModal, setIsOpenModal] = useState(false);
    const [ modalText , setModalText ] = useState("");
    const [ page , setPage ] = useState({});
    const [ isLoading , setIsLoading ] = useState(false);

    const [ isShowModal , setIsShowModal ] = useState(false);

    const [ filterTargetType , setFilterTargetType ] =  useState("全部");
    const [ filterContent, setFilterContent ] = useState("全部");
    
    const availableTags = ["新手入門", "飲食營養", "增肌減脂", "訓練健身", "健康生活"];


    // 內文編輯器的功能設定
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [
                { 'color': [] }, 
                { 'background': [] }
            ], 
            ['blockquote', 'code-block'],
            [{ 'align': [] }], 
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }], 
            ['link'],
            ['clean']
        ],
        clipboard: {
            matchVisual: false,
        },
    };

    // 取得所有文章列表API
    const getArticle = async (page) => {
        setIsLoading(true);
        try{
            const res = await getAdmArticles(page)
            console.log(res)
            setArticleList(res.data.articles);
            setPage(res.data.pagination)
            setIsLoading(false);
        }catch(err){
            console.log(err)
            setIsLoading(false);
        }
    }


    // 網頁初始化
    useEffect(()=>{
        detailModal.current = new Modal(detailModalRef.current);
        getArticle();
    },[])

    
    // 文章篩選功能
    const typeMap = {
        "文章作者": "author",
        "文章分類": "tag",
        "發布狀態": "isPublic"
        };


    // 篩選類別
    const filterType = ["發布狀態","文章作者","文章分類"]


    // 篩選內容
    const filterValue = () => {
        if (!articleList || articleList.length === 0 || filterTargetType === "全部") return [];

        let allValue = articleList.map((item) => item[typeMap[filterTargetType]]);

        if (typeMap[filterTargetType] === "isPublic") return ["已發佈", "草稿"];
        if (typeMap[filterTargetType] === "tag") allValue = allValue.flat();

        return [...new Set(allValue)];
    }

    // 控制篩選"全部"項目
    const handleMainTypeChange = (value) => {
        setFilterTargetType(value); 
        setFilterContent("全部");       
    };

    // 依照篩選類別，資料變動
    const selectArticle = (articleList || []).filter((item) => {
        if (filterTargetType === "全部" || filterContent === "全部") {
            return true;
        }

        if (typeMap[filterTargetType] === "tag") {
            return item.tag && item.tag.includes(filterContent);
        }

        if (typeMap[filterTargetType] === "isPublic") {
            const statusBool = filterContent === "已發佈";
            return item.isPublic === statusBool;
        }

        return item[typeMap[filterTargetType]] === filterContent;
    });



    // 切換頁數
    const renderPagination = () => {

        const { current_page, total_pages , has_next , has_pre } = page;
        const handleMovePage = (direction) => {
            if( direction === 'prev' && has_pre ){
                getArticle(current_page - 1)
            }else if(direction === 'next' && has_next ){
                getArticle(current_page + 1)
            }
        }


        let active = current_page;
        let items = [];
        for (let number = 1; number <= total_pages; number++) {
            items.push(
                <Pagination.Item 
                    key={number} active={number === active} 
                    onClick={() => getArticle(number)}>
                {number}
                </Pagination.Item>,
            );
        }

    
        return(
            <div>
                <Pagination>
                    <Pagination.Prev disabled={!has_pre} onClick={()=> handleMovePage("prev")} />
                        {items}
                    <Pagination.Next disabled={!has_next} onClick={()=> handleMovePage("next")}/>
                </Pagination>
            </div>
        )
    };

    // 取得單一文章資料
    const getOneArticle = async (id) => {
        setIsLoading(true);
        try{
            const res = await  getAdmSingleArticle(id);
            setSingleDetail(res.data.article)
            setDetailStorage(res.data.article)
            setIsLoading(false);
            
        }catch(err){
            console.log(err)
            setIsLoading(false);
        }
    }
    

    // 點擊新增文章
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
            author: '',
        });
        detailModal.current.show();
    };

     // 點擊查看
    const openDetailModal = (id) => {
        setMode('edit');   
        setIsEdit(false);  
        getOneArticle(id)
        detailModal.current.show();
    };

    // 控制哪個模式，確認鈕要執行不同的指令
    const handleComfirmBtn = () => {
        if( confirmMode === 'newArticle') addNewArticle();
        if( confirmMode === 'updateArticle') sendEditedArticle();
        if( confirmMode === 'deleteArticle') deleteArticle();
    }

    // 表單變動時資料保存
    const handleEditChange = (e) => {
        console.log(e.target.value)

        const { name , value ,checked, type } = e.target;
        if(name === "tag"){
            setSingleDetail((pre) => {
                const currentTags = pre.tag || [];
                const newTags = checked
                    ? [...currentTags,value]
                    : currentTags.filter(i => i !== value);
                return{
                    ...pre,
                    tag: newTags,
                }
            })
        }else{
            setSingleDetail((pre) => ({
                ...pre,
                [name]: type === 'checkbox' ? checked : value,
            }))
        }
    }


    // 文章內文編輯器套件需要的控制
    const handleEditorChange = (value) => {
        setSingleDetail((pre) => ({
            ...pre,
            content: value 
        }));
    };

    //新增文章
    const addNewArticle = async() => {
        try{
            const res = await postAdminAddArticle(singleDetail)
            console.log(res);
            setIsOpenModal(false);
            setIsEdit(false);
            getArticle();
            detailModal.current.hide();

        }catch(err){
            console.log(err);
        }
    }


    //送出API - 文章編輯後的內容
    const sendEditedArticle = async() => {
        const { id } = singleDetail;
        try{
            const res = await putAdmEditArticle(id,singleDetail);
            setDetailStorage(singleDetail);
            setIsOpenModal(false);
            setIsEdit(false);
            getArticle();
            
        }catch(err){
            console.log(err)
        }
    }


    // 刪除API
    const deleteArticle =  async () => {
        const { id } = singleDetail;
        try{
            const res = await delAdmSingleArticle(id);
            setIsOpenModal(false);
            detailModal.current.hide();
            getArticle();
            
            console.log(res)
        }catch(err){
            console.log(err)
        }
    }

    // 時戳轉換
    const timeChange = (time) =>{
        const date = new Date(time * (String(time).length === 10 ? 1000 : 1));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    
    const handleClose = () => {
        setIsOpenModal(false);
    };
    


    return (<>

    <main className="adm-blog">
        <div className="container py-3">
            <div style={{height:"100px"}}></div>
            <h1 className="fs-4 p-3 fw-bold mb-6">文章列表</h1>

            <div >
                <div class="row g-4 align-items-center mb-6">
                    <div class="col-3 m-0">
                        <small className="ps-2">分類</small>
                        <select class="form-select py-2" aria-label="Default select example"
                            value={filterTargetType}
                            onChange={(e)=> handleMainTypeChange(e.target.value)}>
                            <option selected>全部</option>
                            {filterType.map((item) => (
                                <option value={item}>{item}</option>
                            ))}
                            
                        </select>
                    </div>
                    <div class="col-3 m-0">
                    <small className="ps-2">選項</small>
                    <select class="form-select py-2" aria-label="Default select example"
                        disabled={filterTargetType === "全部"}
                        value={filterContent}
                        onChange={(e) => setFilterContent(e.target.value)}>
                        <option selected>全部</option>
                        {filterValue().map((item) => (
                            <option value={item}>{item}</option>
                        ))}

                    </select>
                    </div>
                    <div className="col-md text-end pe-4 ">
                        <button type="button" className="btn btn adm__button__primary py-3 fw-blod px-6 text-white" 
                            style={{borderRadius:"28px"}} 
                            onClick={openCreateModal}
                        ><i className="bi bi-plus-lg me-1"></i>新增文章</button>
                    </div>
                </div>
            </div>

            
            


            <div className="card  my-3 p-8" style={{borderRadius:"28px"}}>
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
                            {selectArticle?.map((item)=>(
                                <tr key={item.id}>
                                    <td>{timeChange(item.create_at)}</td>
                                    <td className="text-truncate py-6" style={{maxWidth: "250px"}}>{item.title}</td>
                                    <td>
                                        {item.isPublic
                                            ? <span className="badge py-2 bg-primary">已發佈</span>
                                            : <span className="badge py-2 bg-brown-200">草稿</span>
                                        }
                                    </td>
                                    <td>{item.author}</td>
                                    <td className="">{item?.tag?.map((i) =>(
                                        <span className="p-1 m-1 text-nowrap lh bg-orange-100 rounded py-2 px-4" key={i}>{i}</span>
                                        ))}
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-dark" onClick={()=>openDetailModal(item.id)}>查看</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                

                <div className="modal modal-blog fade" ref={detailModalRef} tabIndex="-1" >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" style={{ maxWidth: '900px', width: '95%' }}>
                        <div className="modal-content border-0 shadow-lg">
                            
                            {/*圖片*/}
                            <div className="position-relative" style={{ height: '150px' }}>
                                <img 
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
                                                value={singleDetail.image}
                                                name="image"
                                                onChange={handleEditChange}
                                                placeholder="請輸入圖片網址..."
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="modal-body p-0">
                                
                                <div className="bg-light border-bottom px-4 py-3 d-flex justify-content-between align-items-center">

                                    {/*發布狀態*/}
                                    <div className="d-flex align-items-center">
                                        {isEdit ? (
                                            <div className="form-check form-switch mb-0">
                                                <input className="form-check-input" type="checkbox" 
                                                role="switch" id="isPublic"  name="isPublic"
                                                checked={singleDetail.isPublic || false} 
                                                onChange={handleEditChange}
                                                value={singleDetail.isPublic}
                                                />
                                                
                                                <label className="form-check-label small text-muted" htmlFor="isPublic">公開文章</label>
                                            </div>
                                        ) : (
                                            singleDetail.isPublic ? 
                                                <span className="badge rounded-pill text-white bg-success">已公開</span> : 
                                                <span className="badge rounded-pill text-white bg-brown-200">草稿</span>
                                        )}
                                    </div>

                                    {/*作者*/}
                                    <div className="d-flex align-items-center gap-3 text-muted small">
                                        {isEdit ? (
                                            <>
                                                <div className="d-flex align-items-center">
                                                    <label className="text-muted small me-2 mb-0 text-nowrap">作者:</label>
                                                    <input type="text" name="author" 
                                                        className="form-control form-control-sm" 
                                                        style={{ width: '100px' }} 
                                                        value={singleDetail.author} onChange={handleEditChange}/>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <span><i className="bi bi-person me-1"></i>{singleDetail.author}</span>
                                            </>
                                        )}
                                        <span className="text-silver">|</span>
                                        <span><i className="bi bi-calendar3 me-1"></i>{timeChange(singleDetail.create_at)}</span>
                                    </div>
                                </div>

                                <div className="px-5 py-3">

                                    {/* 標籤類別 */}
                                    <div className="d-flex align-items-center mb-3">
                                        <span className="text-muted small me-3 text-nowrap">分類標籤:</span>
                                        <div className="d-flex flex-wrap gap-2">
                                            {isEdit ? (
                                                availableTags.map((tag) => (
                                                    <div key={tag} className="form-check m-0 ps-1">
                                                        <input className="btn-check" type="checkbox" 
                                                            id={`tag-${tag}`} 
                                                            checked={singleDetail.tag?.includes(tag) || false} 
                                                            value={tag}
                                                            name="tag"
                                                            onChange={handleEditChange}/>
                                                        <label className="btn btn-outline-primary btn-sm rounded-pill py-1 px-3" style={{ fontSize: '0.75rem' }} htmlFor={`tag-${tag}`}>
                                                            {tag}
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                singleDetail?.tag?.map((i)=>(
                                                    <span key={i} className="badge border bg-brown-300 fw-normal rounded-pill px-3">#{i}</span>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* 標題 */}
                                    <div className="mb-3">
                                        {isEdit 
                                            ? <input type="text" className="form-control fw-bold"  placeholder="請輸入文章標題..." name="title" value={singleDetail.title} onChange={handleEditChange}/>
                                            : <h3 className="fw-bold m-0 bg-success-subtle">{singleDetail.title}</h3>
                                        }
                                    </div>

                                    {/* 文章簡述 */}
                                    <div className="mb-4">
                                        {isEdit 
                                            ? <textarea className="form-control form-control-sm text-muted" 
                                                rows="2" placeholder="請輸入文章簡述..." 
                                                name="description"
                                                onChange={handleEditChange}
                                                value={singleDetail.description}/>
                                            : <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>{singleDetail.description}</p>
                                        }
                                    </div>

                                    <hr className="my-2 opacity-10" />

                                    {/* 文章內文 */}
                                    <div className="article-content" style={{ minHeight: '300px' }}>
                                        {isEdit ? (
                                            <div className="edit-wrapper">
                                                <ReactQuill 
                                                    name="content"
                                                    theme="snow" 
                                                    onChange={handleEditorChange}
                                                    value={singleDetail.content || ""}
                                                    modules={modules}
                                                    style={{ height: '350px', marginBottom: '50px' }}/>
                                            </div>
                                        ) : (
                                            <div className="ql-editor p-0" style={{ lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: singleDetail.content }} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 操作按鈕們 */}
                            <div className="modal-footer border-top p-3 d-flex justify-content-between align-items-center bg-light">
                                {isEdit ? (
                                    <div className="ms-auto">
                                        {mode === 'create' ? (
                                            <button 
                                                type="button" 
                                                className="btn btn-sm  btn-light border me-3" 
                                                data-bs-dismiss="modal" 
                                            >
                                                取消新增
                                            </button>
                                        ) : (
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-link text-secondary text-decoration-none me-3" 
                                                onClick={() => {
                                                    setIsEdit(false),
                                                    setSingleDetail(detailStorage)
                                                }}
                                            >
                                                取消編輯
                                            </button>
                                        )}
                                        { mode === 'create' 
                                            ?  <button type="button" className="btn btn-primary px-4 shadow-sm"
                                                onClick={()=> {
                                                    setIsOpenModal(true),
                                                    setModalText("新增")
                                                    setConfirmMode('newArticle')
                                                }}
                                                >新增文章</button>
                                            : <button type="button" 
                                                className="btn btn-primary px-4 shadow-sm"
                                                onClick={()=> {
                                                    setIsOpenModal(true)
                                                    setModalText("儲存")
                                                    setConfirmMode("updateArticle")
                                                }}
                                                >儲存文章</button>
                                        }
                                        
                                    </div>
                                ) : (
                                    <>
                                        <button type="button" className="btn btn-sm btn-outline-danger px-3"
                                            onClick={() => {
                                                setMode('delete');
                                                setIsOpenModal(true),
                                                setModalText("刪除"),
                                                setConfirmMode("deleteArticle")
                                            }}  >
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

            <div className="d-flex  justify-content-center align-items-center mt-8">
                {renderPagination()}
            </div>
        </div>

        <Loader mode={"mask"} show={isLoading}/>

        <SmallModal 
            isOpenModal={isOpenModal} 
            setIsOpenModal={setIsOpenModal}
            mode={mode}
            modalText={modalText}
            handleComfirmBtn={handleComfirmBtn}
        />
    </main>
    </>
        
    )
}