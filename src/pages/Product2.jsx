import { useEffect, useState } from 'react';
import seafoodTag from '../assets/img/product/Seafood.svg';
import beefTag from '../assets/img/product/Beef.svg';
import spicyTag from '../assets/img/product/Spicy.svg';
import { getAllProducts } from '../api/ApiClient';
import { Accordion, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import classNames from 'classnames';

const FILTER_OPTIONS = {
	set: {
		category: { key: 'set', label: '經典 poke 碗' },
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
const INITIAL_FILTER_STATE = {
	set: { tab: 'all', tag: [] },
	drinks: { tab: 'all', tag: [] },
	soup: { tab: 'all', tag: [] },
};
const sortOptions = [
	{ value: 'proteinToLow', label: '蛋白：高 → 低' },
	{ value: 'kcalToHigh', label: '熱量：低 → 高' },
	{ value: 'likeToLow', label: '人氣：高 → 低' },
	{ value: 'priceToHigh', label: '價格：低 → 高' },
	{ value: 'priceToLow', label: '價格：高 → 低' },
];

export const Product2 = () => {
	const [allProducts, setAllProducts] = useState([]);
	const [displayProducts, setDisplayProducts] = useState([]);
	const [currentCategoryState, setCurrentCategoryState] = useState('set');
	const [filterState, setFilterState] = useState(INITIAL_FILTER_STATE);
	const [tagSectionStyle, setSetSectionStyle] = useState([]);
	const [sortSelect, setSortSelect] = useState(null);

	// 左側 filter 按鈕操作邏輯
	const toggleFStateByCategory = prodcutCategory => setCurrentCategoryState(prodcutCategory);
	const toggleFStateByTab = e => {
		const { value } = e.target;
		setFilterState(prev => ({
			...prev,
			[currentCategoryState]: {
				...prev[currentCategoryState],
				tab: value,
			},
		}));
		console.log('clicked', e.target.value);
	};
	const toggleFStateByTag = e => {
		const { value, checked } = e.target;
		setFilterState(prev => {
			const prevTagList = prev[currentCategoryState]?.tag || [];
			const newTagList = checked ? [...prevTagList, value] : prevTagList.filter(item => item !== value);
			return {
				...prev,
				[currentCategoryState]: {
					...prev[currentCategoryState],
					tag: newTagList,
				},
			};
		});
	};

	// 渲染卡片上的 Tab, Tag
	const renderUITab = (prodcutCategory, productTab) => {
		if (!Array.isArray(productTab)) return null;

		// 符合 category 的 tab data 列表
		const tabDataList = FILTER_OPTIONS[prodcutCategory]?.tab;
		const result = [];
		for (const dataTab of tabDataList) {
			for (const UITab of productTab) {
				if (dataTab.key === UITab) {
					result.push(dataTab.label);
				}
			}
		}
		// 將 result 陣列用｜隔開組成字串
		return result.join(' ｜ ');
	};
	const renderUITag = (prodcutCategory, productTag) => {
		if (!Array.isArray(productTag)) return null;

		// 符合 category 的 tag data 列表
		const tagDataList = FILTER_OPTIONS[prodcutCategory]?.tag;
		const result = [];
		for (const dataTag of tagDataList) {
			for (const UITag of productTag) {
				if (dataTag.key === UITag) {
					result.push(dataTag.imgSrc);
				}
			}
		}
		// 將 result 陣列用｜隔開組成字串
		return result;
	};

	// 獲得 api 產品資料
	useEffect(() => {
		const getProducts = async () => {
			try {
				const res = await getAllProducts();
				console.log(res.data);
				setAllProducts(res.data.products);
			} catch (error) {
				console.log(error.response);
			}
		};
		getProducts();
	}, []);

	// 由 currentCategoryState 決定忌口選擇區塊的內容
	useEffect(() => {
		setSetSectionStyle(FILTER_OPTIONS[currentCategoryState].tag);
	}, [currentCategoryState]);

	// 由 filterState 決定產品渲染內容，
	// 由 allProducts 改變(抓資料後由空陣列變成以內容陣列)，導致再跑一次可以渲染畫面
	useEffect(() => {
		setDisplayProducts(() => filterDisplayProducts(allProducts, filterState));
	}, [currentCategoryState, filterState, allProducts]);

	// 渲染產品列表(剔除邏輯)
	const filterDisplayProducts = (allProducts, filterState) => {
		const { tab, tag } = filterState[currentCategoryState];

		return allProducts.filter(product => {
			if (product.product_type !== currentCategoryState) {
				return false;
			}
			if (tab !== 'all') {
				if (!product.tab_collection?.includes(tab)) {
					return false;
				}
			}
			if (product.include_tags) {
				for (const ptg of product.include_tags) {
					if (tag.includes(ptg)) {
						return false;
					}
				}
			}
			return true;
		});
	};

	return (
		<div className="test product-page">
			{/* 菜單hero */}
			<header>
				<div className="container d-flex flex-column justify-content-between align-items-center">
					<div className="d-flex flex-column align-items-center">
						<h1 className="mb-5">Green Go 精選菜單</h1>
						<div className="d-flex flex-column flex-md-row">
							<h5 className="text-center m-1">當季最新鮮、營養最到位，</h5>
							<h5 className="text-center m-1">每一口都是 GreenGo 的健康提案</h5>
						</div>
					</div>
				</div>
			</header>

			{/* 菜單content */}
			<section>
				<div className="container">
					{/* <div className="title">
						<h2>Green Go 幫你配</h2>
						<h6>主廚的精心搭配，讓專業為你把關！</h6>
					</div> */}
					<div className="d-flex">
						<aside className="pt-8 d-flex flex-column gap-8">
							{/* 排序選擇區塊 */}
							{/* <div>
								<p className="mb-3">排序選擇</p>
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
							</div> */}

							{/* 商品類別區塊 */}
							<div>
								<p className="mb-3">商品類別</p>
								<Accordion defaultActiveKey="1">
									<Accordion.Item eventKey="1">
										<Accordion.Header
											onClick={() => toggleFStateByCategory('set')}
											className="accordion-header"
										>
											經典綠果碗
										</Accordion.Header>
										<Accordion.Body>
											{FILTER_OPTIONS[currentCategoryState]?.tab?.map((item, index) => (
												<Form.Check
													key={index}
													type="radio"
													id={item.key}
													label={
														<>
															<p>{item.label}</p>
															{}
															<span
																className={`material-symbols-rounded ${filterState[currentCategoryState].tab === item.key ? 'd-block' : 'd-none'}`}
															>
																check_circle
															</span>
														</>
													}
													name={currentCategoryState}
													value={item.key}
													checked={filterState[currentCategoryState].tab === item.key}
													onChange={e => toggleFStateByTab(e)}
													className={`tabInput ${filterState[currentCategoryState].tab === item.key ? 'tabActive' : ''}`}
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
												<Form.Check
													key={index}
													type="radio"
													id={item.key}
													label={
														<>
															<p>{item.label}</p>
															{}
															<span
																className={`material-symbols-rounded ${filterState[currentCategoryState].tab === item.key ? 'd-block' : 'd-none'}`}
															>
																check_circle
															</span>
														</>
													}
													name={currentCategoryState}
													value={item.key}
													checked={filterState[currentCategoryState].tab === item.key}
													onChange={e => toggleFStateByTab(e)}
													className={`tabInput ${filterState[currentCategoryState].tab === item.key ? 'tabActive' : ''}`}
												/>
											))}
										</Accordion.Body>
									</Accordion.Item>
									<Accordion.Item eventKey="3">
										<Accordion.Header onClick={() => toggleFStateByCategory('soup')}>
											溫暖湯品
										</Accordion.Header>
										<Accordion.Body>
											{FILTER_OPTIONS[currentCategoryState]?.tab?.map((item, index) => (
												<Form.Check
													key={index}
													type="radio"
													id={item.key}
													label={
														<>
															<p>{item.label}</p>
															{}
															<span
																className={`material-symbols-rounded ${filterState[currentCategoryState].tab === item.key ? 'd-block' : 'd-none'}`}
															>
																check_circle
															</span>
														</>
													}
													name={currentCategoryState}
													value={item.key}
													checked={filterState[currentCategoryState].tab === item.key}
													onChange={e => toggleFStateByTab(e)}
													className={`tabInput ${filterState[currentCategoryState].tab === item.key ? 'tabActive' : ''}`}
												/>
											))}
										</Accordion.Body>
									</Accordion.Item>
								</Accordion>
							</div>

							{/* 忌口選擇區塊 */}
							<div>
								<p className="mb-3">商品類別</p>
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
						</aside>

						<div className="container mt-8">
							<div className="row">
								{displayProducts.map(product => (
									<div className="col-4" key={product.id}>
										<div className="card">
											{/* 圖片 */}
											<div className="img position-raletive">
												<img
													src={product.imageUrl}
													className="card-img-top"
													alt={product.title}
												/>
												{product.tab_collection?.includes('popular') && (
													<div className="popular position-absolute">Top</div>
												)}
											</div>
											<div className="card-body d-flex flex-column gap-5 px-6 pt-7 pb-5">
												{/* 標題和忌口標籤 */}
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
												{/* 類別標籤和營養素 */}
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
					</div>
				</div>
			</section>
		</div>
	);
};
