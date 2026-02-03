import { useEffect, useState } from "react";
import { getAllProducts,postAddToCart,getCart } from "../api/ApiClient";
import { PageSwitch} from '../components/Custom-comp/AnimationWrapper';

import AdmButton from "../components/admin/common/AdmButton";

import ItemCard from "../components/Custom-comp/itemCard";
import HighlightLine from "../components/Custom-comp/HighlightLine";
import Stepper from "../components/Custom-comp/Stepper";
import PickTypeCard from "../components/Custom-comp/PickTypeCard";

import lightBG from "../assets/image/custom/lightBG.jpg";
import balancedBG from "../assets/image/custom/balancedBG.jpg";
import highProteinBG from "../assets/image/custom/highProteinBG.jpg";
import TypeListBtn from "../components/Custom-comp/TypeListBtn";
import DonutPFC from "../components/Custom-comp/PFC_Chart";

import baseIcon from "../assets/image/custom/icons8-rice-bowl-50.png";
import meatIcon from "../assets/image/custom/icons8-meat-50.png";
import sideIcon from "../assets/image/custom/icons8-broccoli-50.png";
import sauceIcon from "../assets/image/custom/icons8-sauce-53.png";
import addOnIcon from "../assets/image/custom/icons8-cutlery-32.png";







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
    const [ isOpenOrderModal , setIsOpenOrderModal] = useState(false);




    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);



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


    // 計算三大營養素的百分比
    const pfcRatio = () => {
        const { carbs , protein , fat , calories } = finalTotalNutrition;

        const total = carbs + protein + fat;
        if (total === 0) return { carbs: 0, fat: 0, protein: 0 };

        const result = {
            calories: Math.round(calories),
            carbs : Math.round((carbs / total ) * 100),
            fat : Math.round(( fat / total ) * 100),
            protein : Math.round((protein / total ) * 100),
        }
        return result;
    }



    // 找出蛋白質加價的總金額
    const findproteinPrice = selectedProduct.protein.map((item) => {
        const product = getAllitem.find(p => p.title === item.title);
        
        return {
            title: item.title,
            totalPrice: ((product?.price || 0) - PROTEIN_DISCOUNT) * item.qty,
            qty: item.qty
        };
    });

    // 找出加購商品加價的總金額
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

    // 送購物車的資料
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

    // 整合單品卡片的資料再渲染
    const renderItemCards = (list, tabName) => {
        return list.map((item) => {
            const isSingle = maxCount[tabName] <= 1;
            const isSide = tabName === "side";

            const isLightProtein = selectedProduct.plan_type === 'light' && tabName === 'protein';

            let currentMode = "plural";
            
            if (isLightProtein) {
                currentMode = "priceOnly"; 
            } else if (tabName === "addOn") {
                currentMode = "plural"; 
            } else if (isSingle) {
                currentMode = "single";
            } else if (isSide) {
                currentMode = "pluralNoNum";
            }

            const isChecked = tabName === "addOn"
                ? selectedProduct.addOn.some(i => i.title === item.title)
                : selectedProduct[tabName]?.some(i => i.title === item.title) || false;

            return (
                <div className="col" key={item.id}>
                    <ItemCard 
                        name={tabName === "addOn" ? addOnTabs : tabName} 
                        value={item.title} 
                        id={item.id}
                        imgUrl={item.imageUrl}
                        price={item.price}
                        mode={currentMode}
                        checked={isChecked}
                        qty={itemQty(item.title)}
                        onChange={(e) => pickProduct(e, item.price, item.product_type, item.id)}
                        onClickPlus={() => editQty(item.title, 1, item.price, item.product_type, item.id)}
                        onClickMins={() => editQty(item.title, 0, item.price, item.product_type, item.id)}
                        detail={{
                            grams: item.grams,
                            calories: item.nutrition.calories,
                            carbs: item.nutrition.carbs,
                            fat: item.nutrition.fat,
                            protein: item.nutrition.protein,
                        }}
                    />
                </div>
            );
        });
    };

    





    return (
        <main className="custom-main">
            <div className="custom-bg">
                <div className="bg-overlay">
                    <div style={{height:"100px"}}></div>
                    <div className="container banner-container">

                        <PageSwitch nodeKey={stepState}>
                        {/*自由配 banner*/}
                        { stepState === 0 && 
                            <div className=" d-flex justify-content-center align-items-center" style={{ height: "calc(100vh - 100px)"}}>
                                <section className=" py-5 text-center tracking-in-contract overflow-hidden" >
                                    <h1 className="mb-5 fs-1 c-fs-lg-80  mb-8 ">
                                        <span className="position-relative d-inline-block">
                                        <span className="text-price fw-bold"style={{ position: 'relative', zIndex: 2 }}>$149 </span>
                                        <span className="fs-2" style={{ position: 'relative', zIndex: 2 }}>起</span> 
                                        <HighlightLine color="#edd749d0" strokeWidth={13} />
                                        </span>
                                        

                                        <br />
                                        <span className="fw-bolder">隨心自由配</span>
                                    </h1>
                                    <AdmButton
                                        onClick={() => setStepState( stepState + 1 )}
                                        text={'立即自由配'}
                                        size={'lg'}
                                        className={'btn-primary py-2 px-7 px-lg-8  fs-lg-6 rounded-5 wobble-hor-bottom'}
                                    />
                                </section>
                            </div>
                        }
                        

                        { stepState > 0 && 
                        <div className="blur-bg h-100 mb-4 com_bor_radius position-relative">
                            <Stepper stepState={stepState}/>

                        {/* step1 選擇套餐 */}

                        { stepState === 1 && 
                            <section className="  h-100 py-10 px-8 overflow-hidden " >
                                <div className=" h-100 d-flex flex-column flex-lg-row justify-content-center align-items-center justify-content-lg-between mb-8 c-mt-lg-60 mt-6" >
                                    <div className="text-center text-lg-start " style={{width:"300px"}}>
                                        <h2 className=" mb-lg-6 fs-lg-1 fs-2 py-4">
                                            <span className="  mb-3 text-orange-10">Step1 </span><br/>
                                            <span className=" text-primary">選擇套餐</span></h2>
                                        <p className="text-brown-300  fw-bold">選擇今日最適合你的飲食偏好</p>
                                    </div>
                                    <div className=" step1-card-area d-flex p-3 justify-content-lg-center d-flex flex-column flex-lg-row justify-content-center align-items-center ">
                                        <PickTypeCard 
                                            selectedValue={selectedProduct.plan_type} 
                                            onSelect={setSelectedProduct}              
                                            typeText="light"
                                            bgImage={lightBG}                      
                                            sourceData={getCustom}                     
                                            onLimitChange={setLimit}
                                            title="輕食"
                                            describe={<>少負擔高蔬食 <br />適合想吃清爽的你</>}
                                            num={{base: 1,protein: 1,side: 6,sauce: 1,}}
                                        />

                                        <PickTypeCard 
                                            selectedValue={selectedProduct.plan_type} 
                                            onSelect={setSelectedProduct}              
                                            typeText="balanced"
                                            bgImage={balancedBG}                                
                                            sourceData={getCustom}                     
                                            onLimitChange={setLimit}
                                            title="均衡"
                                            describe={<>一餐搞定 <br />適合想簡單均衡的你</>}
                                            num={{base: 1,protein: 2,side: 5,sauce: 1,}}
                                        />

                                        <PickTypeCard 
                                            selectedValue={selectedProduct.plan_type} 
                                            onSelect={setSelectedProduct}              
                                            typeText="highProtein"  
                                            bgImage={highProteinBG}                              
                                            sourceData={getCustom}                     
                                            onLimitChange={setLimit}
                                            title="高蛋白"
                                            describe={<>蛋白滿滿 <br />適合愛健身的你</>}
                                            num={{base: 1,protein: 3,side: 3,sauce: 1,}}
                                        />
    
                                    
                                    </div>
                                </div>

                                
                                <div className="text-center position-absolute bottom-0 start-50 translate-middle-x mb-lg-8 mb-6 w-100 px-6" >
                                    <AdmButton
                                        onClick={handleNextBtn}
                                        text={"下一步"}
                                        size={'lg'}
                                        className={'btn-primary  px-10  py-2  rounded-5'}
                                    />
                                </div>

                            </section>
                        }
                        

                        {/* step2 開始自由配 */}
                        { stepState === 2 && 
                            <section className="  h-100 py-8 px-8 overflow-hidden " >

                                <div className="text-center text-lg-start mb-lg-3 position-relative" >
                                    <h2 className=" mb-lg-3 fs-lg-2 fs-4 ">
                                        <span className="  mb-2 text-orange-10">Step2 </span><br/>
                                        <span className=" text-primary">開始自由配</span></h2>
                                    <p className="text-brown-300  fw-bold">請打造專屬於您的自由配餐點</p>
                                    {activeTab === 'protein' && 
                                        <p className="text-brown-300 position-absolute top-100 start-50 translate-middle pb-5  "
                                            >
                                            套餐含 {maxCount[activeTab]} 份 $30 蛋白質，依照選擇將自動補差額
                                            
                                        </p>

                                    }
                                    {activeTab === 'addOn' &&    
                                        <div className="text-center mb-5 position-absolute top-100 start-50 translate-middle pb-6">
                                                <ul className="nav nav-tabs justify-content-center border-0 mb-5">
                                                    {['base', 'protein', 'side', 'sauce'].map((tab) => (
                                                        <li className="nav-item" key={tab}>
                                                            <button 
                                                                className={`nav-link border-0 px-6 position-relative ${ 
                                                                    addOnTabs === tab ? 'border-bottom border-3 border-primary active fw-bold' : 'text-muted'
                                                                }`}
                                                                style={{ background: 'transparent' }}
                                                                onClick={() => setAddonTabs(tab)}
                                                            >
                                                                {tab === 'base' ? '基底' : tab === 'protein' ? '蛋白質' : tab === 'side' ? '配菜' : '醬料'}
                                                            
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                    }
                                </div>

                                <div className="row ">
                                    <div className="col-2">
                                        <div className="my-3">
                                            <TypeListBtn 
                                                text={"基底"} 
                                                num={<>{totalQty('base')}/{limit.base_limit}</>}
                                                imageUrl={baseIcon}    
                                                onClick={()=>setActiveTab('base')}
                                                classActive={activeTab === "base" ? "c-typeButton-active" : ""}
                                            />
                                        </div>
                                        <div className="my-3">
                                            <TypeListBtn 
                                                text={"蛋白質"} 
                                                num={<>{totalQty('protein')}/{limit.protein_limit}</>}
                                                imageUrl={meatIcon}    
                                                onClick={()=>setActiveTab('protein')}
                                                classActive={activeTab === "protein" ? "c-typeButton-active" : ""}
                                            />
                                        </div>
                                        <div className="my-3">
                                            <TypeListBtn 
                                                text={"配菜"} 
                                                num={<>{totalQty('side')}/{limit.side_limit}</>}
                                                imageUrl={sideIcon}    
                                                onClick={()=>setActiveTab('side')}
                                                classActive={activeTab === "side" ? "c-typeButton-active" : ""}
                                            />
                                        </div>
                                        <div className="my-3">
                                            <TypeListBtn 
                                                text={"醬料"} 
                                                num={<>{totalQty('sauce')}/{limit.sauce_limit}</>}
                                                imageUrl={sauceIcon}    
                                                onClick={()=>setActiveTab('sauce')}
                                                classActive={activeTab === "sauce" ? "c-typeButton-active" : ""}
                                            />
                                        </div>
                                        <div className="my-3">
                                            <TypeListBtn 
                                                text={"加購"} 
                                                num={null}
                                                imageUrl={addOnIcon}    
                                                onClick={()=>setActiveTab('addOn')}
                                                classActive={activeTab === "addOn" ? "c-typeButton-active" : ""}
                                            />
                                        </div>
                                    
                                    </div>
                                    <div className="col-8  h-100 ">
                                        <div className="row row-cols-3 px-8 pt-3 overflow-y-auto" style={{ height: '52vh' }}>
                                            {activeTab === 'addOn' ? (
                                                <div className="w-100 ">
                                                    <div  className="row row-cols-3">
                                                        {renderItemCards(renderaddOnItemList, "addOn")}
                                                    </div>
                                                </div>
                                            ) : (
                                                renderItemCards(renderItemList, activeTab)
                                            )}
                                        </div>

                                        
                                    </div>
                                    
                                    <div className="col-2">
                                        <div className="d-flex flex-column justify-content-between h-100">
                                            <div>
                                                <div className="mb-4">
                                                    <DonutPFC 
                                                        calories={pfcRatio().calories} 
                                                        protein={pfcRatio().protein} 
                                                        fat={pfcRatio().fat}  
                                                        carbs={pfcRatio().carbs} 
                                                    />
                                                </div>
                                                
                                                <div className="">
                                                    <div className="chart-list p-1 d-flex justify-content-between px-4 my-2">
                                                        <p>蛋白質</p>
                                                        <p>{finalTotalNutrition.protein}
                                                            <span className="fs-ssm"> g</span>
                                                        </p>
                                                    </div>
                                                    <div className="chart-list p-1 d-flex justify-content-between px-4 my-2">
                                                        <p>碳水</p>
                                                        <p>{finalTotalNutrition.carbs}
                                                            <span className="fs-ssm"> g</span>
                                                        </p>
                                                    </div>
                                                    <div className="chart-list p-1 d-flex justify-content-between px-4 my-2">
                                                        <p>脂肪</p>
                                                        <p>{finalTotalNutrition.fat}
                                                            <span className="fs-ssm"> g</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            


                                            <div className="mb-5 position-relative">
                                                
                                                <AdmButton
                                                    onClick={()=>setIsOpenOrderModal(true)}
                                                    text={"檢視餐點內容"}
                                                    size={'lg'}
                                                    className={'btn-outline-brown-300 py-2 border-2 fw-bold rounded-5  w-100'}
                                                />

                                                {isOpenOrderModal &&
                                                <div className="order-details  p-5 position-absolute  end-0  overflow-y-auto">
                                                    <i className="bi bi-x-circle-fill fs-5 position-absolute top-0 end-0 m-3" onClick={()=>setIsOpenOrderModal(false)}></i>
                                                        <div className="mb-4">
                                                            <h6 className="mb-4 text-center text-gray-500">{PLAN_NAME[selectedProduct.plan_type]} x 自由配</h6>
                                                            <div className="d-flex  gap-3 px-2  mb-1 fw-bold">
                                                                <p style={{width:"70px"}}>類別</p> 
                                                                <p style={{width:"80px"}}>內容</p>
                                                                <p className="text-center" style={{width:"40px"}}>數量</p>
                                                                <p className="text-center" style={{width:"50px"}}>加價</p>
                                                            </div>
                                                            <div className=" order-details-list ">
                                                            {CATEGORY_TABS.filter(tab => tab !== "addOn" && selectedProduct[tab].length > 0).map(tab => {
                                                                const titleName = {
                                                                    base:"基底",
                                                                    protein: "蛋白質",
                                                                    side: "配菜",
                                                                    sauce: "醬料"
                                                                }
                                                                return(
                                                                    <div className="d-flex gap-3 py-2">
                                                                    <div className="text-primary" style={{width:"70px"}}>{titleName[tab]}</div>
                                                                    <div className="d-flex flex-column ">
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
                                                                                <div className="d-flex  gap-3 ">
                                                                                    <p style={{width:"70px"}}>{p.title}</p> 
                                                                                    <p className="text-center" style={{width:"40px"}}>{p.qty}</p>
                                                                                    <p className="text-center" style={{width:"50px"}}>{displayPrice}</p>
                                                                                </div>
                                                                            )
                                                                            
                                                                        })}
                                                                    </div>
                                                                </div>
                                                                )
                                                            })}
                                                            
                                                            </div>
                                                            <div className="py-2 me-5">
                                                                <div className="d-flex justify-content-between px-2 mb-2">
                                                                    <p>自由配</p>
                                                                    <p>$ {CUSTOM_PRICE}</p>
                                                                </div>
                                                                <div className="d-flex justify-content-between px-2 mb-2">
                                                                    <p>自由配加價</p>
                                                                    <p>$ {totalProteinPrice}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-4 text-center text-gray-500">加購</h6>
                                                            <div className="d-flex  gap-3 px-2  mb-1 fw-bold">
                                                                <p style={{width:"145px"}}>內容</p>
                                                                <p className="text-center" style={{width:"40px"}}>數量</p>
                                                                <p className="text-center" style={{width:"80px"}}>價格</p>
                                                            </div>
                                                            <div className="order-details-list">
                                                                {selectedProduct["addOn"].map( p => (
                                                                    <div className="d-flex gap-4   py-2">
                                                                        <p className="text-primary" style={{width:"145px"}}>{p.title}</p> 
                                                                        <p className="text-center" style={{width:"40px"}}>{p.qty}</p>
                                                                        <p className="text-center" style={{width:"80px"}}>${p.price * p.qty}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="py-2 border-bottom">
                                                            <div className="d-flex justify-content-between px-3 mb-2 me-5">
                                                                <p>加購品項</p>
                                                                <p>$ {totalAddonPrice}</p>
                                                            </div>
                                                        </div>

                                                        <div className="py-2 ">
                                                            <div className="d-flex justify-content-between align-items-center px-3 mb-2 me-3">
                                                                <p className="fs-4 fw-bold ">總計</p>
                                                                <p className="fs-5 fw-bold text-orange-300">$ {finalPrice}</p>
                                                            </div>
                                                        </div>

                                                </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center" >
                                    <div className="d-flex justify-content-between bg-white rounded mx-auto" style={{width:"200px"}}>
                                        <div className="text-center position-absolute bottom-0 start-50 translate-middle-x mb-lg-8 mb-6" >
                                            <AdmButton
                                                onClick={handlePrevBtn}
                                                text={"上一步"}
                                                size={'lg'}
                                                className={'btn-gray-200  px-lg-10  py-2  rounded-5 mx-6'}
                                            />
                                            <AdmButton
                                                onClick={handleNextBtn}
                                                text={"下一步"}
                                                size={'lg'}
                                                className={'btn-primary  px-lg-10  py-2  rounded-5 mx-6'}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </section>
                        }

                        {/* step3 確認餐點 */}
                        { stepState === 3 && 
                            <section className="py-5 position-relative py-10 px-3" >

                                
                                
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
                        }
                        
                        
                        </PageSwitch>
                    </div>

                </div>
            </div>
        </main>
    )
}