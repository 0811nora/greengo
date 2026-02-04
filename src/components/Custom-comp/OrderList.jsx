
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
}) => {
    return (<>
        <div className="order-details p-6">
            <div 
                className="position-absolute top-0 end-0 m-3 text-brown-300"
                onClick={() => onClose()}
                style={{ transition: '0.2s', cursor: 'pointer' }} 
            >
                <i className="bi bi-x-circle-fill fs-5"></i> 
            </div>

            
            {/* --- 自由配區塊 --- */}
            <div className="mb-8">
                <h6 className="mb-3 text-center text-gray-500 fw-bold border-bottom mt-4 pb-2">
                    {orderTitle} x 自由配
                </h6>
                <table className="table  table-borderless align-middle mb-0" 
                style={{ 
                    '--bs-table-bg': 'transparent',
                    backgroundColor: 'transparent' 
                }}>
                    <thead className="text-gray-500 ">
                        <tr>
                            <th style={{ width: '25%' }}>類別</th>
                            <th style={{ width: '35%' }}>內容</th>
                            <th style={{ width: '20%' }} className="text-center">數量</th>
                            <th style={{ width: '20%' }} className="text-end">加價</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {categoryTab.filter(tab => tab !== "addOn" && selectedProduct[tab].length > 0).map(tab => {
                            const titleName = { base: "基底", protein: "蛋白質", side: "配菜", sauce: "醬料" };
                            return selectedProduct[tab].map((p, index) => (
                                <tr key={`${tab}-${index}`} className="p-4">
                                    <td className="text-primary fw-bold">
                                        {index === 0 ? titleName[tab] : ""}
                                    </td>
                                    <td>{p.title}</td>
                                    <td className="text-center">{p.qty}</td>
                                    <td className="text-end">
                                        {tab === "protein" 
                                            ? ((p.price - discount) * p.qty > 0 ? `$${(p.price - discount) * p.qty}` : "-")
                                            : "-"}
                                    </td>
                                </tr>
                            ));
                        })}
                    </tbody>
                </table>
                {/* 自由配小計 */}
                <div className="mt-2 pt-2 border-top mb-6">
                    <div className="d-flex justify-content-between px-1 my-1">
                        <span>自由配基本價</span>
                        <span className="fw-bold">$ {basePrice}</span>
                    </div>
                    <div className="d-flex justify-content-between px-1  my-1">
                        <span >自由配差額小計</span>
                        <span className="fw-bold">$ {totalProteinPrice}</span>
                    </div>
                </div>
            </div>

            {/* --- 加購 --- */}
            {selectedProduct["addOn"].length > 0 && (
                <div className="">
                    <h6 className="mb-3 text-center text-gray-500 fw-bold border-bottom pb-2">加購品項</h6>
                    <table className="table table-sm table-borderless align-middle mb-2"
                        style={{ 
                        '--bs-table-bg': 'transparent',
                        backgroundColor: 'transparent' 
                    }}>
                        <thead className="text-gray-500 ">
                            <tr>
                                <th style={{ width: '60%' }}>內容</th>
                                <th style={{ width: '20%' }} className="text-center">數量</th>
                                <th style={{ width: '20%' }} className="text-end">價格</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {selectedProduct["addOn"].map((p, index) => (
                                <tr key={`addon-${index}`}>
                                    <td className=" text-primary fw-bold py-2">{p.title}</td>
                                    <td className="text-center">{p.qty}</td>
                                    <td className="text-end">${p.price * p.qty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className=" py-3 border-top d-flex justify-content-between px-1 ">
                        <span>加購小計</span>
                        <span className="fw-bold">$ {totalAddonPrice}</span>
                    </div>
                </div>
            )}

            {/* --- 總計 --- */}
            <div className="pt-3 border-top mt-auto">
                <div className="d-flex justify-content-between align-items-center">
                    <span className="fs-5 fw-bold">總計金額</span>
                    <span className="fs-4 fw-bold text-orange-300">$ {finalPrice}</span>
                </div>
            </div>
        </div>
    </>);
}

export default OrderList;