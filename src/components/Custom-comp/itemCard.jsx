function ItemCard({ 
        name, 
        value, 
        id, 
        onChange, 
        checked, 
        imgUrl, 
        onClickPlus, 
        onClickMins, 
        qty, 
        price, 
        detail, 
        mode 
    }) {
    
    const showPrice = mode === "plural" || mode === "priceOnly";
    const showCounter = mode === "plural" || mode === "pluralNoNum";
    const isClickableCard = mode === "single" || mode === "priceOnly";
    const Wrapper = isClickableCard ? "label" : "div";

    return (
        <div className="form-check p-0"> 
            <input
                className="form-check-input hidden-input"
                type="checkbox"
                name={name}
                value={value}
                id={id}
                onChange={onChange}
                checked={checked}
            />
            

            <Wrapper 
                className="form-check-label w-100" 
                {...(isClickableCard ? { htmlFor: id } : {})} 
                style={isClickableCard ? { cursor: 'pointer' } : {}}
            >
                <div className={`itemCard ${checked ? "card-active" : ""} mb-5`}>
                    

                    <div className="position-relative" style={{ height: "100px" }}>
                        <img className="itemCard__img" src={imgUrl} alt={value} />
                        {showPrice && (
                            <p className="position-absolute bottom-0 end-0 itemCard__descr fw-medium">$ {price}</p>
                        )}
                    </div>

                    <div className="itemCard__descr-wrapper">
                        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center gap-2 mb-1">
                            <p className="itemCard__title mb-0">{value}</p>

                        
                            <div className="d-flex d-lg-none justify-content-between align-items-center">
                                <div className={`text-center ${isClickableCard ? "text-end w-100" : ""}`}>
                                    <p className="fs-ssm mb-1">
                                        <span>{detail.grams}g</span> / <span>{detail.calories} kcal</span>
                                    </p>
                                    <p className="fs-ssm mb-0">
                                        <span>P {detail.protein}</span> / <span>F {detail.fat}</span> / <span>C {detail.carbs}</span>
                                    </p>
                                </div>
                            </div>
                            

                            {showCounter && (
                                <div className="itemCard__counter">
                                    <button 
                                        className="itemCard__btn" 
                                        onClick={(e) => { e.preventDefault(); onClickMins(); }}
                                    > - </button>
                                    <span className="itemCard__counter-score">{qty}</span>
                                    <button 
                                        className="itemCard__btn itemCard__btn-plus" 
                                        onClick={(e) => { e.preventDefault(); onClickPlus(); }}
                                    > + </button>
                                </div>
                            )}
                        </div>

                        <div className="d-none d-lg-flex justify-content-between align-items-center">
                            <div className={isClickableCard ? "text-end w-100" : ""}>
                                <p className="fs-ssm mb-1">
                                    <span>{detail.grams}g</span> / <span>{detail.calories} kcal</span>
                                </p>
                                <p className="fs-ssm mb-0">
                                    <span>P {detail.protein}</span> / <span>F {detail.fat}</span> / <span>C {detail.carbs}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </div>
    );
}

export default ItemCard;