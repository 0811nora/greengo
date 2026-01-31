import { useEffect, useState } from "react";
import { getAllProducts,postAddToCart,getCart } from "../api/ApiClient";

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
const CHECK_ID = ["a","b","c","d","e"]
const INITIAL_SELECTED_PRODUCT = {
    plan_type: "",
    base: [],
    protein: [],
    side: [],
    sauce: [],
    addOn: []
};
const PLAN_NAME = {
    light: "輕食" ,
    balanced: "均衡" ,
    highProtein: "高蛋白"
}

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
        console.log('allProducts:', allProducts)
    },[selectedProduct,allProducts])


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
    console.log("getAllitem",getAllitem)
    console.log("getCustom",getCustom)
    console.log("renderaddOnItemList",renderaddOnItemList)
    console.log("renderItemList",renderItemList)
    


    // 選擇套餐類別時，取得限制的數量
    const pickType = (e) => {
        const targetData = getCustom.find(item => item.content.plan_type === e.target.value);
        const { unit , id , content } = targetData
        setLimit(content);
        setSelectedProduct((pre)=>({
            ...pre,
            plan_type: e.target.value,
            productId: id,
            productTag: unit
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

    console.log(finalTotalNutrition)



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
    console.log('加購價：',totalAddonPrice)
    console.log("findproteinPrice",findproteinPrice)
    console.log("findAddonPrice",findAddonPrice)

    const finalPrice = CUSTOM_PRICE + totalProteinPrice + totalAddonPrice;

    // 選擇單一食材的時候觸發
    const pickProduct = (e,price,category,id) => {
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
                [name]: [...pre[name],{ id: id, title : value, qty: 1 , price: price ,type: category }]
            }))
        }else{
            setSelectedProduct((pre) => ({
                ...pre,
                [name]: [...pre[name].filter(i => i.title !== value)]
            }))
        }

    }

    // 選擇多數食材的時候觸發
    const editQty = ( title, type ,price, category ,id) => {

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
                        id: id,
                        qty :  type === 1 ? item.qty + 1 : item.qty - 1 ,
                        price: price,
                        type: category
                    }
                }
                return item;
            }).filter(item => item.qty > 0)

            if(!findData && type === 1){
                newList.push({ title , id: id, qty : 1 , price: price, type: category})
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



    const handleSendCart = async() => {

        try{
            const cartRes = await getCart();
            console.log(cartRes.data.data.carts)

            const cartList = cartRes.data.data.carts
            const currentType = selectedProduct.plan_type

            const usedTag = cartList
                .filter(item => item.product.unit.startsWith(currentType))
                .map(item => item.product.unit);

            const availLetter = CHECK_ID.find(letter => {
                const fullTag = `${currentType}-${letter}`;
                return !usedTag.includes(fullTag);
            })

            const findTag = `${currentType}-${availLetter}`;
            const productId = getCustom.find( item => item.unit === findTag).id

            const addOnData = selectedProduct['addOn'].reduce((acc ,item) => {
                if(!acc[item.type])acc[item.type] = [];
                const { title , qty, price} = item
                acc[item.type].push({title , qty, price})

                return acc;
            },{})

            const finalData = {
                product_id: productId,
                qty: 1,
                customizations: {
                    plan_info: {
                        plan_type: selectedProduct['plan_type'],
                        base_price: CUSTOM_PRICE
                    },
                    included: {
                        base: selectedProduct['base'],
                        protein: selectedProduct['protein'],
                        side: selectedProduct['side'],
                        sauce: selectedProduct['sauce'],
                    },
                    addon: addOnData,
                    extra_price: totalAddonPrice + totalProteinPrice,  
                    custom_total: finalPrice, 
                    total_nutrition: {
                        calories: finalTotalNutrition['calories'],
                        protein: finalTotalNutrition['protein'],
                        fat: finalTotalNutrition['fat'],
                        carbs: finalTotalNutrition['carbs'],
                    }
                }       
            }

            console.log(finalData)

            const addCartRes = await postAddToCart(finalData);
            console.log(addCartRes.data.message)
        }catch(err){
            console.log(err)
        }


    }




    



    return (
        <main className="custom-main">
            <div className="custom-bg">
                <div className="bg-overlay">
                    <div style={{height:"100px"}}></div>
                    <div className="container" style={{ 
                            height: "calc(99vh - 10px)",     
                            maxHeight: "calc(100vh - 108px)",   
                            overflow: "hidden",  
                        }}>


                        {/*自由配 banner*/}
                        { stepState === 0 && 
                            <div className="banner-bg d-flex justify-content-center align-items-center h-100">
                                <section className=" py-5 text-center ">
                                    <h1 className="mb-5">$149 <span>起</span> 隨心自由配</h1>
                                    <button className="btn btn-primary" onClick={() => setStepState( stepState + 1 )}>立即自由配</button>
                                </section>
                            </div>
                        }
                        

                        {/* step1 選擇套餐 */}
                        { stepState === 1 && 
                            <section className="blur-bg py-5 h-100 position-relative py-10 px-3 com_bor_radius">

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
                                                            <div className="col " key={item.id}>
                                                                <ItemCard 
                                                                    name={addOnTabs}
                                                                    value={item.title} 
                                                                    id={item.id}
                                                                    onChange={(e)=>pickProduct(e,item.price,item.product_type,item.id)}
                                                                    checked={selectedProduct.addOn.some(i => i.title === item.title) || false}
                                                                    imgUrl={item.imageUrl}
                                                                    onClickPlus={() => editQty(item.title , 1 ,item.price,item.product_type,item.id)}
                                                                    onClickMins={() => editQty(item.title , 0 ,item.price,item.product_type,item.id)}
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
                                                            onChange={(e)=>pickProduct(e,item.price,item.product_type,item.id)}
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
                                                        onChange={(e)=>pickProduct(e,item.price,item.product_type,item.id)}
                                                        checked={selectedProduct[activeTab].some(i => i.title === item.title) || false}
                                                        imgUrl={item.imageUrl}
                                                        onClickPlus={() => editQty(item.title , 1 ,item.price,item.product_type,item.id)}
                                                        onClickMins={() => editQty(item.title , 0 ,item.price,item.product_type,item.id)}
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
                                        {/* ！！！！！拉出來做元件！！！！！ */}
                                        <div class="card p-6">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <h4>{PLAN_NAME[selectedProduct.plan_type]} x 自由配</h4>
                                                    {CATEGORY_TABS.filter(tab => tab !== "addOn" && selectedProduct[tab].length > 0).map(tab => {
                                                        const titleName = {
                                                            base:"基底",
                                                            protein: "蛋白質",
                                                            side: "配菜",
                                                            sauce: "醬料"
                                                        }
                                                        return(
                                                            <div className="d-flex gap-3 mb-4">
                                                            <div>{titleName[tab]}</div>
                                                            <div className="d-flex flex-column">
                                                                {selectedProduct[tab].map(p => {
                                                                    
                                                                    const basePrice = p.price || 0;
                                                                    const isPayable = tab === "protein" || tab === "addOn"
                                                                    let displayPrice = "-"
                                                                    if(isPayable){
                                                                        const finalPrice = tab === "protein"
                                                                            ? (basePrice - PROTEIN_DISCOUNT) * p.qty
                                                                            : basePrice * p.qty
                                                                        displayPrice = finalPrice > 0 ? `$${finalPrice}` : "-"
                                                                    }
                                                                    
                                                                    return(
                                                                        <div className="d-flex gap-3">
                                                                            <p>{p.title}</p> 
                                                                            <p>{p.qty}</p>
                                                                            <p>{displayPrice}</p>
                                                                            <button className="btn" onClick={()=>{
                                                                                setActiveTab(tab);
                                                                                setStepState(2);
                                                                            }}><i class="bi bi-pencil"></i></button>
                                                                        </div>
                                                                    )
                                                                    
                                                                })}
                                                            </div>
                                                        </div>
                                                        )
                                                    })}
                                                </div>
                                                <div>
                                                    <div className="d-flex">
                                                        <h4>加購</h4>
                                                        <div><button className="btn btn-primary-100" onClick={()=>{
                                                            setActiveTab('addOn');
                                                            setStepState(2);
                                                        }}>編輯加購選項</button></div>
                                                    </div>
                                                    {selectedProduct["addOn"].map( p => (
                                                        <div className="d-flex gap-3">
                                                            <p>{p.title}</p> 
                                                            <p>{p.qty}</p>
                                                            <p>${p.price * p.qty}</p>
                                                            <button className="btn" onClick={ () =>
                                                                setSelectedProduct( (pre) => ({
                                                                    ...pre,
                                                                    addOn: pre.addOn.filter( i => i.title !== p.title)
                                                                }))
                                                            }><i class="bi bi-trash-fill"></i></button>
                                                        </div>
                                                    ))}
                                                </div>
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
                                                <p>自由配：${CUSTOM_PRICE}</p>
                                                <p>自由配加價：${totalProteinPrice}</p>
                                                <p>加購品項：${totalAddonPrice}</p>
                                                <p>總金額：${finalPrice}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <button className="btn btn-primary w-100" onClick={handleSendCart}>加入購物車</button>
                                        </div>
                                    </div>

                                    
                                </div>

                            </section>
                        }
                        

                    </div>

                </div>
            </div>
        </main>
    )
}