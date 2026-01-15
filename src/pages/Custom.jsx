import { useState } from "react";


const Stepper = ({stepState}) =>{
    return(<>
        <nav className="mx-auto d-flex justify-content-between mb-5" style={{ width:"600px"}}>
            <div className="text-center">
                <p className={`fs-3 ${ stepState === 1 ? "text-primary" : " "}`}><i class="bi bi-1-circle-fill"></i>
                </p>
                <p>套餐類型</p>
            </div>
            <div className="text-center">
                <p className={`fs-3 ${ stepState === 2 ? "text-primary" : " "}`}><i class="bi bi-2-circle-fill"></i></p>
                <p>自由配</p>
            </div>
            <div className="text-center">
                <p className={`fs-3 ${ stepState === 3 ? "text-primary" : " "}`}><i class="bi bi-3-circle-fill"></i></p>
                <p>確認餐點</p>
            </div>
        </nav>
    </>)
}


export default function Custom() {

    const [ stepState , setStepState ] = useState(0);

    return (
        <main className="custom-main">
            <div className="container " style={{ 
                    height: "calc(99vh - 10px)",     
                    maxHeight: "calc(99vh - 108px)",   
                    overflow: "hidden",  
                }}>

                
                {/*自由配 banner*/}
                { stepState === 0 && 
                    <section className="bg-accent-50 py-5 text-center h-100">
                        <h1>$149 <span>起</span> 隨心自由配</h1>
                        <button className="btn btn-primary" onClick={() => setStepState( stepState + 1 )}>立即自由配</button>
                    </section>
                }
                

                {/* step1 選擇套餐 */}
                { stepState === 1 && 
                    <section className="bg-secondary-50 py-5 h-100">

                        <Stepper stepState={stepState}/>
                        
                        <div className="d-flex mb-5">
                            <div className="px-5">
                                <h2>Step1 <br/>選擇套餐</h2>
                                <p>選擇今日最適合你的飲食偏好</p>
                            </div>
                            <div className="d-flex gap-5 p-5">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="plan_type" id="light"/>
                                    <label className="form-check-label" for="light">輕食</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="plan_type" id="balanced"/>
                                    <label className="form-check-label" for="balanced">均衡</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="plan_type" id="highProtein"/>
                                    <label className="form-check-label" for="highProtein">高蛋白</label>
                                </div>
                            </div>
                        </div>

                        
                        <div className="mx-auto " style={{width:"200px"}}>
                            <div className="text-end bg-white rounded">
                                <button className="btn fs-3" onClick={()=> setStepState(stepState + 1)}>
                                    <i class="bi bi-arrow-right-circle-fill"></i>
                                </button>
                            </div>
                        </div>

                    </section>
                }
                


                {/* step2 開始自由配 */}
                { stepState === 2 && 
                    <section className="bg-accent-50 py-5 h-100">

                        <Stepper stepState={stepState}/>
                        
                        <div className="d-flex mb-5">
                            <div className="px-5">
                                <h2>Step2 <br/>開始自由配</h2>
                                <p>請打造專屬於您的自由配餐點</p>
                            </div>
                            <div className="d-flex gap-5 p-5">
                                
                            </div>
                        </div>

                        
                        <div className="mx-auto " style={{width:"200px"}}>
                            <div className="d-flex justify-content-between bg-white rounded">
                                <button className="btn fs-3" onClick={()=> setStepState(stepState - 1)}>
                                    <i class="bi bi-arrow-left-circle-fill"></i>
                                </button>
                                <button className="btn fs-3" onClick={()=> setStepState(stepState + 1)}>
                                    <i class="bi bi-arrow-right-circle-fill"></i>
                                </button>
                            </div>
                        </div>

                    </section>
                }

                {/* step3 確認餐點 */}
                { stepState === 3 && 
                    <section className="bg-secondary-50 py-5 h-100">

                        <Stepper stepState={stepState}/>
                        
                        <div className="d-flex mb-5">
                            <div className="px-5">
                                <h2>Step3 <br/>確認您的餐點</h2>
                                <p>查看您的餐點明細，確認後按下加入購物車</p>
                            </div>
                            <div className="d-flex gap-5 p-5">
                                
                            </div>
                        </div>
                        <div className="px-5">
                            <button className="btn fs-3" onClick={()=> setStepState(stepState - 1)}>
                                <i class="bi bi-arrow-left-circle-fill"></i>
                            </button>
                        </div>

                        
                        <div className="mx-auto " style={{width:"200px"}}>
                            
                        </div>

                    </section>
                }
                

            </div>
        </main>
    )
}