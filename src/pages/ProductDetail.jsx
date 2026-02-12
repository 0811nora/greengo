import { useEffect, useState } from 'react';
import { Modal, Button, Accordion, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getSingleProduct } from '../api/ApiClient';

export default function ProductDetail({ isOpenDetailModal, handleCloseDetailModal }) {
	const { id } = useParams();
	const [productDetail, setProductDetail] = useState(null);
	useEffect(() => {
		const getProductDetail = async () => {
			try {
				const res = await getSingleProduct(id);
				console.log(res.data);
				setProductDetail(res.data.product);
			} catch (error) {
				console.log(error.response);
			}
		};
		getProductDetail();
	}, [id]);
	return (
		<Modal
			show={isOpenDetailModal}
			onHide={handleCloseDetailModal}
			dialogClassName="modal-90w"
			aria-labelledby="productDetailModal"
			size="xl"
			className="product-detail"
			scrollable="false"
		>
			<Modal.Header closeButton>
				<Modal.Title id="productDetailModal">{productDetail?.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="container">
					<div className="row">
						<div className="col-6">
							<div className="img">
								<img src={productDetail?.imageUrl} alt={productDetail?.title} />
							</div>
						</div>
						<div className="col-6">
							<div className=" info d-flex flex-column gap-4 py-7">
								<h1 className="h3 fw-semibold">{productDetail?.title}</h1>
								<div className="tabTag d-flex gap-1">
									<span>多多蛋白</span>
									<span>低脂低卡</span>
								</div>
								<p>500克 / 碗</p>
								<p className="description">{productDetail?.description}</p>
								<h5 className="fw-semibold">NT$210</h5>
							</div>
							<div className="ingredient py-7">
								<h6 className="mb-4">內容物清單</h6>
								<div className="d-flex flex-column gap-3 ">
									<p>
										<span className="key">基底</span>生菜
									</p>
									<p>
										<span className="key">主食</span>水​煮蛋、​雞胸​肉 x 2
									</p>
									<p>
										<span className="key">配菜</span>小​黃瓜、​醃黃瓜、​洋蔥、​彩椒、​番茄
									</p>
									<p>
										<span className="key">醬料</span>油醋醬
									</p>
								</div>
							</div>
							<div className="nutrition py-7">
								<h6 className="mb-4">營養素資訊</h6>
								<div className="d-flex gap-3">
									<p>
										<span className="key">熱量</span>368 Kcal
									</p>
									<p>
										<span className="key">蛋白質 P</span>10g
									</p>
									<p>
										<span className="key">脂肪量 F</span>10g
									</p>
									<p>
										<span className="key">碳水量 C</span>10g
									</p>
								</div>
							</div>
							{/* <div className="nutrition py-7">
								<h6 className="mb-4">營養素資訊</h6>
								<div className="d-flex gap-2">
									<div className="block">
										<p>
											熱量<span className="value">368</span>cal
										</p>
									</div>
									<div className="block">
										<p>
											蛋白量 P<span className="value">10</span>g
										</p>
									</div>
									<div className="block">
										<p>
											脂肪 F<span className="value">10</span>g
										</p>
									</div>
									<div className="block">
										<p>
											碳水量 C<span className="value">10</span>g
										</p>
									</div>
								</div>
							</div> */}
							<div className="addon py-7">
								<h6 className="mb-4">加購配料（皆另外包裝）</h6>
								<div>
									<Accordion defaultActiveKey="0" flush>
										<Accordion.Item eventKey="0">
											<Accordion.Header>加購額外基底</Accordion.Header>
											<Accordion.Body>
												<Form.Group className="d-flex align-items-center">
													<Form.Label htmlFor="rice" className="d-flex align-items-center gap-4 me-auto">
														<img
															src="https://storage.googleapis.com/vue-course-api.appspot.com/miniburger/1770714624399.png"
															alt=""
														/>
														<div>
															<p>白米</p>
															<span>100g / 130cal ｜P 10｜F 10｜C28</span>
														</div>
													</Form.Label>

													<div className="d-flex align-items-center">
														<Form.Label htmlFor="rice">+ $30</Form.Label>
														<Form.Check type="checkbox" id="rice" />
													</div>
												</Form.Group>
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
							</div>
						</div>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer className="d-flex align-items-center gap-3">
				<div className="num-control d-flex align-items-center justify-content-between gap-4">
					<button className="minus">
						<i class="bi bi-dash"></i>
					</button>
					<span className="fw-semibold text-center">1</span>
					<button className="add">
						<i class="bi bi-plus"></i>
					</button>
				</div>

				<button className="addCart flex-fill">加入3項項商品至購物車｜NT$ 500</button>
			</Modal.Footer>
		</Modal>
	);
}
