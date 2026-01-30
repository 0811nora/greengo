import { useEffect, useState } from "react";
import { getAllProducts } from "../api/ApiClient";

import ItemCard from "../components/Custom-comp/itemCard";


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


const PROTEIN_DISCOUNT = 30;
const CUSTOM_PRICE = 149;
const CATEGORY_TABS = ["base", "protein", "side", "sauce", "addOn"];
const INITIAL_SELECTED_PRODUCT = {
    plan_type: "",
    base: [],
    protein: [],
    side: [],
    sauce: [],
    addOn: []
};

export default function Custom() {

    const [ stepState , setStepState ] = useState(0);
    const [ allProducts , setAllProducts ] = useState([])
    const [ limit , setLimit ] = useState([]);
    const [ activeTab , setActiveTab ] = useState('base');
    const [ selectedProduct , setSelectedProduct] = useState(INITIAL_SELECTED_PRODUCT);
    const [ addOnTabs ,setAddonTabs ] =  useState('base');






    // 看log區
    useEffect(() => {
        console.log('selectedProduct:', selectedProduct)
        console.log('limit:', limit)
    },[selectedProduct,limit])


      // 取得所有產品
    useEffect( () => {
        const getCustomProduct = async() => {
            try{
                const res = await getAllProducts()
                setAllProducts(res.data.products);
            }catch(err){
                console.log(err)
            }
        }
        getCustomProduct();
        
    },[])

    

    const getCustom = allProducts.filter(item => item.category === "custom");
    const getAllitem = allProducts.filter(item => item.category === "item");
    const renderItemList = getAllitem.filter(item => item.product_type === activeTab);
    const renderaddOnItemList = getAllitem.filter(item => item.product_type === addOnTabs);
    


    // 選擇套餐類別時，取得限制的數量
    const pickType = (e) => {
        setLimit(getCustom.find(item => item.content.plan_type === e.target.value).content)
        setSelectedProduct((pre)=>({
            ...pre,
            plan_type:e.target.value
        }))
    }

    const maxCount = {
        base: limit.base_limit,
        protein: limit.protein_limit,
        side: limit.side_limit,
        sauce: limit.sauce_limit
    }

    

    // 計算類別的總數量
    const totalQty = (type) => selectedProduct[type].reduce((sum, item) => sum + item.qty, 0);

    // 計算已選單品的數量
    const itemQty = (title) => {
        const target = selectedProduct[activeTab].find((item) => item.title === title)
        return  target ? target.qty : 0
    }

    const selectFlat = CATEGORY_TABS.map( keys => selectedProduct[keys]).flat();
    console.log('selectFlat',selectFlat)


    // 從已選品項找出三大營養素數據
    let totalNutrition = selectFlat.map((item) => {
        const product = getAllitem.find(pick => pick['title'] === item['title'])

        if(!product){
            return{ calories: 0, carbs: 0, fat: 0, protein: 0 }
        }
        const nutrition =  product['nutrition']
        const qty = item['qty']

        return {
            calories: nutrition['calories'] * qty,
            carbs: nutrition['carbs'] * qty,
            fat: nutrition['fat'] * qty,
            protein: nutrition['protein'] * qty,
        }

    })

    // 計算所有已選品項的三大營養素加總
    totalNutrition = totalNutrition.reduce(( acc, currItem ) => {
        return {
            calories: acc['calories'] + currItem['calories'],
            carbs: acc['carbs'] + currItem['carbs'],
            fat: acc['fat'] + currItem['fat'],
            protein: acc['protein'] + currItem['protein'],
        }
    },{ calories: 0, carbs: 0, fat: 0, protein: 0 })


    // 三大營養素只取四捨五入小數點後1位
    const finalTotalNutrition = {
        calories : Number(totalNutrition['calories'].toFixed(1)),
        carbs : Number(totalNutrition['carbs'].toFixed(1)),
        fat : Number(totalNutrition['fat'].toFixed(1)),
        protein : Number(totalNutrition['protein'].toFixed(1)),
    }



    const findproteinPrice = selectedProduct.protein.map((item) => {
        const product = getAllitem.find(p => p.title === item.title);
        
        return {
            title: item.title,
            totalPrice: ((product?.price || 0) - PROTEIN_DISCOUNT) * item.qty,
            qty: item.qty
        };
    });

    const findAddonPrice = selectedProduct.addOn.map((item) => {
        const product = getAllitem.find(p => p.title === item.title);
        return {
            title: item.title,
            totalPrice: product?.price * item.qty,
            qty: item.qty
        };
    });


    const totalProteinPrice = findproteinPrice.reduce((acc, item) => acc + item.totalPrice,0)
    const totalAddonPrice = findAddonPrice.reduce((acc, item) => acc + item.totalPrice,0)
    console.log('蛋白質加價：',totalProteinPrice)
    console.log('加購價：',totalProteinPrice)
    console.log("findproteinPrice",findproteinPrice)
    console.log("findAddonPrice",findAddonPrice)

    const finalPrice = CUSTOM_PRICE + totalProteinPrice + totalAddonPrice;

    // 選擇單一食材的時候觸發
    const pickProduct = (e) => {
        const { name , value , checked } = e.target
        if(checked){
            if(selectedProduct[name].length >= maxCount[name]){
                e.target.checked = false
                return;
            }
            const isExist = selectedProduct[name].some(item => item.title === value);
            if (isExist) return;

            setSelectedProduct((pre) => ({
                ...pre,
                [name]: [...pre[name],{ title : value, qty: 1 }]
            }))
        }else{
            setSelectedProduct((pre) => ({
                ...pre,
                [name]: [...pre[name].filter(i => i.title !== value)]
            }))
        }

    }

    // 選擇多數食材的時候觸發
    const editQty = ( title, type) => {

        const list = selectedProduct[activeTab];
        const maxQty = list.reduce((sum, item) => sum + item.qty, 0)

        if( type === 1 && maxQty >= maxCount[activeTab]){
            alert('請先取消一個，再加購')
            return;
        }

        setSelectedProduct((pre) => {
            const list = pre[activeTab];
            let findData = false;
            
            const newList = list.map((item) => {
                if(item.title === title){
                    findData = true;
                    return{
                        ...item,
                        qty :  type === 1 ? item.qty + 1 : item.qty - 1 
                    }
                }
                return item;
            }).filter(item => item.qty > 0)

            if(!findData && type === 1){
                newList.push({ title , qty : 1 })
            }

            return{
                ...pre,
                [activeTab]: newList
            }

        })


    }



    // 上一步按鈕的判斷
    const handlePrevBtn = () => {
        if(stepState === 3){
            setStepState(2)
        }else if(stepState === 2){
            const currentIndex = CATEGORY_TABS.indexOf(activeTab);
            if( currentIndex  > 0 ){
                setActiveTab(CATEGORY_TABS[currentIndex - 1]);
            }else{
                const isLeave = window.confirm("回首頁將會清空所有選擇，確定要離開嗎？");
                if(isLeave){
                    setSelectedProduct(INITIAL_SELECTED_PRODUCT);
                    setStepState(1);
                    setAddonTabs('base');
                }
            }
        }
    }


    // 下一步按鈕的判斷
    const handleNextBtn = () => {
        if(stepState === 1){
            if(!selectedProduct.plan_type){
                alert("請選擇套餐");
                return;
            }
            setStepState(2);
        }else if(stepState === 2){

            const currentIndex = CATEGORY_TABS.indexOf(activeTab);
            if( currentIndex < CATEGORY_TABS.length -1 ){
                setActiveTab(CATEGORY_TABS[currentIndex + 1])
            }else{
                const exceptAddOn = CATEGORY_TABS.filter(tab => tab !== 'addOn')
                const underTarget = exceptAddOn.find(item => totalQty(item) !== maxCount[item])
                if(underTarget){
                    setActiveTab(underTarget)
                    alert('您選擇的數量未達標')
                }else{
                    setStepState(3)
                }
            }
        }
    }



    



    return (
        <main className="custom-main">
            <div className="custom-bg">
                <div className="container " style={{ 
                        height: "calc(99vh - 10px)",     
                        maxHeight: "calc(100vh - 108px)",   
                        overflow: "hidden",  
                    }}>

                    
                    {/*自由配 banner*/}
                    { stepState === 0 && 
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <section className=" py-5 text-center ">
                                <h1 className="mb-5">$149 <span>起</span> 隨心自由配</h1>
                                <button className="btn btn-primary" onClick={() => setStepState( stepState + 1 )}>立即自由配</button>
                            </section>
                        </div>
                    }
                    

                    {/* step1 選擇套餐 */}
                    { stepState === 1 && 
                        <section className="blur-bg py-5 h-100 position-relative py-10 px-3 ">

                            <Stepper stepState={stepState}/>
                            
                            <div className="d-flex mb-5 " style={{marginTop:"130px"}}>
                                <div className="">
                                    <h2>Step1 <br/>選擇套餐</h2>
                                    <p>選擇今日最適合你的飲食偏好</p>
                                </div>
                                <div className="d-flex gap-5 p-5 ms-10" >
                                    <div className="form-check p-4">
                                        <input className="form-check-input" type="radio" name="plan_type" id="light" value="light" onClick={pickType}/>
                                        <label className="form-check-label" htmlFor="light">
                                            <div className="card">
                                                <div className="card-body">
                                                    輕食
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="form-check p-4">
                                        <input className="form-check-input" type="radio" name="plan_type" id="balanced" value="balanced" onClick={pickType}/>
                                        <label className="form-check-label" htmlFor="balanced">
                                            <div className="card">
                                                <div className="card-body">
                                                    均衡
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="form-check p-4">
                                        <input className="form-check-input" type="radio" name="plan_type" id="highProtein" value="highProtein" onClick={pickType}/>
                                        <label className="form-check-label" htmlFor="highProtein">
                                            <div className="card">
                                                <div className="card-body">
                                                    高蛋白
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="mx-auto " style={{width:"200px"}}>
                                <div className="text-end bg-white rounded">
                                    <button className="btn fs-3" onClick={handleNextBtn}>
                                        <i className="bi bi-arrow-right-circle-fill"></i>
                                    </button>
                                </div>
                            </div>

                        </section>
                    }
                    


                    {/* step2 開始自由配 */}
                    { stepState === 2 && 
                        <section className="blur-bg py-5 h-100 position-relative py-10 px-3 " >
                            <Stepper stepState={stepState}/>

                            <div className="d-flex mb-5 ">
                                <div className="">
                                    <h2>Step2 <br/>開始自由配</h2>
                                    <p>請打造專屬於您的自由配餐點</p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-2">
                                    <div>
                                        <button className="btn btn-secondary-100 my-2" onClick={()=>setActiveTab('base')}>
                                            基底 {totalQty("base")}/{limit.base_limit}
                                        </button>
                                    </div>
                                    <div>
                                        <button className="btn btn-secondary-100 my-2" onClick={()=>setActiveTab('protein')}>
                                            蛋白質 {totalQty("protein")}/{limit.protein_limit}
                                        </button>
                                    </div>
                                    <div>
                                        <button className="btn btn-secondary-100 my-2" onClick={()=>setActiveTab('side')}>
                                            配菜 {totalQty("side")}/{limit.side_limit}
                                        </button>
                                    </div>
                                    <div>
                                        <button className="btn btn-secondary-100 my-2" onClick={()=>setActiveTab('sauce')}>
                                            醬料 {totalQty("sauce")}/{limit.sauce_limit}
                                        </button>
                                    </div>
                                    <div>
                                        <button className="btn btn-secondary-100 my-2" onClick={()=>setActiveTab('addOn')}>
                                            其他加購 
                                        </button>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="row row-cols-3">
                                        {activeTab === 'addOn'
                                            ? <div className="w-100">
                                                <div className="text-center mb-5">
                                                    <button className="btn btn-accent-100 mx-2" onClick={() => setAddonTabs('base')}>基底</button>
                                                    <button className="btn btn-accent-100 mx-2" onClick={() => setAddonTabs('protein')}>蛋白質</button>
                                                    <button className="btn btn-accent-100 mx-2" onClick={() => setAddonTabs('side')}>配菜</button>
                                                    <button className="btn btn-accent-100 mx-2" onClick={() => setAddonTabs('sauce')}>醬料</button>
                                                </div>
                                                <div className="row row-cols-3">
                                                    {renderaddOnItemList .map(item => (
                                                        <div className="col ">
                                                            <ItemCard 
                                                                name={addOnTabs}
                                                                value={item.title} 
                                                                id={item.id}
                                                                onChange={(e)=>pickProduct(e)}
                                                                checked={selectedProduct.addOn.some(i => i.title === item.title) || false}
                                                                imgUrl={item.imageUrl}
                                                                onClickPlus={() => editQty(item.title , 1)}
                                                                onClickMins={() => editQty(item.title , 0)}
                                                                qty={itemQty(item.title)}
                                                                price={item.price}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            :  renderItemList.map((item) => (
                                                <div className="col" key={item.id}>
                                                {maxCount[activeTab] <= 1 
                                                ? <div className="form-check">
                                                    <input 
                                                        className="form-check-input hidden-input" 
                                                        type="checkbox" name={activeTab} 
                                                        value={item.title} 
                                                        id={item.id}
                                                        onChange={(e)=>pickProduct(e)}
                                                        checked={selectedProduct[activeTab].some(i => i.title === item.title) || false}
                                                    />
                                                    <label className="form-check-label w-100" htmlFor={item.id}>
                                                        <div className={`card p-2 ${selectedProduct[activeTab].some(i => i.title === item.title) ? "card-active": ""}`}>
                                                            <div className="d-flex justify-content-center align-items-center gap-2">
                                                                <div style={{width:"40px",height:"40px",}} alt="" >
                                                                    <img className="w-100 h-100" src={item.imageUrl} 
                                                                    style={{borderRadius:"50%"}}/>
                                                                </div>
                                                                <p>{item.title}</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                                : 
                                                <ItemCard 
                                                    name={activeTab}
                                                    value={item.title} 
                                                    id={item.id}
                                                    onChange={(e)=>pickProduct(e)}
                                                    checked={selectedProduct[activeTab].some(i => i.title === item.title) || false}
                                                    imgUrl={item.imageUrl}
                                                    onClickPlus={() => editQty(item.title , 1)}
                                                    onClickMins={() => editQty(item.title , 0)}
                                                    qty={itemQty(item.title)}
                                                    price={item.price}

                                                    />
                                                
                                                }
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <p>熱量：{finalTotalNutrition.calories}</p>
                                            <p>蛋白質：{finalTotalNutrition.protein}</p>
                                            <p>碳水：{finalTotalNutrition.carbs}</p>
                                            <p>脂肪：{finalTotalNutrition.fat}</p>
                                        </div>
                                    </div>
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <h6>已選品項</h6>
                                            <p>基底：{selectedProduct.base.map(i => i.title).join('、')}</p>
                                            <p>蛋白質：{selectedProduct.protein.map(i => i.title).join('、')}</p>
                                            <p>配菜：{selectedProduct.side.map(i => i.title).join('、')}</p>
                                            <p>醬料：{selectedProduct.sauce.map(i => i.title).join('、')}</p>
                                            <p>加購：{selectedProduct.addOn.map(i => i.title).join('、')}</p>
                                        </div>
                                    </div>
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <p>總金額：${finalPrice}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            <div className="text-center" >
                                {activeTab === 'protein' && 
                                    <p className="text-danger mb-3">套餐含{maxCount[activeTab]}份 $30 蛋白質，依照選擇將自動補差額</p>
                                }
                                <div className="d-flex justify-content-between bg-white rounded mx-auto" style={{width:"200px"}}>
                                    <button className="btn fs-3" onClick={handlePrevBtn}>
                                        <i className="bi bi-arrow-left-circle-fill"></i>
                                    </button>
                                    <button className="btn fs-3" onClick={handleNextBtn}>
                                        <i className="bi bi-arrow-right-circle-fill"></i>
                                    </button>
                                </div>
                            </div>

                        </section>
                    }

                    {/* step3 確認餐點 */}
                    { stepState === 3 && 
                        <section className="blur-bg py-5 h-100 position-relative py-10 px-3" >

                            <Stepper stepState={stepState}/>
                            
                            <div className="d-flex mb-5" >
                                <div className="">
                                    <h2>Step3 <br/>確認您的餐點</h2>
                                    <p>查看您的餐點明細，確認後按下加入購物車</p>
                                </div>
                                <div className="d-flex gap-5 p-5">
                                    
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-1">
                                    <button className="btn fs-3" onClick={()=> setStepState(stepState - 1)}>
                                        <i className="bi bi-arrow-left-circle-fill"></i>
                                    </button>
                                </div>
                                <div className="col-8">
                                    <div class="card">
                                        <div class="card-body">
                                            <h3>高蛋白 x 自由配</h3>
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">類別</th>
                                                        <th scope="col">內容</th>
                                                        <th scope="col">加購價</th>
                                                        <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td scope="row">基底</td>
                                                        {selectedProduct.base.map(p => (
                                                            <td>{p.title}</td>
                                                        ))}
                                                        <td>-</td>
                                                        <td>
                                                            <button className="btn">
                                                                <i class="bi bi-pencil"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td scope="row">蛋白質</td>
                                                        <td>
                                                        {findproteinPrice.map((p,index) => (
                                                            <div className="d-flex ">
                                                                <p key={`${p.title}-${index}`}>{p.title}</p>
                                                                <p className="ms-5">{p.qty > 1 ? `x${p.qty}` : " "}</p>
                                                            </div>
                                                        ))}
                                                        </td>
                                                        <td>
                                                        {findproteinPrice.map((p,index) => (
                                                            <p key={`${p.title}-${index}`}>{p.totalPrice > 0 ? `$${p.totalPrice}` : "-"}</p>
                                                        ))}
                                                        </td>
                                                        <td>
                                                            <button className="btn">
                                                                <i class="bi bi-pencil"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td scope="row">配菜</td>
                                                        <td>
                                                        {selectedProduct.side.map((p,index) => (
                                                            <div className="d-flex">
                                                                <p  key={`${p.title}-${index}`}>{p.title}</p>
                                                                <p className="ms-5">{p.qty > 1 ? `x${p.qty}` : " "}</p>
                                                            </div>
                                                            
                                                        ))}
                                                        </td>
                                                        <td>-</td>
                                                    </tr>
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <p>熱量：{finalTotalNutrition.calories}</p>
                                            <p>蛋白質：{finalTotalNutrition.protein}</p>
                                            <p>碳水：{finalTotalNutrition.carbs}</p>
                                            <p>脂肪：{finalTotalNutrition.fat}</p>
                                        </div>
                                    </div>
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <p>總金額：${finalPrice}</p>
                                        </div>
                                    </div>
                                </div>

                                
                            </div>
                            

                            
                        

                        </section>
                    }
                    

                </div>

            </div>
        </main>
    )
}