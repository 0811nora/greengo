import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Select from 'react-select';
import classNames from 'classnames';
import { getAllProducts } from '../api/ApiClient';
import seafoodTag from '../assets/img/product/Seafood.svg';
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
		icon: 'water_medium',
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
			{ value: 'beef', label: '不含牛肉' },
			{ value: 'pork', label: '不含豬肉' },
			{ value: 'seafood', label: '不含海鮮' },
			{ value: 'spicy', label: '不辣' },
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
			{ key: 'alcohol', label: '無酒精' },
			{ key: 'caffeine', label: '無咖啡因' },
			{ key: 'sugar', label: '無糖' },
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
			{ key: 'all', label: '全部' },
			{ key: 'freshSoup', label: '清爽湯' },
			{ key: 'proteinSoup', label: '高蛋白湯' },
			{ key: 'vegSoup', label: '素食湯' },
		],
		flavor: [
			{ key: 'beef', label: '不含牛肉' },
			{ key: 'daily', label: '不含奶' },
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
	const [isShowModal, setIsShowModal] = useState(false);

	const handleClose = () => {
		alert('關閉modal');
		setIsShowModal(false);
	};

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

				<div className="tab-filter d-flex justify-content-between align-items-center gap-4">
					{/* 固定餐類別篩選 */}
					<ul class="nav nav-underline d-flex gap-6 flex-fill">
						{DATA.set.tab.map((tabItem, index) => (
							<li className="nav-item" key={index}>
								<button
									className="nav-link tab-navLink"
									value={tabItem.value}
									onClick={e => toggleTabFilter('set', e.target.value)}
								>
									{tabItem.label}
								</button>
							</li>
						))}
					</ul>

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

				<div className="row mt-9">
					{JSON.stringify(filterState)}

					{/* {displayProdutsData.map(product => (
						<div className="col-3" key={product.id}>
							<div className="card">
								<div className="img position-raletive">
									<img
										src="https://storage.googleapis.com/vue-course-api.appspot.com/miniburger/1770205696564.png"
										className="card-img-top"
										alt={product.title}
									/>
								</div>
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
					))} */}
				</div>
			</section>
			<button type="button" onClick={() => setIsShowModal(true)}>
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
			/>
		</div>
	);
}
