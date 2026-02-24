import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getSingleProduct } from '../api/ApiClient';
import { renderUITab, renderUITag } from '../utils/productUiRender';
import DonutPFC from '../components/custom-comp/PFC_Chart';
import Loader from '../components/common/Loading';

const ProductDetail = ({ handleCloseDetail, isAddCartLoading, handleAddCart }) => {
	const { id } = useParams();
	const [productDetail, setProductDetail] = useState(null);
	const [num, setNum] = useState(1);
	const [isDataLoading, setIsDataLoading] = useState(true);

	// 取得單一產品資料
	useEffect(() => {
		const getProductDetail = async () => {
			try {
				const res = await getSingleProduct(id);
				setProductDetail(res.data.product);
				setIsDataLoading(false);
			} catch (error) {
				console.log(error.response);
				setIsDataLoading(false);
				notify('error', '資料讀取失敗，請重新整理', 'bottom-center');
			}
		};
		getProductDetail();
	}, [id]);

	// 點擊數量按鈕，決定訂購數量
	const handleAddNum = () => {
		if (num >= 20) return;
		setNum(num + 1);
	};
	const handleMinusNum = () => {
		if (num <= 1) return;
		setNum(num - 1);
	};

	// 加入購物車(包含戳API)
	// const addCart = async (id, qty) => {
	// 	setIsAddCartLoading(true);
	// 	const data = {
	// 		product_id: id,
	// 		qty: qty,
	// 	};
	// 	try {
	// 		const res = await postAddToCart(data);
	// 		console.log(res.data);
	// 		setIsAddCartLoading(false);
	// 		notify('success', '加入購物車成功', 'bottom-center');
	// 		handleCloseDetail();
	// 	} catch (error) {
	// 		console.log(error);
	// 		setIsAddCartLoading(false);
	// 		notify('error', '加入購物車失敗', 'bottom-center');
	// 	}
	// };

	return (
		<div className="productDetail-page bg-gray-50">
			<Modal
				show={Boolean(id)} // 判斷又沒有網址後面有沒有id，決定modal的出現與否
				onHide={handleCloseDetail}
				dialogClassName="product-detail"
				aria-labelledby="product-detail"
				size="xl"
				scrollable="false"
			>
				<Modal.Header closeButton className="px-8 py-5">
					{/* <Modal.Title id="productDetailModal">{productDetail?.title}</Modal.Title> */}
				</Modal.Header>

				<Modal.Body className="px-8">
					{isDataLoading ? (
						<Loader mode={'mask'} show={isDataLoading} text={'查看產品內容..'} />
					) : (
						<div className="container">
							<div className="d-flex flex-lg-row flex-column ">
								<div className="col-lg-5 col-12 position-relative">
									{/* img */}
									<div className="py-7 position-sticky top-0">
										<div className="img d-flex justify-content-center ">
											<img src={productDetail?.imageUrl} alt={productDetail?.title} />
										</div>
									</div>
								</div>
								<div className="col-lg-7 col-12 ps-lg-8">
									{/* info */}
									<div className=" info d-flex flex-column gap-5">
										{/* title, tag */}
										<div className="d-flex">
											<h1 className="h3 fw-semibold me-4">{productDetail?.title}</h1>
											<div className=" flavorTag d-flex align-items-center gap-2">
												{renderUITag(productDetail?.include_tags, productDetail?.product_type)?.map(
													(img, index) => (
														<div key={index}>
															<img src={img} alt="忌口選擇標籤" />
														</div>
													),
												)}
											</div>
										</div>
										{/* tab */}
										<div className="tab d-flex gap-2">
											{renderUITab(productDetail?.tab_collection, productDetail?.product_type)?.map(
												(item, index) => (
													<span className="tabPill" key={index}>
														{item}
													</span>
												),
											)}
										</div>
										{/* description */}
										<div className="d-flex flex-column gap-2">
											<p>{`${productDetail?.grams}克 / ${productDetail?.product_type === 'drinks' ? '杯' : '碗'}`}</p>
											<p className="description">{productDetail?.description}</p>
										</div>
										{/* price */}
										<h5 className="fw-semibold">{`NT$ ${productDetail?.price}`}</h5>
									</div>
									{/* ingredient */}
									<div className="ingredient">
										<h6 className="mb-5">內容物清單</h6>
										<div className="d-flex flex-column gap-3 ">
											<p>
												<span className="key">基底</span>
												{productDetail?.ingredients.base}
											</p>
											{productDetail?.product_type === 'set' ? (
												<>
													<p>
														<span className="key">主食</span>
														{productDetail?.ingredients.main}
													</p>
													<p>
														<span className="key">配菜</span>
														{productDetail?.ingredients.side}
													</p>
													<p>
														<span className="key">醬料</span>
														{productDetail?.ingredients.source}
													</p>
												</>
											) : (
												''
											)}
										</div>
									</div>
									{/* nutrition */}
									<div className="nutrition d-flex flex-sm-row flex-column justify-content-between align-items-bottom">
										<div className="nutrition-content">
											<h6 className="mb-5">營養素資訊</h6>
											<div className="d-flex flex-column gap-3">
												<p>
													<span className="key">熱量 Cal</span>
													{`${productDetail?.nutrition.calories} Kcal`}
												</p>
												<p>
													<span className="key">蛋白質 P</span>
													{`${productDetail?.nutrition.protein} g`}
												</p>
												<p>
													<span className="key">脂肪量 F</span>
													{`${productDetail?.nutrition.fat} g`}
												</p>
												<p>
													<span className="key">碳水量 C</span>
													{`${productDetail?.nutrition.carbs} g`}
												</p>
											</div>
										</div>
										<div className="nutrition-chart mt-5 mt-sm-0">
											<DonutPFC
												protein={productDetail?.nutrition.protein}
												fat={productDetail?.nutrition.fat}
												carbs={productDetail?.nutrition.carbs}
												calories={productDetail?.nutrition.calories}
											/>
										</div>
									</div>
									{/* addon */}
									{/* <div className="addon py-7">
									<h6 className="mb-4">加購配料（皆另外包裝）</h6>
								
									<div>
										<Accordion defaultActiveKey="0" flush>
											<Accordion.Item eventKey="0">
												<Accordion.Header>加購額外基底</Accordion.Header>
												<Accordion.Body className="d-flex flex-column gap-4">
													{apiItemData
														.filter(item => item.product_type === 'base')
														.map(item => (
															<Form.Group className="d-flex align-items-center" key={item.id}>
																<Form.Label
																	htmlFor={item.title}
																	className="d-flex align-items-center gap-4 me-auto"
																>
																	<img src={item.imageUrl} alt={item.title} />
																	<div>
																		<p>{item.title}</p>
																		<span>{`${item.grams}g / ${item.nutrition.calories}Kcal ｜P ${item.nutrition.protein}｜F ${item.nutrition.fat}｜C ${item.nutrition.carbs}`}</span>
																	</div>
																</Form.Label>

																<div className="d-flex align-items-center">
																	<Form.Label htmlFor={item.title}>{`+ $${item.price}`}</Form.Label>
																	<Form.Check type="checkbox" id={item.title} />
																</div>
															</Form.Group>
														))}
												</Accordion.Body>
											</Accordion.Item>
											<Accordion.Item eventKey="1">
												<Accordion.Header>加購額外主食​ (蛋白質)</Accordion.Header>
												<Accordion.Body>
													<Form.Check type="checkbox" id="addon-1" label="Check this switch" />
												</Accordion.Body>
											</Accordion.Item>
											<Accordion.Item eventKey="2">
												<Accordion.Header>加購額外醬​汁</Accordion.Header>
												<Accordion.Body>
													<Form.Check type="checkbox" id="addon-1" label="Check this switch" />
												</Accordion.Body>
											</Accordion.Item>
											<Accordion.Item eventKey="3">
												<Accordion.Header>加購額外​配料​</Accordion.Header>
												<Accordion.Body>
													<Form.Check type="checkbox" id="addon-1" label="Check this switch" />
												</Accordion.Body>
											</Accordion.Item>
										</Accordion>
									</div>
								</div> */}
								</div>
							</div>
						</div>
					)}
				</Modal.Body>

				<Modal.Footer className="d-flex flex-sm-row flex-column align-items-center justify-content-between gap-3">
					<div className="num-control d-flex align-items-center justify-content-between gap-4 ">
						<button className={`minus ${num <= 1 ? 'disable' : ''}`} onClick={handleMinusNum}>
							<i className="bi bi-dash"></i>
						</button>
						<span className="fw-semibold text-center">{num}</span>
						<button className={`add ${num >= 20 ? 'disable' : ''} `} onClick={handleAddNum}>
							<i className="bi bi-plus"></i>
						</button>
					</div>

					<button
						className="addCart flex-fill"
						onClick={() => {
							handleAddCart(productDetail.id, num, productDetail);
						}}
						disabled={isAddCartLoading}
					>
						<p>
							{`加入 ${num} 份商品至購物車`}
							<span className="fw-semibold ms-4">{`NT$ ${(productDetail?.price * num).toLocaleString()}`}</span>
							<Loader mode="button" show={isAddCartLoading} className={'ms-2'} />
						</p>
					</button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default ProductDetail;
