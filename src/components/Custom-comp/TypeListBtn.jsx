


const TypeListBtn = ({
    text,
    num,
    imageUrl,
    onClick,
    classActive
}) => {
    return (   
        <button className={`c-typeButton ${classActive}`} style={{ "--clr": "#FFFBEF" }} onClick={onClick}>
            <span class="c-typeButton-decor"></span>
            <div class="c-typeButton-content">
                <div class="c-typeButton__icon">
                    <img src={imageUrl} style={{width:"35px"}} alt="" />
                </div>
                <div className="d-flex justify-content-between align-items-center w-100">
                    <div class="c-typeButton__text">{text}</div>
                    <div className="me-3">{num}</div>
                </div>
                
            </div>
        </button>
    )
}

export default TypeListBtn;