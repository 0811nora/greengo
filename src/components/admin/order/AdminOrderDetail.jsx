import { Modal, Accordion } from 'react-bootstrap';
import { Fragment } from 'react';

const OrderDetail = ({
	isModalShow,
	handleCloseDetail,
	orderDetail,
	timeStamp_date,
	timeStamp_time,
	renderTagStatus,
	OpenPickupPage,
	OpenCheckoutPage,
	formatPrice,
}) => {
	const payment_mothod_fields = [
		{ value: 'cash', label: '現金' },
		{ value: 'e_payment', label: '電子支付' },
		{ value: 'credit_card', label: '信用卡' },
	];

	const renderPaymentUI = payment_method => {
		if (!payment_method) return '-';
		return payment_mothod_fields.find(item => item.value === payment_method).label;
	};
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
			value: renderPaymentUI(orderDetail?.user.payment_method),
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
					<div className="status-done lg w-100 pe-none">
						<i className="bi bi-exclamation-triangle-fill me-2"></i>
						訂單未付款
					</div>
				);
			// case 'prepare':
			// 	return (
			// 		<button type="button" className="adm__button__tertiary lg w-100">
			// 			<i className="bi bi-clock me-2"></i>
			// 			餐點製作中...
			// 		</button>
			// 	);
			case 'ready':
				return (
					<button
						type="button"
						className="adm__button__secondary lg w-100"
						onClick={() => {
							OpenPickupPage(orderDetail);
						}}
					>
						<i className="bi bi-check-circle-fill me-2"></i>
						領取餐點
					</button>
				);
			case 'done':
				return (
					<div className="status-done lg w-100">
						<i className="bi bi-check-circle-fill me-2"></i>
						餐點已領取
					</div>
				);
		}
	};
	const handleModalFooterBtn_paymentStatus = payment_status => {
		switch (payment_status) {
			case 'unpaid':
				return (
					<button
						type="button"
						className="adm__button__secondary lg w-100"
						onClick={() => OpenCheckoutPage(orderDetail)}
					>
						<i className="bi bi-credit-card-2-back-fill me-2"></i>
						臨櫃結帳
					</button>
				);
			case 'paid':
				return (
					<div className="status-done lg w-100">
						<i className="bi bi-check-circle-fill me-2"></i>
						訂單已付款
					</div>
				);
		}
	};

	const included_fields = [
		{ value: 'base', label: '基底' },
		{ value: 'protein', label: '主食' },
		{ value: 'side', label: '配菜' },
		{ value: 'sauce', label: '醬料' },
	];
	const addon_fields = [
		{ value: 'base', label: '加購基底' },
		{ value: 'protein', label: '加購主食' },
		{ value: 'side', label: '加購配菜' },
		{ value: 'sauce', label: '加購醬料' },
	];

	//自由配各套餐的食材扣打
	const ingredient_Buckle = {
		protein: 30,
	};
	//自由配各套餐的食材扣打規則
	const plan_Buckle = {
		light: {
			protein: ingredient_Buckle.protein,
		},
		balanced: {
			protein: ingredient_Buckle.protein * 2,
		},
		highProtein: {
			protein: ingredient_Buckle.protein * 3,
		},
	};
	// 自由配套餐扣打判斷(蛋白質超過扣打,出現補差額金額)
	const handlePlanBuckle = (orderProduct, item) => {
		const plan_type = orderProduct.customizations.plan_info.plan_type;
		const proteinBuckle = plan_Buckle?.[plan_type].protein;
		const extraPrice = item.price - proteinBuckle;
		let visible = true;

		if (extraPrice <= 0) visible = false;

		return (
			<span className={`price ms-auto ${visible ? '' : 'hidden'}`}>
				+<i className="bi bi-currency-dollar" />
				{formatPrice(extraPrice)}
			</span>
		);
	};

	// 訂單裡的商品列表(物件包物件)
	const orderProductsArry = Object.values(orderDetail?.products ?? {});

	// 小計金額
	const subtotal = orderProductsArry.reduce((accu, curr) => accu + curr?.final_total, 0);

	// 加購金額
	const addTotal = orderProductsArry.reduce((accu, curr) => accu + curr?.customizations.extra_price ?? 0, 0);

	// 總計金額
	const finalTotal = subtotal + addTotal;

	// 訂單內容下拉選單元件accordion
	const ProductAccordion = () => {
		// 自由配渲染自選內容物
		const renderIncluded = (orderProduct, field) => {
			const IncludedArray = orderProduct?.customizations?.included?.[field.value];
			return (
				<div className="d-flex align-items-center">
					<span className="me-3">{field.label}</span>
					<div className="d-flex flex-column flex-fill">
						{IncludedArray?.map((item, index) => (
							<div className="d-flex align-items-center justify-content-between flex-fill" key={index}>
								<p>{item.title}</p>
								<div>
									<span className="qty me-2 ms-auto">{`x ${item.qty}`}</span>
									{handlePlanBuckle(orderProduct, item)}
								</div>
							</div>
						))}
					</div>
				</div>
			);
		};
		// 自由配渲染加購內容和金額
		const renderAddon = (orderProduct, field) => {
			const addonArray = orderProduct?.customizations?.addon?.[field.value];
			if (!addonArray) return;

			return (
				<div className="d-flex align-items-center">
					<span className="me-3">{field.label}</span>
					<div className="d-flex flex-column flex-fill">
						{addonArray?.map((item, index) => (
							<div className="d-flex align-items-center justify-content-between flex-fill" key={index}>
								<p>{`+ ${item.title}`}</p>
								<div>
									<span className="qty me-2 ms-auto">{`x ${item.qty}`}</span>
									<span className="price ms-auto">
										+<i className="bi bi-currency-dollar" />
										{formatPrice(item.price)}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			);
		};

		return (
			<Accordion defaultActiveKey="0">
				{orderProductsArry.map((orderProduct, index) =>
					orderProduct.product.category === 'custom' ? (
						<Accordion.Item eventKey={String(index)} key={index}>
							<Accordion.Header className="fw-medium ">
								<p>
									{orderProduct.product.title}
									<i className="bi bi-chevron-down ms-3"></i>
								</p>
								<span className="me-2 ms-auto">{`x ${orderProduct.qty}`}</span>
								<span className="fw-bold price">
									<i className="bi bi-currency-dollar" />
									{formatPrice(orderProduct.customizations.custom_total)}
								</span>
							</Accordion.Header>
							<Accordion.Body>
								<div className="included d-flex flex-column gap-3">
									<div className="d-flex align-items-center">
										<div className="d-flex align-items-center justify-content-between flex-fill">
											<p>- 149自由配</p>
											<div>
												<span className="qty me-2 ms-auto">x 1</span>
												<span className="price ms-auto">
													<i className="bi bi-currency-dollar" />
													149
												</span>
											</div>
										</div>
									</div>
									{included_fields.map((filed, index) => (
										<Fragment key={index}>{renderIncluded(orderProduct, filed)}</Fragment>
									))}
								</div>
								<hr />
								<div className="addon d-flex flex-column gap-3">
									{addon_fields.map((filed, index) => (
										<Fragment key={index}>{renderAddon(orderProduct, filed)}</Fragment>
									))}
								</div>
							</Accordion.Body>
						</Accordion.Item>
					) : (
						<div className="accordion-item satic d-flex justify-content-between">
							{orderProduct.product.title}
							<div>
								<span className="me-2">{`x ${orderProduct.qty}`}</span>
								<span className="fw-bold price">
									<i className="bi bi-currency-dollar" />
									{orderProduct.customizations.custom_total}
								</span>
							</div>
						</div>
					),
				)}
			</Accordion>
		);
	};

	return (
		<div>
			<Modal
				show={isModalShow}
				onHide={handleCloseDetail}
				dialogClassName="adm-theme adm-order-modal order-detail"
				aria-labelledby="order-detail"
				size="lg"
				scrollable="false"
			>
				<Modal.Header closeButton>
					<h5 className="modal-title">訂單詳情</h5>
					<p className="fw-medium  adm_text-primary ms-3 ">{orderDetail?.id}</p>
				</Modal.Header>

				<Modal.Body className="d-flex flex-column gap-9 p-7">
					{/* 訂單資訊 / 交易資訊 */}
					<div className="container-fluid">
						<div className="row">
							<div className="col-6">
								{/* 訂單資訊 */}
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
								{/* 交易資訊 */}
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

					{/* 訂單內容 / 金額 */}
					<div className="container-fluid">
						<div className="products-content">
							<p className="subtitle">
								<i className="bi bi-tag-fill me-2"></i> 訂單內容
							</p>
							<div className="container-fluid">
								<div className="row">
									<div className="col-7">
										{/* 訂單內容下拉選單 */}
										<ProductAccordion />
									</div>
									<div className="col-5 position-relative">
										{/* 訂單金額 */}
										<div className="amount position-sticky top-0">
											<p>
												<span>小計</span>
												<span>
													<i className="bi bi-currency-dollar"></i>
													{formatPrice(subtotal)}
												</span>
											</p>
											<p>
												<span>加購</span>
												<span>
													<i className="bi bi-currency-dollar"></i>
													{formatPrice(addTotal)}
												</span>
											</p>
											<p className="total-price">
												<span>總計</span>
												<span className="">
													<i className="bi bi-currency-dollar"></i>
													{formatPrice(finalTotal)}
												</span>
											</p>
										</div>
									</div>
								</div>
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
