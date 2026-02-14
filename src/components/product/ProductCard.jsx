const ProductCard = ({ product, data, category }) => {
	const renderUITag = productTag => {
		if (!Array.isArray(productTag)) return null;

		// 符合 category 的 tag data 列表
		const tagDataList = data[category]?.flavor;
		const result = [];
		for (const dataTag of tagDataList) {
			for (const UITag of productTag) {
				if (dataTag.value === UITag) {
					result.push(dataTag.img);
				}
			}
		}
		// 將 result 陣列用｜隔開組成字串
		return result;
	};
	const renderUITab = productTab => {
		if (!Array.isArray(productTab)) return null;

		// 符合 category 的 tab data 列表
		const tabDataList = data[category]?.tab;
		const result = [];

		for (const dataTab of tabDataList) {
			for (const UITab of productTab) {
				if (dataTab.value === UITab) {
					result.push(dataTab.label);
				}
			}
		}
		// 將 result 陣列用｜隔開組成字串
		return result;
	};
	return (
		<div className="col-xxl-3 col-lg-4  col-sm-6 col-12" key={product.id}>
			<div className="d-flex flex-lg-column card mb-6">
				{/* 圖片 */}
				<div className="img position-relative">
					<img src={product.imageUrl} alt={product.title} />
					{/* tab分類 */}
					<div className="position-absolute d-flex flex-column gap-1 tabPill-position-absolute">
						{renderUITab(product.tab_collection)?.map((item, index) => (
							<div className="tabPill" key={index}>
								{item}
							</div>
						))}
					</div>
				</div>
				<div className="card-body d-flex flex-column gap-2 px-6 pt-7 pb-7 position-relative">
					{/* 標題和忌口標籤 */}
					<div className="d-flex gap-2 mb-2">
						<h6 className="d-flex fw-semibold text-gray-600">{product.title}</h6>
						<div className=" flavorTag d-flex gap-1">
							{renderUITag(product.include_tags)?.map((img, index) => (
								<div className="tag" key={index}>
									<img src={img} alt="忌口選擇標籤" />
								</div>
							))}
						</div>
					</div>
					{/* 營養素和內容物 */}
					<div className="d-flex flex-column gap-1">
						<div className="d-flex gap-1 border-bottom-0">
							<div className="nutrition-text">{`${product.nutrition.calories} Kcal｜P ${product.nutrition.protein}｜F ${product.nutrition.fat}｜C ${product.nutrition.carbs}`}</div>
						</div>

						<p className="ingredient-text fw-normal text-brown-300">
							{product.product_type === 'set'
								? `${product.ingredients.main}、新鮮蔬菜`
								: `${product.ingredients.base}`}
						</p>
					</div>

					<div className="h6 fw-semibold text-gray-600 mt-5">{`NT$ ${product.price}`}</div>
					<button className="addBtn position-absolute">
						<i className="bi bi-plus fs-4"></i>
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
