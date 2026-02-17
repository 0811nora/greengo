import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllProducts, postAddToCart } from '../api/ApiClient';
import { notify } from '../components/Notify';
import MenuSection from '../components/product/MenuSection';
import DATA from '../config/productUiData';
import ProductDetail from './ProductDetail';
import Loader from '../components/common/Loading';

const BLOCK_CONTENT_OPTIONS = [
	{
		icon: 'allergies',
		title: '經典綠果碗',
		subtitle: '由主廚精心搭配的營養組合',
	},
	{
		icon: 'local_cafe',
		title: '健康飲品',
		subtitle: '讓營養更完整的健康飲品',
	},
	{
		icon: 'soup_kitchen',
		title: '溫暖湯品',
		subtitle: '讓營養更均衡的溫暖湯品',
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

export default function Product() {
	const [apiProdutsData, setApiProdutsData] = useState([]);
	const [filterState, setFilterState] = useState(INITIAL_STATE_STATE);
	const [isDataLoading, setIsDataLoading] = useState(true);
	const [isAddCartLoading, setIsAddCartLoading] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
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

	const handleOpenDetail = id => {
		navigate(`/product/${id}`);
	};
	const handleCloseDetail = () => {
		navigate(`/product`);
	};
	const handleAddCart = async (id, qty = 1) => {
		setIsAddCartLoading(true);
		const data = {
			product_id: id,
			qty: qty,
		};
		try {
			const res = await postAddToCart(data);
			setIsAddCartLoading(false);
			notify('success', '加入購物車成功', 'top-right');
			handleCloseDetail();
		} catch (error) {
			console.log(error);
			setIsAddCartLoading(false);
			notify('error', '加入購物車失敗', 'top-right');
		}
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
				<div className="z-1">
					<i className="bi bi-arrow-down mt-4 text-white"></i>
				</div>
			</header>

			{/* 菜單錨點 */}
			<section className="position-relative">
				<div className="block-filter container position-absolute top-0 start-50 translate-middle">
					<div className="d-flex flex-column flex-md-row justify-content-between gap-6 gap-xxl-8 ">
						{BLOCK_CONTENT_OPTIONS.map((option, index) => (
							<div
								className="block-item d-flex flex-column align-items-center animate__animated animate__zoomIn"
								key={index}
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
			/>
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
