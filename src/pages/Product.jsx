import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getAllProducts } from '../api/ApiClient';
import seafoodTag from '../assets/image/product/seafood.svg';
import beefTag from '../assets/image/product/beef.svg';
import coffeeTag from '../assets/image/product/coffee.svg';
import alcoholTag from '../assets/image/product/alcohol.svg';
import milkTag from '../assets/image/product/milk.svg';
import spicyTag from '../assets/image/product/spicy.svg';
import sugarTag from '../assets/image/product/sugar.svg';
import MenuSection from '../components/product/MenuSection';

const BLOCK_CONTENT_OPTIONS = [
	{
		icon: 'allergies',
		title: '經典綠果碗',
		subtitle: '由主廚精心搭配的營養組合',
	},
	{
		icon: 'water_medium',
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
			icon: 'water_medium',
			title: '健康飲品',
			subtitle: '讓營養更完整的健康飲品',
		},
		sort: [
			{ value: 'likeToLow', label: '人氣：高 → 低' },
			{ value: 'priceToHigh', label: '價格：低 → 高' },
			{ value: 'priceToLow', label: '價格：高 → 低' },
		],
		tab: [
			{ value: 'all', label: '全部' },
			{ value: 'tea', label: '茶' },
			{ value: 'coffee', label: '咖啡' },
			{ value: 'juice', label: '果汁' },
		],
		flavor: [
			{ value: 'alcohol', label: '無酒精', img: alcoholTag },
			{ value: 'caffeine', label: '無咖啡因', img: coffeeTag },
			{ value: 'sugar', label: '無糖', img: sugarTag },
		],
	},
	soup: {
		category: 'soup',
		title: {
			icon: 'onsen',
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
				console.log(data);
				setApiProdutsData(data);
				setIsLoading(false);
			} catch (error) {
				console.log(error.response);
			}
		};
		getProducts();
	}, []);

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
	const renderDisplayData = (apiProdutsData, filterState, category) => {
		const filterData = apiProdutsData.filter(product => {
			if (product.product_type !== category) return false;
			if (filterState[category].tab !== 'all') {
				if (!product.tab_collection.includes(filterState[category].tab)) return false;
			}
			if (product.include_tags) {
				for (const filterFlavor of filterState[category].flavor) {
					if (product.include_tags?.includes(filterFlavor)) return false;
				}
			}
			return true;
		});
		const sortData = [...filterData];
		switch (filterState[category].sort) {
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
			<MenuSection
				data={DATA}
				category="set"
				filterState={filterState}
				toggleTabFilter={toggleTabFilter}
				flavorSelect={flavorSelect}
				toggleFlavorFilter={toggleFlavorFilter}
				sortSelect={sortSelect}
				toggleSortFilter={toggleSortFilter}
				apiProdutsData={apiProdutsData}
				renderDisplayData={renderDisplayData}
			/>
			<MenuSection
				data={DATA}
				category="drinks"
				filterState={filterState}
				toggleTabFilter={toggleTabFilter}
				flavorSelect={flavorSelect}
				toggleFlavorFilter={toggleFlavorFilter}
				sortSelect={sortSelect}
				toggleSortFilter={toggleSortFilter}
				apiProdutsData={apiProdutsData}
				renderDisplayData={renderDisplayData}
			/>
			<MenuSection
				data={DATA}
				category="soup"
				filterState={filterState}
				toggleTabFilter={toggleTabFilter}
				flavorSelect={flavorSelect}
				toggleFlavorFilter={toggleFlavorFilter}
				sortSelect={sortSelect}
				toggleSortFilter={toggleSortFilter}
				apiProdutsData={apiProdutsData}
				renderDisplayData={renderDisplayData}
			/>
		</div>
	);
}
