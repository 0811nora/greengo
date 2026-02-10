import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Select from 'react-select';
import classNames from 'classnames';
import { getAllProducts } from '../api/ApiClient';
import seafoodTag from '../assets/img/product/Seafood.svg';

const sortOptions = [
	{ value: 'proteinToLow', label: '蛋白：高 → 低' },
	{ value: 'kcalToHigh', label: '熱量：低 → 高' },
	{ value: 'likeToLow', label: '人氣：高 → 低' },
	{ value: 'priceToHigh', label: '價格：低 → 高' },
	{ value: 'priceToLow', label: '價格：高 → 低' },
];

const flavorOptions = [
	{ value: 'noSeafood', label: '不要海鮮' },
	{ value: 'noSpicy', label: '不要辣' },
	{ value: 'noBeef', label: '不要牛' },
	{ value: 'noPork', label: '不要豬' },
	{ value: 'spicy', label: '辣' },
];

const BLOCK_CONTENT_OPTIONS = [
	{
		icon: 'allergies',
		title: '經典綠果碗',
		subtitle: '由主廚精心搭配的營養組合',
	},
	{
		icon: 'coffee',
		title: '健康飲品',
		subtitle: '讓營養更完整的健康飲品',
	},
	{
		icon: 'water_medium',
		title: '溫暖湯品',
		subtitle: '讓營養更均衡的溫暖湯品',
	},
];
const FILTER_CONTENT_OPTIONS = {
	set: {
		category: { key: 'set', label: '經典綠果碗' },
		tab: [
			{ key: 'all', label: '全部', icon: 'border_all' },
			{ key: 'popular', label: '人氣推薦', icon: 'thumb_up' },
			{ key: 'highProtein', label: '多多蛋白', icon: 'egg' },
			{ key: 'lowFat', label: '低卡低脂', icon: 'favorite' },
			{ key: 'veg', label: '新鮮蔬食', icon: 'nest_eco_leaf' },
		],
		tag: [
			{ key: 'beef', label: '不含牛肉', imgSrc: beefTag },
			{ key: 'pork', label: '不含豬肉', imgSrc: null },
			{ key: 'seafood', label: '不含海鮮', imgSrc: seafoodTag },
			{ key: 'spicy', label: '不辣', imgSrc: spicyTag },
		],
	},
	drinks: {
		category: { key: 'drinks', label: '健康飲品' },
		tab: [
			{ key: 'all', label: '全部' },
			{ key: 'tea', label: '茶' },
			{ key: 'coffee', label: '咖啡' },
			{ key: 'juice', label: '果汁' },
		],
		tag: [
			{ key: 'alcohol', label: '無酒精' },
			{ key: 'caffeine', label: '無咖啡因' },
			{ key: 'sugar', label: '無糖' },
		],
	},
	soup: {
		category: { key: 'soup', label: '溫暖湯品' },
		tab: [
			{ key: 'all', label: '全部' },
			{ key: 'freshSoup', label: '清爽湯' },
			{ key: 'proteinSoup', label: '高蛋白湯' },
			{ key: 'vegSoup', label: '素食湯' },
		],
		tag: [
			{ key: 'beef', label: '不含牛肉' },
			{ key: 'daily', label: '不含奶' },
		],
	},
};

export default function Product() {
	const [sortSelect, setSortSelect] = useState(null);
	const [flavorSelect, setFlavorSelect] = useState(null);
	const [productsData, setProductsData] = useState([]);

	useEffect(() => {
		const getProducts = async () => {
			try {
				const res = await getAllProducts();
				console.log(res.data);
				setProductsData(res.data.products);
			} catch (error) {
				console.log(error.response);
			}
		};
		getProducts();
	}, []);

	const fixedProducts = productsData?.filter(product => product.category === 'fixed');

	return (
		<div className="product-page">
			{/* 菜單hero */}
			<header>
				<div className="container d-flex flex-column justify-content-between align-items-center">
					<div className="d-flex flex-column align-items-center">
						<h1 className="text-primary-300 fw-semibold mb-5">Green Go 精選菜單</h1>
						<div className="d-flex flex-column flex-md-row">
							<h5 className="fw-normal text-brown-300 text-center m-1">當季最新鮮、營養最到位，</h5>
							<h5 className="fw-normal text-brown-300 text-center m-1">每一口都是 GreenGo 的健康提案</h5>
						</div>
					</div>
				</div>
			</header>

			{/* 菜單錨點 */}
			<section className="position-relative">
				<div className="block-filter container position-absolute top-0 start-50 translate-middle">
					<div className="d-flex flex-column flex-md-row justify-content-between gap-6 gap-xxl-8 ">
						{BLOCK_CONTENT_OPTIONS.map(option => (
							<div className="block-item d-flex flex-column align-items-center">
								<span className="material-symbols-rounded">{option.icon}</span>
								<p className="h5 fw-semibold">{option.title}</p>
								<p>{option.subtitle}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 向下箭頭 */}
			{/* <section>
        <i className="bi bi-arrow-down mt-4 text-primary"></i>
      </section> */}

			{/* 固定餐*/}
			<section className="container set-section">
				<div className="title mb-10 position-relative">
					<span class="material-symbols-rounded position-absolute top-0 start-50 translate-middle">allergies</span>
					<h2>經典綠果碗</h2>
					<h6>主廚的精心搭配，讓專業為你把關！</h6>
				</div>
				<div className="tab-filter d-flex justify-content-between gap-6">
					<ul class="nav nav-underline d-flex gap-6 flex-fill">
						<li class="nav-item">
							<button class="nav-link tab-navLink ">全部</button>
						</li>
						<li class="nav-item">
							<button class="nav-link tab-navLink">人氣推薦</button>
						</li>
						<li class="nav-item">
							<button class="nav-link tab-navLink ">多多蛋白</button>
						</li>
						<li class="nav-item">
							<button class="nav-link tab-navLink">低脂低卡</button>
						</li>
						<li class="nav-item">
							<button class="nav-link tab-navLink">健康蔬食</button>
						</li>
					</ul>

					<Select
						options={flavorOptions}
						placeholder="忌口篩選"
						isMulti={true}
						value={flavorSelect}
						onChange={setFlavorSelect}
						unstyled
						classNamePrefix="rs"
						classNames={{
							control: ({ isFocused }) => classNames('rs__control', isFocused && 'rs__focus'),
							menu: () => classNames('rs__menu'),
							option: ({ isFocused }) => classNames('rs__option', isFocused && 'rs__focus'),
						}}
					/>
					<Select
						options={sortOptions}
						placeholder="排序"
						value={sortSelect}
						onChange={setSortSelect}
						unstyled
						classNamePrefix="rs"
						classNames={{
							control: ({ isFocused }) => classNames('rs__control', isFocused && 'rs__focus'),
							menu: () => classNames('rs__menu'),
							option: ({ isFocused }) => classNames('rs__option', isFocused && 'rs__focus'),
						}}
					/>
				</div>

				<div className="row mt-9">
					{fixedProducts.map(product => (
						<div className="col-3" key={product.id}>
							<div className="card">
								<div className="img position-raletive">
									<img
										src="https://storage.googleapis.com/vue-course-api.appspot.com/miniburger/1770205696564.png"
										className="card-img-top"
										alt={product.title}
									/>
								</div>

								{/* <div className="nutrition d-flex gap-2 px-6 py-1">
                  <span className="">{`${
                    product.nutrition.calories
                  } Kcal`}</span>{" "}
                  |<span>{`P ${product.nutrition.protein}`}</span> |
                  <span>{`F ${product.nutrition.fat}`}</span>|{" "}
                  <span>{`C ${product.nutrition.carbs}`}</span>
                </div> */}

								<div className="card-body d-flex flex-column gap-5 px-6 py-7">
									<div className="d-flex gap-1">
										<h6 className="fw-semibold mb-2 text-gray-600">{product.title}</h6>
										<div className="d-flex gap-1">
											<div className="tag">
												<img src={seafoodTag} alt="" />
											</div>
											<div className="tag">
												<img src={seafoodTag} alt="" />
											</div>
											<div className="tag">
												<img src={seafoodTag} alt="" />
											</div>
										</div>
									</div>
									<div className="d-flex flex-column gap-1">
										<p className="fw-normal text-brown-300">多多蛋白｜人氣推薦</p>
										<p className="fw-normal text-brown-300">416 Kcal｜P 60｜F 13｜C 9</p>
									</div>
									{/* <div className="d-flex flex-column gap-1">
                    <p className="fw-normal text-brown-300">
                      {`${product.ingredients.base}、${product.ingredients.source}`}
                    </p>
                    <p className="fw-normal text-brown-300">
                      {`${product.ingredients.main}`}
                    </p>
                    <p className="fw-normal text-brown-300">
                      {`${product.ingredients.side}`}
                    </p>
                  </div> */}

									<div className="card-footer">
										<div className="h6 fw-semibold text-primary-200 mb-5">{`NT$${product.price}`}</div>
										<div className="button-section d-flex align-items-center gap-3">
											<div className="num-control d-flex align-items-center justify-content-between flex-fill">
												<button className="minus">
													<i class="bi bi-dash"></i>
												</button>
												<span className="fw-semibold text-center">1</span>
												<button className="add">
													<i class="bi bi-plus"></i>
												</button>
											</div>

											<button className="addCart primary-btn">加入購物車</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/*以下是用col*/}
			{/* <div className="row mt-8">
				<div className="col-2">
					類別區塊
					<Accordion defaultActiveKey="1" flush>
						<Accordion.Item eventKey="1">
							<Accordion.Header onClick={() => toggleFStateByCategory('set')}>
								經典poke碗
							</Accordion.Header>
							<Accordion.Body>
								{FILTER_OPTIONS[currentCategoryState]?.tab?.map((item, index) => (
									<Form.Check
										key={index}
										type="radio"
										id={item.key}
										label={item.label}
										name={currentCategoryState}
										value={item.key}
										checked={filterState[currentCategoryState].tab === item.key}
										onChange={e => toggleFStateByTab(e)}
									/>
								))}
							</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="2">
							<Accordion.Header onClick={() => toggleFStateByCategory('drinks')}>
								健康飲品
							</Accordion.Header>
							<Accordion.Body>
								{FILTER_OPTIONS[currentCategoryState]?.tab?.map((item, index) => (
									<Button variant="primary" onClick={() => toggleFStateByTab(item.key)} key={index}>
										{item.label}
									</Button>
								))}
							</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="3">
							<Accordion.Header onClick={() => toggleFStateByCategory('soup')}>溫暖湯品</Accordion.Header>
							<Accordion.Body>
								{FILTER_OPTIONS[currentCategoryState]?.tab?.map((item, index) => (
									<Button variant="primary" onClick={() => toggleFStateByTab(item.key)} key={index}>
										{item.label}
									</Button>
								))}
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>

					忌口選擇區塊
					<div>
						{tagSectionStyle?.map((item, index) => (
							<Form.Check
								key={index}
								type="checkbox"
								id={item.key}
								label={item.label}
								value={item.key}
								checked={filterState[currentCategoryState]?.tag.includes(item.key)}
								onChange={e => toggleFStateByTag(e)}
							/>
						))}
					</div>
				</div>
				產品列表
				<div className="col-10">
					{String(currentCategoryState)}
							{JSON.stringify(filterState[currentCategoryState])}
					<div className="row">
						{displayProducts.map(product => (
							<div className="col-4" key={product.id}>
								<div className="card">
									圖片
									<div className="img position-raletive">
										<img src={product.imageUrl} className="card-img-top" alt={product.title} />
										{product.tab_collection?.includes('popular') && (
											<div className="popular position-absolute">Top</div>
										)}
									</div>
									<div className="card-body d-flex flex-column gap-5 px-6 pt-7 pb-5">
										標題和忌口標籤
										<div className="d-flex gap-3">
											<h5 className="fw-semibold mb-2 text-gray-600">{product.title}</h5>
											<div className=" tag d-flex gap-1">
												{renderUITag(product.product_type, product?.include_tags)?.map(
													(tagSrc, index) => (
														<div className="tag" key={index}>
															<img src={tagSrc} alt="忌口選擇標籤" />
														</div>
													),
												)}
											</div>
										</div>
										類別標籤和營養素
										<div className="d-flex flex-column gap-1">
											<p className="fw-normal text-brown-300">
												{renderUITab(product.product_type, product.tab_collection)}
											</p>

											<div className="fw-normal text-brown-300">
												<span>{`${product.nutrition.calories} Kcal`}</span>
												<span>
													{`｜P ${product.nutrition.protein}｜F ${product.nutrition.fat}｜C  ${product.nutrition.carbs}`}
												</span>
											</div>
										</div>
										<div className="card-footer">
											<div className="h6 fw-semibold text-primary-200 mb-5">
												{`NT$ ${product.price}`}
											</div>
											<div className="button-section d-flex align-items-center gap-3">
												<div className="num-control d-flex align-items-center justify-content-between flex-fill">
													<button className="minus">
														<i class="bi bi-dash"></i>
													</button>
													<span className="fw-medium text-center">1</span>
													<button className="add">
														<i class="bi bi-plus"></i>
													</button>
												</div>

												<button className="addCart primary-btn">加入購物車</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div> */}
		</div>
	);
}
