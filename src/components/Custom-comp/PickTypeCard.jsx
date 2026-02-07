

const PickTypeCard = ({
        selectedValue,
        typeText,
        onSelect,
        sourceData,
        onLimitChange,
        title,
        describe,
        num,
        bgImage

    }) => {

    const pickType = (e) => {
        const targetData = sourceData.find(item => item.content.plan_type === e.target.value);
        const { unit , id , content } = targetData
        onLimitChange(content);
        onSelect((pre)=>({
            ...pre,
            plan_type: e.target.value,
            productId: id,
            productTag: unit
        }))
    }

    return(
        <div className="form-check p-2">
            <input className="form-check-input hidden-input" type="radio" name="plan_type" id={typeText} value={typeText} onClick={pickType}/>
            <label className="form-check-label" htmlFor={typeText}>
                <div className="position-relative">
                    
                    <div className={`step1-card ${selectedValue === typeText ? "c-active-card" : ""}`}
                        style={{backgroundImage: `url(${bgImage})`}}>
                        <div className="dark-overlay">
                            <div className="d-flex card-outside" >
                                <div className="title-area align-self-md-end align-self-start">
                                    <h2 className="step-title text-white text-shadow">
                                        {title}
                                    </h2>
                                </div>
                                <div className=" card-content py-8  flex-column align-items-end dark-overlay2" 
                                    >
                                    <p className=" fs-5 text-nowrap fw-semibold text-end pe-5 mb-3 ">
                                        {describe}
                                    </p>
                                    <ul className="w-100 p-5 text-gray-400 fw-medium " style={{listStyleType: "disc"}}>
                                        <li className="d-flex  justify-content-between mb-3">
                                            <p className="">基底</p>
                                            <p className="">x {num.base}</p>
                                        </li>
                                        <li className="d-flex justify-content-between mb-3">
                                            <p className="">蛋白質</p>
                                            <p className="">x {num.protein}</p>
                                        </li>
                                        <li className="d-flex justify-content-between mb-3">
                                            <p className="">配菜</p>
                                            <p className="">x {num.side}</p>
                                        </li>
                                        <li className="d-flex justify-content-between mb-3">
                                            <p className="">醬料</p>
                                            <p className="">x {num.sauce}</p>
                                        </li>
                                    </ul>
                                </div> 
                            </div>
                        </div>
                    </div>
                    <div className={`position-absolute top-0 start-0 c-pick-btn ${selectedValue === typeText ? "c-active-pick-btn" : ""}`}>
                        <i class="bi bi-check-circle-fill"></i>
                    </div>
                </div>
                
                
                
            </label>
        </div>
    )
}

export default PickTypeCard;