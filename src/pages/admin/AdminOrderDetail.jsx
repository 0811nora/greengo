import { Modal, Accordion } from 'react-bootstrap';
import AdmButton from '../../components/admin/common/AdmButton';

const OrderDetail = ({
	isModalShow,
	handleCloseDetail,
	orderDetail,
	timeStamp_date,
	timeStamp_time,
	renderTagStatus,
}) => {
	const memberContent_fields = [
		{
			key: '訂單時間',
			value: (
				<>
					{timeStamp_date(orderDetail?.create_at)}
					<span className="ms-2">{timeStamp_time(orderDetail?.create_at)}</span>
				</>
			),
		},
		{
			key: '取餐編號',
			value: orderDetail?.user.order_number,
		},
		{
			key: '訂單姓名',
			value: orderDetail?.user.name,
		},
		{
			key: '訂單信箱',
			value: orderDetail?.user.email,
		},
		{
			key: '訂單電話',
			value: orderDetail?.user.tel,
		},
		{
			key: '訂單狀態',
			value: renderTagStatus(orderDetail?.user.order_status),
		},
	];
	const paymentContent_fields = [
		{
			key: '交易時間',
			value: orderDetail?.paid_date ? (
				<>
					{timeStamp_date(orderDetail?.paid_date)}
					<span className="ms-2">{timeStamp_time(orderDetail?.paid_date)}</span>
				</>
			) : (
				'-'
			),
		},
		{
			key: '交易方式',
			value: orderDetail?.user.payment_method ? orderDetail?.user.payment_method : '-',
		},
		{
			key: '交易狀態',
			value: renderTagStatus(orderDetail?.user.payment_status),
		},
	];
	const handleModalFooterBtn_orderStatus = order_status => {
		switch (order_status) {
			case 'new':
				return (
					<button type="button" className="status-done lg w-100">
						<i className="bi bi-exclamation-triangle-fill me-2"></i>
						訂單未付款
					</button>
				);
			case 'prepare':
				return (
					<button type="button" className="adm__button__tertiary lg w-100">
						<i className="bi bi-clock me-2"></i>
						餐點製作中...
					</button>
				);
			case 'ready':
				return (
					<button
						type="button"
						className="adm__button__secondary lg w-100"
						onClick={() => {
							onPickBtn(order);
						}}
					>
						<i className="bi bi-check-circle-fill me-2"></i>
						領取餐點
					</button>
				);
			case 'done':
				return (
					<button type="button" className="status-done lg w-100">
						<i className="bi bi-check-circle-fill me-2"></i>
						餐點已領取
					</button>
				);
		}
	};
	const handleModalFooterBtn_paymentStatus = payment_status => {
		switch (payment_status) {
			case 'unpaid':
				return (
					<button type="button" className="adm__button__secondary lg w-100" onClick={() => onCheckoutBtn(order)}>
						<i className="bi bi-credit-card-2-back-fill me-2"></i>
						臨櫃結帳
					</button>
				);
			case 'paid':
				return (
					<button type="button" className="status-done lg w-100">
						<i className="bi bi-check-circle-fill me-2"></i>
						訂單已付款
					</button>
				);
		}
	};
	const orderProductsArry = Object.values(orderDetail?.products ?? {});
	console.log(orderProductsArry);

	const randerProductIncludes = (orderProduct, content) => {
		return orderProduct?.customizations?.included[content].map(item => item.title).join('、');
	};
	const randerProductAddon = (orderProduct, content) => {
		return (
			<p className="d-flex">
				{`+ ${orderProduct.customizations.addon[content].map(item => item.title).join('、')}`}
				<span className="ms-auto fw-medium  ">{`+ $${orderProduct.customizations.addon[content].map(item => item.price)}`}</span>
			</p>
		);
	};
	const ProductAccordion = ({ orderProduct, eventKey }) => {
		return (
			<Accordion.Item orderProduct={orderProduct} eventKey={eventKey}>
				<Accordion.Header className="fw-medium">
					{orderProduct.product.title}
					<span className="me-2 ms-auto">{`x ${orderProduct.qty}`}</span>
					<span className="fw-bold price">{`$${orderProduct.customizations.custom_total}`}</span>
				</Accordion.Header>
				<Accordion.Body>
					<div className="d-flex flex-column gap-2">
						<p>{`基底 : ${randerProductIncludes(orderProduct, 'base')}`}</p>
						<p>{`主食 : ${randerProductIncludes(orderProduct, 'protein')}`}</p>
						<p>{`配菜 : ${randerProductIncludes(orderProduct, 'side')}`}</p>
						<p>{`醬料 : ${randerProductIncludes(orderProduct, 'sauce')}`}</p>
					</div>
					<hr />
					<div className="d-flex flex-column gap-2">
						{orderProduct.customizations.addon.base.map(item => (
							<p className="d-flex">
								{`+ ${item.title}`}
								<span className="ms-auto fw-medium  ">{`+ $${item.price}`}</span>
							</p>
						))}
					</div>
				</Accordion.Body>
			</Accordion.Item>
			// <div className="accordion-item">
			// 	<h2 className="accordion-header">
			// 		<button
			// 			className="accordion-button collapsed fw-medium"
			// 			type="button"
			// 			data-bs-toggle="collapse"
			// 			data-bs-target="#id-1"
			// 			aria-expanded="false"
			// 			aria-controls="id-1"
			// 		>
			// 			149自由配 - 均衡
			// 			<span className="me-2 ms-auto">x 1</span>
			// 			<span className="fw-bold price">$520</span>
			// 		</button>
			// 	</h2>
			// 	<div id="id-1" className="accordion-collapse collapse">
			// 		<div className="accordion-body">
			//
			// 		</div>
			// 	</div>
			// </div>
		);
	};

	return (
		<div>
			<Modal
				show={isModalShow}
				onHide={handleCloseDetail}
				dialogClassName="adm-theme order-detail"
				aria-labelledby="order-detail"
				size="lg"
				scrollable="false"
			>
				<Modal.Header closeButton>
					<h5 className="modal-title">訂單詳情</h5>
					<p className="fw-medium  adm_text-primary ms-3 ">{orderDetail?.id}</p>
				</Modal.Header>

				<Modal.Body className="d-flex flex-column gap-9 p-7">
					{/* 訂單資料 / 交易資訊 */}
					<div className="container-fluid">
						<div className="row">
							<div className="col-6">
								<div className="member-content">
									<div className="d-flex gap-3">
										<p className="subtitle">
											<i className="bi bi-tag-fill me-2"></i>訂單資訊
										</p>
									</div>
									<ul className="d-flex flex-column gap-3">
										{memberContent_fields.map((field, index) => (
											<li key={index}>
												<p className="key">{field.key}</p>
												<p className="value">{field.value}</p>
											</li>
										))}
									</ul>
								</div>
							</div>
							<div className="col-6">
								<div className="payment-content">
									<div className="d-flex gap-3">
										<p className="subtitle">
											<i className="bi bi-tag-fill me-2"></i> 交易資訊
										</p>
									</div>
									<ul className="d-flex flex-column gap-3">
										{paymentContent_fields.map((field, index) => (
											<li key={index}>
												<p className="key">{field.key}</p>
												<p className="value">{field.value}</p>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
					{/* 訂單內容 */}
					<div className="container-fluid">
						<div className="products-content">
							<p className="subtitle">
								<i className="bi bi-tag-fill me-2"></i> 訂單內容
							</p>
							<Accordion defaultActiveKey="0">
								{orderProductsArry.map((orderProduct, index) => (
									<ProductAccordion orderProduct={orderProduct} eventKey={String(index)} key={index} />
								))}

								{/* <div className="accordion-item">
									<h2 className="accordion-header">
										<button
											className="accordion-button collapsed fw-medium"
											type="button"
											data-bs-toggle="collapse"
											data-bs-target="#id-1"
											aria-expanded="false"
											aria-controls="id-1"
										>
											149自由配 - 均衡
											<span className="me-2 ms-auto">x 1</span>
											<span className="fw-bold price">$520</span>
										</button>
									</h2>
									<div id="id-1" className="accordion-collapse collapse">
										<div className="accordion-body">
											<div className="d-flex flex-column gap-2">
												<p>基底 : 糙米飯</p>
												<p>主食 : 雞胸肉</p>
												<p>配菜 : 番茄、玉米、洋蔥、花椰菜、杏苞菇、酪梨</p>
												<p>醬料 : 優格醬</p>
											</div>
											<hr />
											<div className="d-flex flex-column gap-2">
												<p className="d-flex">
													+ 酪梨
													<span className="ms-auto fw-medium  ">+ $20</span>
												</p>
												<p className="d-flex">
													+ 番茄
													<span className="ms-auto fw-medium  ">+ $20</span>
												</p>
											</div>
										</div>
									</div>
								</div>
								<div className="accordion-item">
									<h2 className="accordion-header">
										<button
											className="accordion-button collapsed fw-medium"
											type="button"
											data-bs-toggle="collapse"
											data-bs-target="#2"
											aria-expanded="false"
											aria-controls="flush-collapseOne"
										>
											經典雙雞蛋白碗
											<span className="me-2 ms-auto">x 1</span>
											<span className="fw-bold price">$520</span>
										</button>
									</h2>
									<div id="2" className="accordion-collapse collapse">
										<div className="accordion-body">
											<div className="d-flex flex-column gap-2">
												<p className="d-flex">
													+ 酪梨
													<span className="ms-auto fw-medium ">+ $20</span>
												</p>
												<p className="d-flex">
													+ 番茄
													<span className="ms-auto fw-medium ">+ $20</span>
												</p>
											</div>
										</div>
									</div>
								</div>
								<div className="accordion-item">
									<h2 className="accordion-header">
										<div className="accordion-button collapsed fw-medium">
											日式味噌湯
											<span className="me-2 ms-auto">x 1</span>
											<span className="fw-bold price">$40</span>
										</div>
									</h2>
								</div>
								<div className="accordion-item">
									<h2 className="accordion-header">
										<div className="accordion-button collapsed fw-medium">
											無糖蕎麥烏龍​茶
											<span className="me-2 ms-auto">x 1</span>
											<span className="fw-bold price">$40</span>
										</div>
									</h2>
								</div> */}
							</Accordion>
							<div className="amount">
								<p>
									<span>小計</span>
									<span>1120</span>
								</p>
								<p>
									<span>折扣</span>
									<span>- 0</span>
								</p>
								<p className="total-price">
									<span>總計</span>
									<span className="adm_text-primary ">{`$${orderDetail?.total}`}</span>
								</p>
							</div>
						</div>
					</div>
				</Modal.Body>

				<Modal.Footer className="d-flex align-items-center gap-3">
					<div className="container-fluid">
						<div className="row">
							<div className="col-6">
								<div>{handleModalFooterBtn_orderStatus(orderDetail?.user.order_status)}</div>
							</div>
							<div className="col-6">
								<div>{handleModalFooterBtn_paymentStatus(orderDetail?.user.payment_status)}</div>
							</div>
						</div>
					</div>
				</Modal.Footer>
			</Modal>
		</div>
	);
};
export default OrderDetail;
