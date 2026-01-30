

function ItemCard ({name, value,id,onChange,checked,imgUrl,onClickPlus,onClickMins,qty,price}) {
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
        <div className={`card p-2 ${checked ? "card-active": ""} mb-5`}>
            <div className="d-flex justify-content-center align-items-center gap-2">
                <div style={{width:"40px",height:"40px",}} alt="" >
                    <img className="w-100 h-100" src={imgUrl} 
                    style={{borderRadius:"50%"}}/>
                </div>
                <p>{value}</p>
            </div>
            <div className=" d-flex justify-content-around align-items-center mt-2">
                <div>
                    <button 
                    className="btn btn-primary-100 py-0 px-2 border rounded-0"
                    onClick={onClickMins}>
                        -
                    </button>
                    <span className="px-2">{qty}</span>
                    <button className="btn btn-primary-100 py-0 px-2  border rounded-0"
                    onClick={onClickPlus}>
                        +
                    </button>
                </div>
                
                <div className="bg-dark text-white p-1 rounded">${price}</div>
            </div>
        </div>
    </div>
}

export default ItemCard;