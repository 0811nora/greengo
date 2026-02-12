import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Select from 'react-select';
import classNames from 'classnames';
import { getAllProducts } from '../api/ApiClient';
import seafoodTag from '../assets/image/product/seafood.svg';
import beefTag from '../assets/image/product/beef.svg';
import coffeeTag from '../assets/image/product/coffee.svg';
import alcoholTag from '../assets/image/product/alcohol.svg';
import milkTag from '../assets/image/product/milk.svg';
import spicyTag from '../assets/image/product/spicy.svg';
import sugarTag from '../assets/image/product/sugar.svg';
import { ConfirmModal } from '../components/common/Modal';

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
		icon: 'onsen',
		title: '溫暖湯品',
		subtitle: '讓營養更均衡的溫暖湯品',
	},
];
const DATA = {
	set: {
		category: 'set',
		title: {
			icon: 'allergies',
			title: '經典綠果碗',
			subtitle: '由主廚精心搭配的營養組合',
		},
		sort: [
			{ value: 'proteinToLow', label: '蛋白：高 → 低' },
			{ value: 'kcalToHigh', label: '熱量：低 → 高' },
			{ value: 'likeToLow', label: '人氣：高 → 低' },
			{ value: 'priceToHigh', label: '價格：低 → 高' },
			{ value: 'priceToLow', label: '價格：高 → 低' },
		],
		tab: [
			{ value: 'all', label: '全部', icon: 'border_all' },
			{ value: 'popular', label: '人氣推薦', icon: 'thumb_up' },
			{ value: 'highProtein', label: '多多蛋白', icon: 'egg' },
			{ value: 'lowFat', label: '低卡低脂', icon: 'favorite' },
			{ value: 'veg', label: '新鮮蔬食', icon: 'nest_eco_leaf' },
		],
		flavor: [
			{ value: 'beef', label: '不含牛肉', img: beefTag },
			{ value: 'pork', label: '不含豬肉' },
			{ value: 'seafood', label: '不含海鮮', img: seafoodTag },
			{ value: 'spicy', label: '不辣', img: spicyTag },
		],
	},
	drinks: {
		category: 'drinks',
		title: {
			icon: 'coffee',
			title: '健康飲品',
			subtitle: '讓營養更完整的健康飲品',
		},

		sort: [
			{ value: 'likeToLow', label: '人氣：高 → 低' },
			{ value: 'priceToHigh', label: '價格：低 → 高' },
			{ value: 'priceToLow', label: '價格：高 → 低' },
		],
		tab: [
			{ key: 'all', label: '全部' },
			{ key: 'tea', label: '茶' },
			{ key: 'coffee', label: '咖啡' },
			{ key: 'juice', label: '果汁' },
		],
		flavor: [
			{ key: 'alcohol', label: '無酒精', img: alcoholTag },
			{ key: 'caffeine', label: '無咖啡因', img: coffeeTag },
			{ key: 'sugar', label: '無糖', img: sugarTag },
		],
	},
	soup: {
		category: 'soup',
		title: {
			icon: 'water_medium',
			title: '溫暖湯品',
			subtitle: '讓營養更均衡的溫暖湯品',
		},

		sort: [
			{ value: 'likeToLow', label: '人氣：高 → 低' },
			{ value: 'priceToHigh', label: '價格：低 → 高' },
			{ value: 'priceToLow', label: '價格：高 → 低' },
		],
		tab: [
			{ value: 'all', label: '全部' },
			{ value: 'freshSoup', label: '清爽湯' },
			{ value: 'proteinSoup', label: '高蛋白湯' },
			{ value: 'vegSoup', label: '素食湯' },
		],
		flavor: [
			{ value: 'beef', label: '不含牛肉', img: beefTag },
			{ value: 'daily', label: '不含奶', img: milkTag },
		],
	},
};
const INITIAL_STATE_STATE = {
	set: {
		tab: 'all',
		flavor: [],
		sort: 'default',
	},
	drinks: {
		tab: 'all',
		flavor: [],
		sort: 'default',
	},
	soup: {
		tab: 'all',
		flavor: [],
		sort: 'default',
	},
};

export default function Product() {
	const [flavorSelect, setFlavorSelect] = useState(null);
	const [sortSelect, setSortSelect] = useState(null);
	const [apiProdutsData, setApiProdutsData] = useState([]);
	const [displayProdutsData, setDisplayProdutsData] = useState([]);
	const [filterState, setFilterState] = useState(INITIAL_STATE_STATE);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getProducts = async () => {
			try {
				const res = await getAllProducts();
				const data = res.data.products.filter(
					product => product.category !== 'item' && product.category !== 'custom',
				);
				setApiProdutsData(data);
				setIsLoading(false);
			} catch (error) {
				console.log(error.response);
			}
		};
		getProducts();
	}, []);
	useEffect(() => {
		renderSetDisplayData(apiProdutsData, filterState);
	}, [apiProdutsData, filterState]);

	const CustomMultiValueRemove = ({ innerProps }) => {
		return (
			<span {...innerProps} className="material-symbols-rounded">
				close
			</span>
		);
	};
	const toggleTabFilter = (category, value) => {
		setFilterState(prev => ({
			...prev,
			[category]: {
				...prev[category],
				tab: value,
			},
		}));
	};
	const toggleFlavorFilter = (category, value) => {
		setFlavorSelect(value);
		const flavorNewArry = value.map(valueItem => valueItem.value);
		setFilterState(prev => ({
			...prev,
			[category]: {
				...prev[category],
				flavor: flavorNewArry,
			},
		}));
	};
	const toggleSortFilter = (category, value) => {
		setSortSelect(value);
		setFilterState(prev => ({
			...prev,
			[category]: {
				...prev[category],
				sort: value.value,
			},
		}));
	};
	const renderSetDisplayData = (apiProdutsData, filterState) => {
		const filterData = apiProdutsData.filter(product => {
			if (product.product_type !== 'set') return false;
			if (filterState.set.tab !== 'all') {
				if (!product.tab_collection.includes(filterState.set.tab)) return false;
			}
			if (product.include_tags) {
				for (const filterFlavor of filterState.set.flavor) {
					if (product.include_tags?.includes(filterFlavor)) return false;
				}
			}
			return true;
		});
		const sortData = [...filterData];
		switch (filterState.set.sort) {
			case 'default':
				return sortData;
			case 'proteinToLow':
				return sortData.sort((a, b) => b.nutrition.protein - a.nutrition.protein);
			case 'kcalToHigh':
				return sortData.sort((a, b) => a.nutrition.calories - b.nutrition.calories);
			case 'priceToHigh':
				return sortData.sort((a, b) => a.price - b.price);
			case 'priceToLow':
				return sortData.sort((a, b) => b.price - a.price);
			default:
				return sortData;
		}
	};
	const renderUITag = (prodcutCategory, productTag) => {
		if (!Array.isArray(productTag)) return null;

		// 符合 category 的 tag data 列表
		const tagDataList = DATA[prodcutCategory]?.flavor;
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

	const renderUITabpill = (prodcutCategory, productTab) => {
		if (!Array.isArray(productTab)) return null;

		// 符合 category 的 tab data 列表
		const tabDataList = DATA[prodcutCategory]?.tab;
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
						{BLOCK_CONTENT_OPTIONS.map((option, index) => (
							<div className="block-item d-flex flex-column align-items-center" key={index}>
								<span className="material-symbols-rounded">{option.icon}</span>
								<p className="h5 fw-semibold">{option.title}</p>
								<p className="text-center">{option.subtitle}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 向下箭頭 */}
			{/* <section>
        <i className="bi bi-arrow-down mt-4 text-primary"></i>
      </section> */}

			{/* 固定餐 */}
			<section className="container set-section">
				{/* 固定餐標題 */}
				<div className="title mb-10 position-relative">
					<span className="material-symbols-rounded position-absolute top-0 start-50 translate-middle">
						{DATA.set.title.icon}
					</span>
					<h2>{DATA.set.title.title}</h2>
					<h6>{DATA.set.title.subtitle}</h6>
				</div>

				<div className="tab-filter d-flex flex-lg-row flex-column justify-content-between align-items-center gap-4">
					{/* 固定餐類別篩選 */}
					<ul className="nav nav-underline d-flex gap-md-6 gap-2 flex-fill">
						{DATA.set.tab.map((tabItem, index) => (
							<li className="nav-item" key={index}>
								<button
									className={`nav-link tab-navLink ${filterState.set.tab === tabItem.value ? 'active' : ''}`}
									value={tabItem.value}
									onClick={e => toggleTabFilter('set', e.target.value)}
								>
									{tabItem.label}
								</button>
							</li>
						))}
					</ul>
					<div className="d-flex gap-4">
						{/* 固定餐忌口篩選 */}
						<Select
							options={DATA.set.flavor}
							placeholder="忌口篩選"
							isMulti={true}
							value={flavorSelect}
							onChange={value => toggleFlavorFilter('set', value)}
							components={{ MultiValueRemove: CustomMultiValueRemove }}
							unstyled
							classNamePrefix="rs"
							classNames={{
								control: ({ isFocused, hasValue }) =>
									classNames('rs__control', isFocused && 'rs__focus', hasValue && 'rs__hasValue'),
								menu: () => classNames('rs__menu'),
								option: ({ isFocused }) => classNames('rs__option', isFocused && 'rs__focus'),
							}}
						/>

						{/* 固定餐排序篩選 */}
						<Select
							options={DATA.set.sort}
							placeholder="排序"
							value={sortSelect}
							onChange={value => toggleSortFilter('set', value)}
							unstyled
							classNamePrefix="rs"
							classNames={{
								control: ({ isFocused }) => classNames('rs__control', isFocused && 'rs__focus'),
								menu: () => classNames('rs__menu'),
								option: ({ isFocused }) => classNames('rs__option', isFocused && 'rs__focus'),
							}}
						/>
					</div>
				</div>

				<div className="row mt-9">
					{/* {JSON.stringify(filterState)} */}

					{renderSetDisplayData(apiProdutsData, filterState).map(product => (
						<div className="col-xxl-3 col-lg-4" key={product.id}>
							<div className="d-flex flex-md-column flex-sm-row card mb-6">
								{/* 圖片 */}
								<div className="img position-relative">
									<img src={product.imageUrl} className="card-img-top" alt={product.title} />
									<div className="position-absolute d-flex flex-column gap-1 tabPill-position-absolute">
										{renderUITabpill(product.product_type, product.tab_collection)?.map(item => (
											<div className="tabPill">{item}</div>
										))}
									</div>
								</div>
								<div className="card-body d-flex flex-column gap-4 px-6 pt-7 pb-7">
									{/* 標題和忌口標籤 */}
									<div className="d-flex gap-3 mb-2">
										<h6 className="d-flex fw-semibold  text-gray-600">{product.title}</h6>
										<div className=" flavorTag d-flex gap-1">
											{renderUITag(product.product_type, product?.include_tags)?.map((img, index) => (
												<div className="tag" key={index}>
													<img src={img} alt="忌口選擇標籤" />
												</div>
											))}
										</div>
									</div>
									{/* 營養素和內容物 */}
									<div className="d-flex flex-column gap-1">
										<div className="nutrition d-flex gap-1">
											<div>
												<span>{product.nutrition.calories}</span> Kcal
											</div>
											<div>｜</div>
											<div>
												P <span>{product.nutrition.protein}</span>
											</div>
											<div>｜</div>
											<div>
												F <span>{product.nutrition.fat}</span>
											</div>
											<div>｜</div>
											<div>
												C <span>{product.nutrition.carbs}</span>
											</div>
										</div>

										<p className="fw-normal text-brown-300 text-truncate">
											{product.product_type === 'set'
												? `${product.ingredients.main}、新鮮蔬菜`
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
			</section>

			{/* <button type="button" onClick={() => setIsShowModal(true)}>
				打開modal
			</button>
			<ConfirmModal
				style={'front'}
				show={isShowModal}
				closeModal={handleClose}
				text_icon={`bi bi-bag-check-fill`}
				text_title={'確定要送購物車'}
				text_content={'請確認購物內容及金額'}
				text_cancel={'取消'}
				cancelModal={handleClose}
				text_confirm={'確認'}
				confirmModal={handleClose}
			/> */}
		</div>
	);
}
