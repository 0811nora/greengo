import { useEffect, useState } from "react";
import { getAllProducts,postAddToCart,getCart } from "../api/ApiClient";
import { PageSwitch} from '../components/custom-comp/AnimationWrapper';

import AdmButton from "../components/admin/common/AdmButton";
import ClickOutsideHandler from "../components/common/ClickOutsideHandler";

import ItemCard from "../components/custom-comp/itemCard";
import HighlightLine from "../components/custom-comp/HighlightLine";
import Stepper from "../components/custom-comp/Stepper";
import PickTypeCard from "../components/custom-comp/PickTypeCard";
import OrderList from "../components/custom-comp/OrderList";

import lightBG from "../assets/image/custom/lightBG.jpg";
import balancedBG from "../assets/image/custom/balancedBG.jpg";
import highProteinBG from "../assets/image/custom/highProteinBG.jpg";
import TypeListBtn from "../components/custom-comp/TypeListBtn";
import DonutPFC from "../components/custom-comp/PFC_Chart";

import baseIcon from "../assets/image/custom/icons8-rice-bowl-50.png";
import meatIcon from "../assets/image/custom/icons8-meat-50.png";
import sideIcon from "../assets/image/custom/icons8-broccoli-50.png";
import sauceIcon from "../assets/image/custom/icons8-sauce-53.png";
import addOnIcon from "../assets/image/custom/icons8-cutlery-32.png";
import { div } from "framer-motion/client";








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

const ProteinTip = ({mode,maxCount,activeTab}) => {
    return (
        <div className={`text-center ${ mode === "pc" ? "d-lg-block d-none" :" d-lg-none"}`}>
            <p className={`w-100 text-brown-300 pb-5  ${ mode === "pc" ? "position-absolute top-100 start-50 translate-middle ":"" }`}>
                套餐含 {maxCount[activeTab]} 份 $30 蛋白質，依照選擇將自動補差額
            </p>
        </div>
    )
}

const AddonTypeBtnGroup = ({addOnTabs,onAddonTab,mode}) => {
    return(
        <div className={ mode === "pc" ? "d-lg-block d-none" :" d-lg-none"}>
            <div className={`text-center pb-lg-6 mb-lg-5 ${mode === "pc" ?  "position-absolute top-100 start-50 translate-middle" : ""} `}>
                <ul className="nav nav-tabs  justify-content-center  border-0 mb-5">
                    {['base', 'protein', 'side', 'sauce'].map((tab) => (
                        <li className="nav-item" key={tab}>
                            <button 
                                className={`nav-link border-0 px-6 position-relative ${ 
                                    addOnTabs === tab ? 'border-bottom border-3 border-primary active fw-bold' : 'text-muted'
                                }`}
                                style={{ background: 'transparent' }}
                                onClick={() => onAddonTab(tab)}
                            >
                                {tab === 'base' ? '基底' : tab === 'protein' ? '蛋白質' : tab === 'side' ? '配菜' : '醬料'}
                            
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>  
    )
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

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };



    // 上一步按鈕的判斷
    const handlePrevBtn = () => {
        if(stepState === 3){
            setStepState(2)
            scrollToTop()
        }else if(stepState === 2){
            const isLeave = window.confirm("回首頁將會清空所有選擇，確定要離開嗎？");
            if(isLeave){
                setSelectedProduct(INITIAL_SELECTED_PRODUCT);
                setStepState(1);
                scrollToTop();
            }
            
             // (原本有判斷要使用上一步切頁籤，到好像不符合實際使用，但程式碼先保留)
            // const currentIndex = CATEGORY_TABS.indexOf(activeTab);
            // if( currentIndex  > 0 ){
            //     setActiveTab(CATEGORY_TABS[currentIndex - 1]);
            // }else{
            //     const isLeave = window.confirm("回首頁將會清空所有選擇，確定要離開嗎？");
            //     if(isLeave){
            //         setSelectedProduct(INITIAL_SELECTED_PRODUCT);
            //         setStepState(1);
            //         setAddonTabs('base');
            //         scrollToTop();
            //     }
            // }
        }
    }




    
    // 下一步按鈕的判斷
    const handleNextBtn = () => {
        if (stepState === 1) {
            if (!selectedProduct.plan_type) {
                alert("請選擇套餐");
                return;
            }
            setActiveTab('base');
            setAddonTabs('base');
            setStepState(2);
            scrollToTop();
        } else if (stepState === 2) {
            const requiredTabs = CATEGORY_TABS.filter(tab => tab !== 'addOn');
            const underTarget = requiredTabs.find(item => totalQty(item) !== maxCount[item]);

            if (underTarget) {
                setActiveTab(underTarget);
                const titleName = { base: "基底", protein: "蛋白質", side: "配菜", sauce: "醬料" };
                alert(`您的「${titleName[underTarget]}」選擇數量未達標，請檢查。`);
                scrollToTop();
            } else {
                setStepState(3);
                scrollToTop();
            }
        }
    };

    // 下一步按鈕的判斷 (原本有判斷要使用下一步切頁籤，到好像不符合實際使用，但程式碼先保留)
    // const handleNextBtn = () => {
    //     if(stepState === 1){
    //         if(!selectedProduct.plan_type){
    //             alert("請選擇套餐");
    //             return;
    //         }
    //         setAddonTabs('base');
    //         setStepState(2);
    //         scrollToTop();
    //     }else if(stepState === 2){

    //         const currentIndex = CATEGORY_TABS.indexOf(activeTab);
    //         if( currentIndex < CATEGORY_TABS.length -1 ){
    //             setActiveTab(CATEGORY_TABS[currentIndex + 1])
    //         }else{
    //             const exceptAddOn = CATEGORY_TABS.filter(tab => tab !== 'addOn')
    //             const underTarget = exceptAddOn.find(item => totalQty(item) !== maxCount[item])
    //             if(underTarget){
    //                 setActiveTab(underTarget);
    //                 alert('您選擇的數量未達標');
    //                 scrollToTop();
    //             }else{
    //                 setStepState(3)
    //                 scrollToTop();
    //             }
    //         }
    //     }
    // }

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
                        
                            <section className=" h-100  py-10 py-lg-4   px-lg-8 px-3  d-flex flex-column" >

                                <div className="flex-shrink-0 text-center text-lg-start mb-lg-3 position-relative  " >
                                    <h2 className=" mb-lg-3 fs-2 pt-6 pb-3 ">
                                        <span className="  mb-2 text-orange-10">Step2 </span><br/>
                                        <span className=" text-primary">開始自由配</span></h2>
                                    <p className="text-brown-300 fw-bold mb-4 mb-lg-0">請打造專屬於您的自由配餐點</p>
                                
                                    {activeTab === 'protein' && 
                                        <ProteinTip mode={"pc"} maxCount={maxCount} activeTab={activeTab}/>
                                    }
                                    {activeTab === 'addOn' &&    
                                        <AddonTypeBtnGroup mode={"pc"} addOnTabs={addOnTabs} onAddonTab={(tab) => setAddonTabs(tab)} />
                                    }
                                </div>

                                <div className="flex-grow-1  mb-3 overflow-hidden ">
                                    <div className="row h-100 g-0 m-0 flex-column flex-lg-row">
                                        <div className="col-lg-2 h-100 overflow-y-auto">
                                            <div className="d-flex  flex-lg-column gap-2 py-2 py-lg-2">
                                                <div className="">
                                                    <TypeListBtn 
                                                        text={"基底"} 
                                                        num={<>{totalQty('base')}/{limit.base_limit}</>}
                                                        imageUrl={baseIcon}    
                                                        onClick={()=>setActiveTab('base')}
                                                        classActive={activeTab === "base" ? "c-typeButton-active" : ""}
                                                    />
                                                </div>
                                                <div className="">
                                                    <TypeListBtn 
                                                        text={"蛋白質"} 
                                                        num={<>{totalQty('protein')}/{limit.protein_limit}</>}
                                                        imageUrl={meatIcon}    
                                                        onClick={()=>setActiveTab('protein')}
                                                        classActive={activeTab === "protein" ? "c-typeButton-active" : ""}
                                                    />
                                                </div>
                                                <div className="">
                                                    <TypeListBtn 
                                                        text={"配菜"} 
                                                        num={<>{totalQty('side')}/{limit.side_limit}</>}
                                                        imageUrl={sideIcon}    
                                                        onClick={()=>setActiveTab('side')}
                                                        classActive={activeTab === "side" ? "c-typeButton-active" : ""}
                                                    />
                                                </div>
                                                <div className="">
                                                    <TypeListBtn 
                                                        text={"醬料"} 
                                                        num={<>{totalQty('sauce')}/{limit.sauce_limit}</>}
                                                        imageUrl={sauceIcon}    
                                                        onClick={()=>setActiveTab('sauce')}
                                                        classActive={activeTab === "sauce" ? "c-typeButton-active" : ""}
                                                    />
                                                </div>
                                                <div className="">
                                                    <TypeListBtn 
                                                        text={"加購"} 
                                                        num={null}
                                                        imageUrl={addOnIcon}    
                                                        onClick={()=>setActiveTab('addOn')}
                                                        classActive={activeTab === "addOn" ? "c-typeButton-active" : ""}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-lg-8  h-100 overflow-y-auto py-4 py-lg-0">
                                            {activeTab === 'protein' && 
                                                <ProteinTip mode={"mobile"} maxCount={maxCount} activeTab={activeTab}/>
                                            }
                                            {activeTab === 'addOn' &&    
                                                <AddonTypeBtnGroup mode={"mobile"} addOnTabs={addOnTabs} onAddonTab={(tab) => setAddonTabs(tab)} />
                                            }

                                            <div className="row row-cols-2 row-cols-lg-3 px-lg-8 px-3 pt-3 g-0" >
                                                
                                                {activeTab === 'addOn' ? (
                                                    <div className="w-100 ">
                                                        <div  className="row row-cols-2 row-cols-lg-3">
                                                            {renderItemCards(renderaddOnItemList, "addOn")}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-100 ">
                                                        <div  className="row row-cols-2 row-cols-lg-3">
                                                            {renderItemCards(renderItemList, activeTab)}
                                                        </div>
                                                    </div>
                                                    
                                                )}
                                            </div>

                                            
                                        </div>
                                        
                                        <div className="col-lg-2 h-100 overflow-y-auto m-0">
                                            <div className="d-flex flex-column justify-content-between h-100">
                                                <div style={{  overflowX: 'hidden' }}>
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
                                                


                                                <div className=" position-relative">
                                                    
                                                    <AdmButton
                                                        onClick={()=>setIsOpenOrderModal(true)}
                                                        text={"檢視餐點內容"}
                                                        size={'lg'}
                                                        className={`${isOpenOrderModal ? "btn-brown-300" : "btn-outline-brown-300"} py-2 border-2 fw-bold rounded-5  w-100`}
                                                    />

                                                    
                                                
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                
                                    {isOpenOrderModal && (
                                        <OrderList 
                                            onClose={()=>setIsOpenOrderModal(false)}
                                            orderTitle={PLAN_NAME[selectedProduct.plan_type]}
                                            categoryTab={CATEGORY_TABS}
                                            selectedProduct={selectedProduct}
                                            discount={PROTEIN_DISCOUNT}
                                            basePrice={CUSTOM_PRICE}
                                            totalProteinPrice={totalProteinPrice}
                                            finalPrice={finalPrice}
                                            totalAddonPrice={totalAddonPrice}
                                        />
                                    )}
                                    

                                </div>

                                <div className="flex-shrink-0 py-3  "> 
                                    <div className="d-flex justify-content-center">
                                        <div className="d-flex gap-3"> 
                                            <AdmButton
                                                onClick={handlePrevBtn}
                                                text={"上一步"}
                                                size={'lg'}
                                                className={'btn-gray-200 px-lg-10 py-2 rounded-5'}
                                            />
                                            <AdmButton
                                                onClick={handleNextBtn}
                                                text={"下一步"}
                                                size={'lg'}
                                                className={'btn-primary px-lg-10 py-2 rounded-5'}
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
                        { stepState >= 2 && (<>
                            {/* <div className="c-nutrition-fab-wrapper">
                                <button className="btn btn-primary c-nutrition-fab-btn">
                                    營養<br/>分析
                                </button>
                            </div>

                            <div style={{  overflowX: 'hidden' }}>
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
                            </div> */}
                            </>)
                        }
                    </div>

                </div>
            </div>
        </main>
    )
}