

function ItemCard ({name, value,id,onChange,checked,imgUrl,onClickPlus,onClickMins,qty,price,detail,mode}) {
    return <div className="form-check">
        <input 
            className="form-check-input hidden-input" 
            type="checkbox" 
            name={name} 
            value={value} 
            id={id}
            onChange={onChange}
            checked={checked}
        />
        

        {mode === "plural" &&
            <div className={`itemCard ${checked ? "card-active": ""} mb-5`}>
                <div class="position-relative" style={{height:"100px"}}>
                    <img className="itemCard__img" src={imgUrl}/>
                    <p className="position-absolute bottom-0 end-0 itemCard__descr fw-medium  ">$ {price}</p>

                </div>
                    <div class="itemCard__descr-wrapper">
                        <div className="d-flex justify-content-between align-items-center gap-2 mb-4">
                            <p class="itemCard__title">{value}</p>
                            <div className="itemCard__counter">
                                <button className="itemCard__btn"onClick={onClickMins}>
                                    -
                                </button>
                                <span className="itemCard__counter-score">{qty}</span>
                                <button className="itemCard__btn itemCard__btn-plus"
                                onClick={onClickPlus}>
                                    +
                                </button>
                            </div>
                            
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <div>
                                    <p className="fs-ssm">
                                        <span >{detail.grams}g</span> / 
                                        <span > {detail.calories} cal</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="fs-ssm">
                                        <span >P {detail.protein}</span> / 
                                        <span > F {detail.fat}</span> / 
                                        <span > C {detail.carbs}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        }

        {mode === "pluralNoNum" &&
            <div className={`itemCard ${checked ? "card-active": ""} mb-5`}>
                <div class="position-relative" style={{height:"100px"}}>
                    <img className="itemCard__img" src={imgUrl}/>
                </div>
                    <div class="itemCard__descr-wrapper">
                        <div className="d-flex justify-content-between align-items-center gap-2 mb-4">
                            <p class="itemCard__title">{value}</p>
                            <div className="itemCard__counter">
                                <button className="itemCard__btn"onClick={onClickMins}>
                                    -
                                </button>
                                <span className="itemCard__counter-score">{qty}</span>
                                <button className="itemCard__btn itemCard__btn-plus"
                                onClick={onClickPlus}>
                                    +
                                </button>
                            </div>
                            
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <div>
                                    <p className="fs-ssm">
                                        <span >{detail.grams}g</span> / 
                                        <span > {detail.calories} cal</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="fs-ssm">
                                        <span >P {detail.protein}</span> / 
                                        <span > F {detail.fat}</span> / 
                                        <span > C {detail.carbs}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        }

        {mode === "single" &&
            <div className="form-check">
                <input 
                    className="form-check-input hidden-input" 
                    type="checkbox" 
                    name={name}
                    value={value} 
                    id={id}
                    onChange={onChange}
                    checked={checked}
                />
                <label className="form-check-label w-100" htmlFor={id}>
                    <div className={`itemCard  ${checked ? "card-active": ""}`}>
                        <div  style={{height:"100px"}}>
                            <img className="itemCard__img" src={imgUrl}/>
                        </div>
                        <div class="itemCard__descr-wrapper">
                            <div className="d-flex justify-content-between align-items-center gap-2 ">
                                <p class="itemCard__title">{value}</p>
                            </div>
                            <div className="text-end">
                                <div>
                                    <p className="fs-ssm">
                                        <span >{detail.grams}g</span> / 
                                        <span > {detail.calories} cal</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="fs-ssm">
                                        <span >P {detail.protein}</span> / 
                                        <span > F {detail.fat}</span> / 
                                        <span > C {detail.carbs}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </label>
            </div>
        }
    </div>
}

export default ItemCard;