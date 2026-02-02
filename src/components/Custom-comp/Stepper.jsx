
const Stepper = ({stepState}) =>{
    return(<>
        <div className="position-absolute top-0 start-50 translate-middle-x pt-2 px-4 overflow-hidden" style={{ 
                maxWidth:"400px",
                width:"100%"
            }}>
            <div className="mx-auto d-flex justify-content-between align-items-center py-5 ">
                <div className="text-center ">
                    <p className={`fs-3  ${ stepState >= 1 ? "text-primary" : " "}`}>
                        {stepState > 1 ? <i class="bi bi-check-circle-fill"></i> : <i className="bi bi-1-circle-fill"></i>}
                    </p>
                    <p className={`text-nowrap ${stepState >= 1 ? "text-primary" : ""}`}>套餐類型</p>
                </div>
                <div className={`stepper-line ${stepState >= 1 ? 'bg-primary' : 'bg-brown-300'}`} ></div>
                <div className="text-center ">
                    <p className={`fs-3 ${ stepState >= 2 ? "text-primary" : " "}`}>
                        {stepState > 2 ? <i class="bi bi-check-circle-fill"></i> : <i className="bi bi-2-circle-fill"></i>}
                    </p>
                    <p className={`text-nowrap ${stepState >= 2 ? "text-primary" : ""}`}>自由配</p>
                </div>
                <div className={`stepper-line ${stepState >= 3 ? 'bg-primary' : 'bg-brown-300'}`} ></div>
                <div className="text-center ">
                    <p className={`fs-3 ${ stepState >= 3 ? "text-primary" : " "}`}>
                        {stepState > 3 ? <i class="bi bi-check-circle-fill"></i> : <i className="bi bi-3-circle-fill"></i>}
                    </p>
                    <p className={`text-nowrap ${stepState >= 3 ? "text-primary" : ""}`}>確認餐點</p>
                </div>
            </div>
        </div>
    </>)
}

export default Stepper;