


const TypeListBtn = ({
    text,
    num,
    imageUrl,
    onClick,
    classActive
}) => {
    return (   
        <button className={`c-typeButton ${classActive} h-100`} style={{ "--clr": "#FFFBEF" }} onClick={onClick}>
            <span class="c-typeButton-decor"></span>
            <div class="c-typeButton-content">
                <div class="c-typeButton__icon d-none d-lg-block">
                    <img src={imageUrl} style={{width:"35px"}} alt="" />
                </div>
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center w-100">
                    <div class="c-typeButton__text">{text}</div>
                    <div className="me-lg-3">{num}</div>
                </div>
                
            </div>
        </button>
    )
}

export default TypeListBtn;