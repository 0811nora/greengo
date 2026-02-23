import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllProducts, postAddToCart } from '../api/ApiClient';
import { notify } from '../components/Notify';
import MenuSection from '../components/product/MenuSection';
import DATA from '../config/productUiData';
import ProductDetail from './ProductDetail';
import Loader from '../components/common/Loading';

// header 購物車
import { useDispatch } from 'react-redux';
import { renderRefresh } from '../../src/store/slices/cartSlice';

const BLOCK_CONTENT_OPTIONS = [
	{
		icon: 'allergies',
		title: '經典綠果碗',
		subtitle: '由主廚精心搭配的營養組合',
		category: 'set',
	},
	{
		icon: 'local_cafe',
		title: '健康飲品',
		subtitle: '讓營養更完整的健康飲品',
		category: 'drinks',
	},
	{
		icon: 'soup_kitchen',
		title: '溫暖湯品',
		subtitle: '讓營養更均衡的溫暖湯品',
		category: 'soup',
	},
];
const INITIAL_STATE_STATE = {
	set: {
		tab: 'all',
		flavor: [],
		flavorSelect: null,
		sort: 'default',
		sortSelect: null,
	},
	drinks: {
		tab: 'all',
		flavor: [],
		flavorSelect: null,
		sort: 'default',
		sortSelect: null,
	},
	soup: {
		tab: 'all',
		flavor: [],
		flavorSelect: null,
		sort: 'default',
		sortSelect: null,
	},
};
const INITIAL_CUSTOMIZATIONS = {
	customizations: {
		addon: null,
		custom_total: 0,
		extra_price: 0,
		included: null,
		plan_info: {
			base_price: 0,
			plan_type: 'set',
		},
		total_nutrition: {
			calories: 0,
			carbs: 0,
			fat: 0,
			protein: 0,
		},
	},
};

export default function Product() {
	const [apiProdutsData, setApiProdutsData] = useState([]);
	const [filterState, setFilterState] = useState(INITIAL_STATE_STATE);
	const [isDataLoading, setIsDataLoading] = useState(true);
	const [isAddCartLoading, setIsAddCartLoading] = useState(false);
	const [isBlockDisappear, setIsBlockDisappear] = useState(false);
	const [isShowSmallFilterItem, setIsShowSmallFilterItem] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();
	const dispatch = useDispatch();

	// 如果media小於768px，則大block消失，小block出現
	const md_media = window.matchMedia('(max-width: 768px)');
	const filterBlockShowInMedia = () => {
		if (md_media.matches) {
			setIsBlockDisappear(true);
		} else {
			setIsBlockDisappear(false);
		}
	};

	// 打開右下小 filter block
	const openSmallFilterBlock = () => {
		if (isShowSmallFilterItem) {
			setIsShowSmallFilterItem(false);
		} else {
			setIsShowSmallFilterItem(true);
		}
	};

	// filter block items useRef
	const anchorSectionRef = {
		set: useRef(null),
		drinks: useRef(null),
		soup: useRef(null),
	};

	// filter block 如果滾動滑鼠消失在視窗中時
	const filterBlockRef = useRef(null);
	const checkIsBlockDisappear = () => {
		const blockRange = filterBlockRef.current.getBoundingClientRect();

		if (blockRange.bottom < 0) {
			setIsBlockDisappear(true);
			setIsShowSmallFilterItem(false);
		}
		if (blockRange.top > 0) {
			setIsBlockDisappear(false);
		}
	};

	// 獲取產品資料(戳API)
	const getProducts = async () => {
		try {
			const res = await getAllProducts();
			const productData = res.data.products.filter(
				product => product.category !== 'item' && product.category !== 'custom',
			);
			setApiProdutsData(productData);
			setIsDataLoading(false);
		} catch (error) {
			console.log(error.response);
			setIsDataLoading(false);
		}
	};

	// 初始化的行為
	useEffect(() => {
		getProducts();
		window.addEventListener('scroll', checkIsBlockDisappear);
		md_media.addEventListener('change', filterBlockShowInMedia);
		filterBlockShowInMedia();

		return () => {
			window.removeEventListener('scroll', checkIsBlockDisappear);
			md_media.removeEventListener('change', filterBlockShowInMedia);
		};
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
		const flavorNewArry = value.map(valueItem => valueItem.value);
		setFilterState(prev => ({
			...prev,
			[category]: {
				...prev[category],
				flavor: flavorNewArry,
				flavorSelect: value,
			},
		}));
	};
	const toggleSortFilter = (category, value) => {
		setFilterState(prev => ({
			...prev,
			[category]: {
				...prev[category],
				sort: value.value,
				sortSelect: value,
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

	// 開啟產品詳細頁
	const handleOpenDetail = id => {
		navigate(`/product/${id}`);
	};

	// 關閉產品詳細頁
	const handleCloseDetail = () => {
		navigate(`/product`);
	};

	// 加入購物車
	const handleAddCart = async (id, qty = 1, productDetail) => {
		setIsAddCartLoading(true);
		// 如果之後加購addon可以使用，再來擴充
		const customizationsData = {
			customizations: {
				...INITIAL_CUSTOMIZATIONS.customizations,
				addon: null,
				custom_total: productDetail?.price,
				extra_price: 0,
				included: null,
				plan_info: {
					base_price: productDetail?.price,
					plan_type: productDetail?.product_type,
				},
				total_nutrition: {
					calories: productDetail?.nutrition.calories,
					carbs: productDetail?.nutrition.carbs,
					fat: productDetail?.nutrition.fat,
					protein: productDetail?.nutrition.protein,
				},
			},
		};

		const data = {
			product_id: id,
			qty: qty,
			...customizationsData,
		};
		try {
			const res = await postAddToCart(data);
			setIsAddCartLoading(false);
			notify('success', '加入購物車成功', 'bottom-center');
			dispatch(renderRefresh()); // <-- header購物車redux
			handleCloseDetail();
		} catch (error) {
			console.log(error);
			setIsAddCartLoading(false);
			notify('error', '加入購物車失敗', 'bottom-center');
		}
	};

	// filter block btn 錨點功能
	const handleAnchor = category => {
		anchorSectionRef[category].current?.scrollIntoView({ behavior: 'smooth', block: 'center', offset: '100px' });
	};

	return (
		<div className="product-page">
			{isDataLoading && <Loader mode={'page'} show={isDataLoading} />}

			{/* 菜單hero */}
			<header>
				<div className="container d-flex flex-column justify-content-between align-items-center">
					<div className="d-flex flex-column align-items-center animate__animated animate__fadeInDown">
						<h1 className="mb-6">Green Go 精選菜單</h1>
						<div className="d-flex flex-column flex-md-row">
							<h5 className="m-1">當季最新鮮、營養最到位，</h5>
							<h5 className="m-1">每一口都是 GreenGo 的健康提案</h5>
						</div>
					</div>
				</div>
				{/* 向下箭頭 */}
				{/* <div className="z-1">
					<i className="bi bi-arrow-down mt-4 text-white"></i>
				</div> */}
			</header>

			{/* 菜單錨點 */}
			<section className="position-relative" ref={filterBlockRef}>
				<div
					className={`block-filter container position-absolute top-0 start-50 translate-middle ${isBlockDisappear ? 'hidden' : ''}`}
				>
					<div className="d-flex flex-column flex-md-row justify-content-between gap-6 gap-xxl-8 ">
						{BLOCK_CONTENT_OPTIONS.map((option, index) => (
							<div
								className="block-item d-flex flex-column align-items-center animate__animated animate__zoomIn"
								key={index}
								onClick={() => handleAnchor(option.category)}
							>
								<span className="material-symbols-rounded">{option.icon}</span>
								<p className="h5 fw-semibold">{option.title}</p>
								<p className="text-center">{option.subtitle}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 固定餐 */}
			<MenuSection
				data={DATA}
				category="set"
				filterState={filterState}
				toggleTabFilter={toggleTabFilter}
				toggleFlavorFilter={toggleFlavorFilter}
				toggleSortFilter={toggleSortFilter}
				apiProdutsData={apiProdutsData}
				renderDisplayData={renderDisplayData}
				handleOpenDetail={handleOpenDetail}
				isAddCartLoading={isAddCartLoading}
				handleAddCart={handleAddCart}
				anchorSectionRef={anchorSectionRef}
			/>
			{/* 自由配導購區塊 */}
			<section className="CTA-custom mt-10 d-flex justify-content-center align-items-center">
				<div className="CTA-content d-flex flex-column align-items-center px-9 pt-10 pb-9">
					<h2 className="mb-4">沒遇到理想的那「碗」嗎？</h2>
					<h6 className="mb-8">到自選菜單，自由搭配出你的理想滋味吧！</h6>
					<button type="button" className="home__btn-primary " onClick={() => navigate('/custom')}>
						前往客製化點餐
					</button>
				</div>

				{/* <div className="d-flex flex-md-row flex-column">
						<div className="col-md-5 col-12">
							<div className="img">
								<img
									src="https://images.unsplash.com/photo-1551218372-a8789b81b253?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
									alt="CTA-custom"
								/>
							</div>
						</div>
						<div className="col-md-7 col-12">
							<div className="content d-flex flex-column justify-content-center align-items-center">
								<h2 className="mb-4 fs-xl-2 fs-3">沒遇到理想的那「碗」嗎？</h2>
								<h6 className="mb-8">到自選菜單，自由搭配出你的理想滋味吧！</h6>
								<button type="button" className="home__btn-primary " onClick={() => navigate('/custom')}>
									前往客製化點餐
								</button>
							</div>
						</div>
					</div> */}
			</section>

			{/* 飲料 */}
			<MenuSection
				data={DATA}
				category="drinks"
				filterState={filterState}
				toggleTabFilter={toggleTabFilter}
				toggleFlavorFilter={toggleFlavorFilter}
				toggleSortFilter={toggleSortFilter}
				apiProdutsData={apiProdutsData}
				renderDisplayData={renderDisplayData}
				handleOpenDetail={handleOpenDetail}
				isAddCartLoading={isAddCartLoading}
				handleAddCart={handleAddCart}
				anchorSectionRef={anchorSectionRef}
			/>

			{/* 湯品 */}
			<MenuSection
				data={DATA}
				category="soup"
				filterState={filterState}
				toggleTabFilter={toggleTabFilter}
				toggleFlavorFilter={toggleFlavorFilter}
				toggleSortFilter={toggleSortFilter}
				apiProdutsData={apiProdutsData}
				renderDisplayData={renderDisplayData}
				handleOpenDetail={handleOpenDetail}
				isAddCartLoading={isAddCartLoading}
				handleAddCart={handleAddCart}
				anchorSectionRef={anchorSectionRef}
			/>
			{/* smallFilterBlock */}
			<div
				className={`small-block-section d-flex flex-column justify-content-end align-items-center ${isShowSmallFilterItem ? 'itemShow' : ''} ${isBlockDisappear ? 'show' : ''}`}
			>
				<div
					className={`small-filter-block set ${isShowSmallFilterItem ? 'show' : ''}`}
					onClick={() => handleAnchor('set')}
				>
					<div className="d-flex justify-content-center align-items-center block">
						<span className="material-symbols-rounded">allergies</span>
					</div>
					<p>綠果碗</p>
				</div>
				<div
					className={`small-filter-block drinks ${isShowSmallFilterItem ? 'show' : ''}`}
					onClick={() => handleAnchor('drinks')}
				>
					<div className="d-flex justify-content-center align-items-center block">
						<span className="material-symbols-rounded">local_cafe</span>
					</div>
					<p>飲品</p>
				</div>
				<div
					className={`small-filter-block soup ${isShowSmallFilterItem ? 'show' : ''}`}
					onClick={() => handleAnchor('soup')}
				>
					<div className="d-flex justify-content-center align-items-center block">
						<span className="material-symbols-rounded">soup_kitchen</span>
					</div>
					<p>湯品</p>
				</div>
				<div
					className={`small-filter-block menu ${isShowSmallFilterItem ? 'show' : ''}`}
					onClick={openSmallFilterBlock}
				>
					<div className="d-flex justify-content-center align-items-center block">
						<span className="material-symbols-rounded">menu_book</span>
					</div>
					{/* <p>菜單</p> */}
				</div>
			</div>
			{id && (
				<ProductDetail
					handleCloseDetail={handleCloseDetail}
					isAddCartLoading={isAddCartLoading}
					handleAddCart={handleAddCart}
				/>
			)}
		</div>
	);
}
