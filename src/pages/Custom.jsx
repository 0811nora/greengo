import { useEffect, useState } from "react";
import { getAllProducts } from "../api/ApiClient";


const Stepper = ({stepState}) =>{
    return(<>
        <div className="position-absolute top-0 start-50 translate-middle-x " style={{ 
                maxWidth:"400px",
                width:"100%"
            }}>
            <div className="mx-auto d-flex justify-content-between py-5 ">
                <div className="text-center ">
                    <p className={`fs-3 ${ stepState === 1 ? "text-primary" : " "}`}><i className="bi bi-1-circle-fill"></i>
                    </p>
                    <p>套餐類型</p>
                </div>
                <div className="text-center ">
                    <p className={`fs-3 ${ stepState === 2 ? "text-primary" : " "}`}><i className="bi bi-2-circle-fill"></i></p>
                    <p>自由配</p>
                </div>
                <div className="text-center ">
                    <p className={`fs-3 ${ stepState === 3 ? "text-primary" : " "}`}><i className="bi bi-3-circle-fill"></i></p>
                    <p>確認餐點</p>
                </div>
            </div>
        </div>
    </>)
}


export default function Custom() {

    const [ stepState , setStepState ] = useState(0);
    const [ allProducts , setAllProducts ] = useState([])
    const [ limit , setLimit ] = useState([]);
    const [ activeTab , setActiveTab ] = useState('base');
    const [ selectedProduct , setSelectedProduct] = useState({
        plan_type: "",
        base: [],
        protein: [],
        side:[],
        sauce:[]
    });



    // 看log區
    useEffect(() => {
        console.log('allProducts：',allProducts)
        console.log('selectedProduct:', selectedProduct)
        console.log('limit:', limit)
    },[allProducts,selectedProduct,limit])


    useEffect( () => {
        getCustomProduct();
    },[])


     // 取得所有產品
    const getCustomProduct = async() => {
        try{
            const res = await getAllProducts()
            setAllProducts(res.data.products);
        }catch(err){
            console.log(err)
        }
    }


    const getCustom = allProducts.filter(item => item.category === "custom");
    console.log('getCustom:',getCustom)

    const getAllitem = allProducts.filter(item => item.category === "item");

    const renderItemList = getAllitem.filter(item => item.product_type === activeTab);


    const pickType = (e) => {
        setLimit(getCustom.find(item => item.content.plan_type === e.target.value).content)
    }


    const pickProduct = (e) => {

        const { name , value } = e.target
        console.log( name , value )
        setSelectedProduct((pre) => ({
            ...pre,
            [name]: value
        }))

    }

    



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
                    <section className="bg-secondary-50 py-5 h-100 position-relative p-3">

                        <Stepper stepState={stepState}/>
                        
                        <div className="d-flex mb-5 " style={{marginTop:"130px"}}>
                            <div className="">
                                <h2>Step1 <br/>選擇套餐</h2>
                                <p>選擇今日最適合你的飲食偏好</p>
                            </div>
                            <div className="d-flex gap-5 p-5" >
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="plan_type" id="light" value="light" onClick={pickType}/>
                                    <label className="form-check-label" htmlFor="light">輕食</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="plan_type" id="balanced" value="balanced" onClick={pickType}/>
                                    <label className="form-check-label" htmlFor="balanced">均衡</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="plan_type" id="highProtein" value="highProtein" onClick={pickType}/>
                                    <label className="form-check-label" htmlFor="highProtein">高蛋白</label>
                                </div>
                            </div>
                        </div>

                        
                        <div className="mx-auto " style={{width:"200px"}}>
                            <div className="text-end bg-white rounded">
                                <button className="btn fs-3" onClick={() => setStepState(stepState + 1)}>
                                    <i className="bi bi-arrow-right-circle-fill"></i>
                                </button>
                            </div>
                        </div>

                    </section>
                }
                


                {/* step2 開始自由配 */}
                { stepState === 2 && 
                    <section className="bg-accent-50 py-5 h-100 position-relative p-3" >
                        <Stepper stepState={stepState}/>

                        <div className="d-flex mb-5 ">
                            <div className="">
                                <h2>Step2 <br/>開始自由配</h2>
                                <p>請打造專屬於您的自由配餐點</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-3">
                                <div>
                                    <button className="btn btn-secondary-100 my-2" onClick={()=>setActiveTab('base')}>基底</button>
                                </div>
                                <div>
                                    <button className="btn btn-secondary-100 my-2" onClick={()=>setActiveTab('protein')}>蛋白質</button>
                                </div>
                                <div>
                                    <button className="btn btn-secondary-100 my-2" onClick={()=>setActiveTab('side')}>配菜</button>
                                </div>
                                <div>
                                    <button className="btn btn-secondary-100 my-2" onClick={()=>setActiveTab('sauce')}>醬汁</button>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="row row-cols-3">
                                    {renderItemList.map((item) => (
                                        <div className="col" key={item.id}>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" name={activeTab} value={item.title} id={item.id}
                                                    onChange={(e)=>pickProduct(e)}/>
                                                <label className="form-check-label" htmlFor={item.id}>
                                                    <div className="card p-1 ">
                                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                                            <div style={{width:"40px",height:"40px",}} alt="" >
                                                                <img className="w-100 h-100" src={item.imageUrl} style={{borderRadius:"50%"}}/>
                                                            </div>
                                                            <p>{item.title}</p>
                                                        </div>
                                                        
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-3">計算熱量區</div>
                        </div>




                        
                        

                        
                        <div className="mx-auto " style={{width:"200px"}}>
                            <div className="d-flex justify-content-between bg-white rounded">
                                <button className="btn fs-3" onClick={()=> setStepState(stepState - 1)}>
                                    <i className="bi bi-arrow-left-circle-fill"></i>
                                </button>
                                <button className="btn fs-3" onClick={()=> setStepState(stepState + 1)}>
                                    <i className="bi bi-arrow-right-circle-fill"></i>
                                </button>
                            </div>
                        </div>

                    </section>
                }

                {/* step3 確認餐點 */}
                { stepState === 3 && 
                    <section className="bg-secondary-50 py-5 h-100 position-relative" >

                        <Stepper stepState={stepState}/>
                        
                        <div className="d-flex mb-5" style={{marginTop:"130px"}}>
                            <div className="px-5">
                                <h2>Step3 <br/>確認您的餐點</h2>
                                <p>查看您的餐點明細，確認後按下加入購物車</p>
                            </div>
                            <div className="d-flex gap-5 p-5">
                                
                            </div>
                        </div>
                        <div className="px-5">
                            <button className="btn fs-3" onClick={()=> setStepState(stepState - 1)}>
                                <i className="bi bi-arrow-left-circle-fill"></i>
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