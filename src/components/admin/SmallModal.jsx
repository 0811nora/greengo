

export default  function NoraModal ({isOpenModal,setIsOpenModal,handleComfirmBtn,modalText}){
    return(<>

    {isOpenModal && 
        <div className="modal-overlay">
            <div className="cookies-card">
                
                <p className="cookie-heading">是否{modalText}文章？</p>
                <p className="cookie-para">
                    
                </p>
                <div className="button-wrapper">
                    <button className="reject cookie-button" onClick={() => setIsOpenModal(false)}>取消</button>
                    <button className="accept cookie-button" onClick={handleComfirmBtn}>確認</button>
                </div>
                <button className="exit-button" onClick={() => setIsOpenModal(false)}>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 162 162"
                    className="svgIconCross"
                    >
                    <path
                        strokeLinecap="round"
                        strokeWidth="17"
                        stroke="black"
                        d="M9.01074 8.98926L153.021 153"
                    ></path>
                    <path
                        strokeLinecap="round"
                        strokeWidth="17"
                        stroke="black"
                        d="M9.01074 153L153.021 8.98926"
                    ></path>
                    </svg>
                </button>
            </div>
        </div>
    }

    </>)
}