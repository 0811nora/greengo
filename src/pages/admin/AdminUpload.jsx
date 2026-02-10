import { useState } from 'react';
import { upload } from '../../api/ApiAdmin';
import Loader from '../../components/common/Loading';



const AdminUpload = () => {
    const [previewUrl, setPreviewUrl] = useState(null); 
    const [uploadUrl, setUploadUrl] = useState("");
    const [copied, setCopied] = useState(false); 
    const [isUploading, setIsUploading] = useState(false); 

    const handleupload = async (file) => {
        const formData = new FormData();
        formData.append('file-to-upload', file);

        setIsUploading(true); 
        try {
            const res = await upload(formData);
            const newUrl = res.data.imageUrl;
            setUploadUrl(newUrl);
            setCopied(false); 
        } catch (err) {
            console.log('上傳錯誤', err);
        } finally {
            setIsUploading(false); 
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadUrl(""); 
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview); 
        handleupload(file);
    }

    const handleCopy = async () => {
        if (!uploadUrl) return;
        try {
            await navigator.clipboard.writeText(uploadUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); 
        } catch (err) {
            console.error('複製失敗', err);
        }
    }

    return (
        <>


        <main className="adm-upload" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ height: "80px" }}></div>
            <div className="container py-5">
                <div className="mx-auto" style={{ maxWidth: '600px' }}>
                    <h2 className="text-center mb-5 fw-bold text-dark">隱藏功能之上傳圖片</h2>



                <div className="card border-0 shadow-sm p-4 mb-4">
                    <div className="input-group" >
                        <textarea 
                            className="form-control bg-light border rounded me-2" 
                            placeholder={isUploading ? "正在上傳..." : "等待上傳後產生網址..."}
                            value={isUploading ? "上傳中..." : uploadUrl} 
                            readOnly 
                            rows="2" 
                            style={{ 
                                color: '#555',
                                resize: 'none' 
                            }}
                        />
                        <button 
                            className={`btn ${copied ? 'btn-info' : 'btn-primary'} rounded`}
                            type="button"
                            onClick={handleCopy}
                            disabled={!uploadUrl || isUploading}
                            style={{ width: '100px' }}
                        >
                            {copied ? "已複製" : "複製"}
                        </button>
                        <p></p>
                    </div>
                    {uploadUrl && !isUploading && (
                        <div className="mt-3 animate__animated animate__fadeIn">
                            <p className="text-success text-center mb-0">
                                <i className="bi bi-info-circle me-1"></i>
                                請將網址保存下來，因為無資料庫可保存，需自行儲存喔～
                            </p>
                        </div>
                    )}
                </div>
                    

                    <div className="card border-0 shadow-sm p-4 text-center">
                        <input className="d-none" type="file" accept="image/*" id="uploadBtn" onChange={handleFileChange} />
                        <label htmlFor="uploadBtn" className={`btn ${isUploading ? 'btn-secondary' : 'btn-dark'} btn-lg px-5 py-3 rounded-pill mb-4 shadow-sm`}>
                            {isUploading ? (
                                <span><i className="bi bi-hourglass-split me-2"></i>處理中...</span>
                            ) : (
                                <span><i className="bi bi-cloud-arrow-up me-2"></i>選擇圖片</span>
                            )}
                        </label>

                        <div className="preview-container border rounded-3 d-flex align-items-center justify-content-center bg-light" 
                            style={{ minHeight: '250px', overflow: 'hidden', position: 'relative' }}>
                            {previewUrl ? (
                                <img src={previewUrl} alt="預覽" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: isUploading ? 0.5 : 1 }} />
                            ) : (
                                <div className="text-muted">尚未選取圖片</div>
                            )}
                            
                            {isUploading && (
                                <div className="position-absolute top-50 start-50 translate-middle">
                                    <div className="spinner-border text-dark" role="status"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
        </>
    );
}



export default AdminUpload;