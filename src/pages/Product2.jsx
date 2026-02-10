import { useEffect, useState } from 'react';
import seafoodTag from '../assets/img/product/Seafood.svg';
import beefTag from '../assets/img/product/Beef.svg';
import spicyTag from '../assets/img/product/Spicy.svg';
import { getAllProducts } from '../api/ApiClient';
import { Accordion, Form } from 'react-bootstrap';
import Select from 'react-select';
import classNames from 'classnames';
import { useNavigate, useParams } from 'react-router-dom';
import ProductDetail from './ProductDetail';

const FILTER_OPTIONS = {
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
const INITIAL_FILTER_STATE = {
	all: { tab: 'all', tag: [] },
	set: { tab: 'all', tag: [] },
	drinks: { tab: 'all', tag: [] },
	soup: { tab: 'all', tag: [] },
};
const SORT_SELECT = [
	{ value: 'proteinToLow', label: '蛋白：高 → 低' },
	{ value: 'kcalToHigh', label: '熱量：低 → 高' },
	{ value: 'likeToLow', label: '人氣：高 → 低' },
	{ value: 'priceToHigh', label: '價格：低 → 高' },
	{ value: 'priceToLow', label: '價格：高 → 低' },
];

export const Product2 = () => {
	const [allProducts, setAllProducts] = useState([]);
	const [displayProducts, setDisplayProducts] = useState([]);
	const [currentCategoryState, setCurrentCategoryState] = useState('all');
	const [filterState, setFilterState] = useState(INITIAL_FILTER_STATE);
	const [tagSectionStyle, setSetSectionStyle] = useState([]);
	const [sortSelect, setSortSelect] = useState(null);
	const [isOpenDetailModal, setIsOpenDetailModal] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();

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
	const renderUITabpill = (prodcutCategory, productTab) => {
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
		return result;
	};
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
		setSetSectionStyle(FILTER_OPTIONS[currentCategoryState]?.tag);
	}, [currentCategoryState]);

	// 由 filterState 決定產品渲染內容，由 allProducts 改變(抓資料後由空陣列變成以內容陣列)，導致再跑一次可以渲染畫面
	useEffect(() => {
		setDisplayProducts(() => filterDisplayProducts(allProducts, filterState));
	}, [currentCategoryState, filterState, allProducts]);

	// 判斷現在網址有沒有產品id，決定要不要打開modal
	useEffect(() => {
		console.log('當前網址 ID:', id);
		if (id) {
			setIsOpenDetailModal(true);
		} else {
			setIsOpenDetailModal(false);
		}
	}, [id]);

	// 渲染產品列表(剔除邏輯)
	const filterDisplayProducts = (allProducts, filterState) => {
		if (currentCategoryState === 'all')
			return allProducts.filter(product => product.category !== 'item' && product.category !== 'custom');
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

	// 產品詳細頁開關
	const handleOpenDetailModal = id => {
		setIsOpenDetailModal(true);
		navigate(`/product2/${id}`);
	};
	const handleCloseDetailModal = () => {
		setIsOpenDetailModal(false);
		navigate(`/product2`);
	};

	return (
		<div className="test product-page position-relative">
			<div className="header-fixed position-fixed"></div>
			<div className="header">
				<div className="container d-flex justify-content-center align-items-center">
					<div className="d-flex flex-column align-items-center justify-content-center">
						<h1 className="mb-5">Green Go 精選菜單</h1>
						<h5>當季最新鮮、營養最到位， 每一口都是 GreenGo 的健康提案</h5>
					</div>
				</div>
			</div>
			{/* 菜單hero */}
			{/* <section className="position-relative">
				<div className="block-filter container position-absolute top-0 start-50 translate-middle">
					<div className="d-flex flex-column flex-md-row justify-content-center gap-6 gap-xxl-8 ">
						<div className="block-item d-flex ">
							<span className="material-symbols-rounded d-block">chef_hat</span>
							<div className="d-flex flex-column align-items-center">
								<p className="h5 fw-semibold">Green Go 幫你配</p>
								<p>由主廚精心搭配的營養組合</p>
							</div>
						</div>
						<div className="block-item">
							<span className="material-symbols-rounded">allergies</span>
							<p className="h5 fw-semibold">$149 隨心自由配</p>
							<p>自由選擇喜歡的食材組合</p>
						</div>
					</div>
				</div>
			</section> */}
			{/* 菜單content */}
			<section className="menu position-relative">
				<div className="menu-sorted container d-flex justify-content-end align-items-center position-sticky">
					<Select
						options={SORT_SELECT}
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

				<div className="menu-content container mt-10">
					<div className="row">
						<div className="col-3">
							<aside className="d-flex flex-column gap-8 position-sticky">
								{/* 排序選擇區塊 */}
								{/* <div>
									<p className="mb-3 fw-medium">- 排序選擇 -</p>
									<Select
										options={SORT_SELECT}
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
									<p className="mb-3 fw-medium">- 商品類別 -</p>
									<Accordion defaultActiveKey="1" className="categoryAccordion" flush>
										{Object.values(FILTER_OPTIONS).map((item, index) => (
											<Accordion.Item eventKey={index + 1} key={index}>
												<Accordion.Header
													onClick={() => toggleFStateByCategory(item.category.key)}
													className="accordion-header"
												>
													{item.category.label}
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
										))}
									</Accordion>
								</div>

								{/* 忌口選擇區塊 */}
								<div>
									<p className="mb-5 fw-medium">- 忌口選擇 -</p>
									<div className="px-2">
										{tagSectionStyle?.map((item, index) => (
											<Form.Check
												key={index}
												type="checkbox"
												id={item.key}
												label={
													<>
														<p>{item.label}</p>
														<span
															className={`material-symbols-rounded ${filterState[currentCategoryState].tag.includes(item.key) ? 'd-block' : 'd-none'}`}
														>
															close
														</span>
													</>
												}
												value={item.key}
												checked={filterState[currentCategoryState]?.tag.includes(item.key)}
												onChange={e => toggleFStateByTag(e)}
												className={`d-flex tagInput ${filterState[currentCategoryState].tag.includes(item.key) ? 'tagActive' : ''}`}
											/>
										))}
									</div>
								</div>
							</aside>
						</div>

						<div className="col-9 ">
							<div className="row">
								{displayProducts.map(product => (
									<div className="col-4" key={product.id}>
										<div className="card mb-6" onClick={() => handleOpenDetailModal(product.id)}>
											{/* 圖片 */}
											<div className="img position-relative">
												<img src={product.imageUrl} className="card-img-top" alt={product.title} />
												<div className="position-absolute d-flex flex-column gap-1 popular-position-absolute">
													{renderUITabpill(product.product_type, product.tab_collection)?.map(item => (
														<div className="popular">{item}</div>
													))}
												</div>
											</div>
											<div className="card-body d-flex flex-column gap-5 px-6 pt-7 pb-7">
												{/* 標題和忌口標籤 */}
												<div className="d-flex gap-3">
													<h6 className="fw-semibold mb-2 text-gray-600">{product.title}</h6>
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
												{/* 營養素和內容物 */}
												<div className="d-flex flex-column gap-1">
													<div className="fw-normal text-brown-300 d-flex gap-1">
														<div>{`${product.nutrition.calories} cal｜`}</div>
														<div>{`P ${product.nutrition.protein}｜F ${product.nutrition.fat}｜C ${product.nutrition.carbs}`}</div>
													</div>

													<p className="fw-normal text-brown-300">
														{product.product_type === 'set'
															? `${product.ingredients.main}、新鮮蔬菜...`
															: `${product.ingredients.base}`}
													</p>
												</div>

												<div className="h6 fw-semibold text-gray-600 mt-5">{`NT$ ${product.price}`}</div>
												<div className="num-control position-absolute">
													<button className="add">
														<i class="bi bi-plus"></i>
													</button>
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

			{/* 菜單CTA-custom */}
			<section className="CTA-custom mt-10 mb-10">
				<div className="container-fluid p-0">
					<div className="row">
						<div className="col-5">
							<div className="img">
								<img
									src="https://images.unsplash.com/photo-1551218372-a8789b81b253?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
									alt="CTA-custom"
								/>
							</div>
						</div>
						<div className="col-7 ">
							<div className="content d-flex flex-column justify-content-center">
								<h2>沒遇到理想的那「碗」嗎？</h2>
								<h5>到自選菜單，自由搭配出你的理想滋味吧！</h5>
								<button type="button" className="cta-btn" onClick={() => navigate('/custom')}>
									自選菜單 GO
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{isOpenDetailModal && (
				<ProductDetail isOpenDetailModal={isOpenDetailModal} handleCloseDetailModal={handleCloseDetailModal} />
			)}
		</div>
	);
};
