
import DonutPFC from "./PFC_Chart"



const CompleteNutrition = ({
        calcPFC,
        finalTotalNutrition,
        modeClass
    }) => {
    return(<>
    <div className={modeClass} >
        <div className="mb-4">
            <DonutPFC 
                calories={calcPFC.calories} 
                protein={calcPFC.protein} 
                fat={calcPFC.fat}  
                carbs={calcPFC.carbs} 
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
    </>)
}

export default CompleteNutrition;