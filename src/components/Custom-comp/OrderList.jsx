import { div } from "framer-motion/client";

const OrderList = ({
    onClose,
    categoryTab,
    orderTitle,
    selectedProduct,
    discount,
    basePrice,
    totalProteinPrice,
    finalPrice,
    totalAddonPrice,
    onEdit,            
    onDeleteAddOn,
    isModel,
    isEdit,
    styleType,
    onAddonEdit
}) => {
    const titleName = { base: "基底", protein: "蛋白質", side: "配菜", sauce: "醬料" };

    // --- 如果isModal是true的話顯示---
    if (isModel) {
        return (
            <div className={`${styleType} p-6`}>
                <div className="position-absolute top-0 end-0 m-3 text-brown-300"
                    onClick={() => onClose()}
                    style={{ cursor: 'pointer', zIndex: 10 }} 
                >
                    <i className="bi bi-x-circle-fill fs-5"></i> 
                </div>
                <div className="d-flex flex-column h-100">
                    {/* 中間滾動區 */}
                    <div className="flex-grow-1 overflow-y-auto custom-scrollbar">
                        <h6 className="mb-3 text-center text-gray-500 fw-bold border-bottom mt-4 pb-2">{orderTitle} x 自由配</h6>
                        <table className="table table-borderless align-middle mb-0 ">
                            <thead className="text-gray-500 border-bottom small">
                                <tr>
                                    <th style={{ width: '25%' }}>類別</th>
                                    <th style={{ width: '35%' }}>內容</th>
                                    <th className="text-center" style={{ width: '20%' }}>數量</th>
                                    <th className="text-end" style={{ width: '20%' }}>加價</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryTab.filter(tab => tab !== "addOn" && selectedProduct[tab].length > 0).map(tab => (
                                    selectedProduct[tab].map((p, index) => (
                                        <tr key={`${tab}-${index}`}>
                                            <td className="text-primary fw-bold">{index === 0 ? titleName[tab] : ""}</td>
                                            <td>{p.title}</td>
                                            <td className="text-center">{p.qty}</td>
                                            <td className="text-end">{tab === "protein" ? ((p.price - discount) * p.qty > 0 ? `$${(p.price - discount) * p.qty}` : "-") : "-"}</td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                        
                        {/* 自由配小計 */}
                        <div className=" mt-2 mb-4 px-2 bg-primary-100 py-2">
                            <div className="d-flex justify-content-between">
                                <p className="text-muted small">自由配：</p>
                                <p className="fw-bold text-dark">${basePrice}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p className="text-muted small">自由配加價：</p>
                                <p className="fw-bold text-dark">${totalProteinPrice.toLocaleString()}</p>
                            </div>
                        </div>
                        
                        {selectedProduct["addOn"].length > 0 && (
                            <div className="mt-4">
                                <h6 className="mb-3 text-center text-gray-500 fw-bold border-bottom pb-2">加購品項</h6>
                                <table className="table table-sm table-borderless align-middle mb-2">
                                    <thead className="text-gray-500 border-bottom small">
                                        <tr>
                                            <th style={{ width: '60%' }}>內容</th>
                                            <th className="text-center" style={{ width: '20%' }}>數量</th>
                                            <th className="text-end" style={{ width: '20%' }}>小計</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedProduct["addOn"].map((p, index) => (
                                            <tr key={`addon-${index}`}>
                                                <td className="text-primary fw-bold">{p.title}</td>
                                                <td className="text-center">x{p.qty}</td>
                                                <td className="text-end">${p.price * p.qty.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* 加購小計 */}
                                
                                <div className=" mt-2 mb-4 px-2 bg-primary-100 py-2">
                                    <div className="d-flex justify-content-between">
                                        <p className="text-muted small">加購小計：</p>
                                        <p className="fw-bold text-dark">${totalAddonPrice.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 總計區 */}
                    <div className="flex-shrink-0 pt-3 border-top mt-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="fs-5 fw-bold">總計金額</span>
                            <span className="fs-4 fw-bold text-price">$ {finalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }

    // --- 如果isModal是false的話顯示---
    return (
        <div className={`${styleType} p-0 d-flex flex-column h-100 overflow-hidden`}>
            
            {/* 卡片標題區  */}
            <div className="flex-shrink-0 p-4 pb-2">
                <div className="row g-0 border-bottom pb-3">
                    <div className="col-7 ps-2">
                        <div className="d-flex align-items-center">
                            <div className="bg-primary rounded-pill me-2" style={{ width: '4px', height: '18px' }}></div>
                            <h6 className="mb-0 fw-bold text-dark">{orderTitle} <span className="text-primary small ms-1">#自由配</span></h6>
                        </div>
                    </div>
                    <div className="col-5 ps-4 border-start d-none d-lg-block">
                        <div className="d-flex align-items-center">
                            <div className="bg-orange-400 rounded-pill me-2" style={{ width: '4px', height: '18px', backgroundColor: '#fd7e14' }}></div>
                            <h6 className="mb-0 fw-bold text-dark">加購品項</h6>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. list區塊 */}
            <div className="flex-grow-1 overflow-y-auto custom-scrollbar px-4" style={{ minHeight: 0 }}>
                <div className="row g-0">
                    {/* 左側：自由配清單 */}
                    <div className="col-12 col-lg-7 pe-lg-3 py-2">
                        {categoryTab.filter(tab => tab !== "addOn" && selectedProduct[tab].length > 0).map(tab => (
                            <div key={tab} className="mb-3 bg-light rounded-3 p-3 border border-white shadow-sm">
                                <div className="d-flex justify-content-between gap-lg-3 align-items-center">
                                    <div className="d-flex align-items-start gap-3 flex-grow-1">
                                        <div style={{ minWidth: '65px' }}>
                                            <span className="badge fs-md rounded-pill bg-white text-primary border border-primary-subtle px-2 py-2 w-100" style={{fontSize: '0.7rem'}}>
                                                {titleName[tab]}
                                            </span>
                                        </div>
                                        <div className="flex-grow-1 border-start border-white ps-3">
                                            {selectedProduct[tab].map((p, i) => (
                                                <div key={i} className="d-flex justify-content-between align-items-center py-1">
                                                    <span className="text-dark  fw-medium">{p.title} <small className="text-muted ms-1">x{p.qty}</small></span>
                                                    <span className="text-primary small fw-bold">
                                                        {tab === "protein" && (p.price - discount) * p.qty > 0 ? `+$${(p.price - discount) * p.qty}` : ""}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {isEdit && (
                                        <button className="btn btn-sm btn-white border border-gray-200 shadow-sm rounded-circle ms-3 flex-shrink-0" 
                                            style={{ width: '30px', height: '30px', padding: 0 }} 
                                            onClick={() => onEdit(tab)}>
                                            <i className="bi bi-pencil-fill text-primary" style={{fontSize: '0.75rem'}}></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 加購清單 */}
                    <div className="col-12 col-lg-5 ps-lg-4 border-lg-start py-2">
                        <div className="d-lg-none mb-3">
                            <h6 className="fw-bold text-dark border-bottom pb-2">加購品項</h6>
                        </div>
                        {selectedProduct["addOn"].length > 0 ? (
                            <div className="d-flex flex-column justify-content-between h-100">
                                <div className="list-group list-group-flush ">
                                    {selectedProduct["addOn"].map((p, i) => (
                                        <div key={i} className="list-group-item bg-transparent border-0 px-0 py-2 d-flex justify-content-between align-items-center">
                                            <div className="d-flex flex-column">
                                                <span className="small fw-bold text-dark">{p.title}</span>
                                                <small className="text-muted" style={{fontSize: '0.75rem'}}>數量: {p.qty}</small>
                                            </div>
                                            <div className="d-flex align-items-center gap-3">
                                                <span className="small fw-bold text-dark">${p.price * p.qty}</span>
                                                {isEdit && <i className="bi bi-trash text-danger" onClick={() => onDeleteAddOn(p.title)} style={{cursor:'pointer', fontSize: '0.9rem'}}></i>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center mb-4">
                                    <button className="btn btn-sm btn-outline-primary w-50 mt-3" onClick={onAddonEdit}>編輯加購品項</button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-5  rounded-3 mx-2">
                                <p className="text-gray-400 small mb-0">無加購商品</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @media (min-width: 992px) {
                    .border-lg-start { border-left: 1px solid #dee2e6 !important; }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; } 
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
            `}</style>
        </div>
    );
};






export default OrderList;





