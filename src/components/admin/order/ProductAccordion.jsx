import { Accordion } from 'react-bootstrap';
import { Fragment } from 'react';

const ProductAccordion = ({ handlePlanBuckle, orderDetail, formatPrice, included_fields, addon_fields }) => {
	console.log(orderDetail);
	// 訂單裡的商品列表(物件包物件)
	const orderProductsArry = Object.values(orderDetail?.products ?? {});

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
									<i className="bi bi-currency-dollar" />
									{(item.price * item.qty).toLocaleString()}
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
			{orderProductsArry?.map((orderProduct, index) =>
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
								{formatPrice(orderProduct.customizations.custom_total * orderProduct.qty)}
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
								{included_fields?.map((filed, index) => (
									<Fragment key={index}>{renderIncluded(orderProduct, filed)}</Fragment>
								))}
							</div>
							<hr />
							<div className="addon d-flex flex-column gap-3">
								{addon_fields?.map((filed, index) => (
									<Fragment key={index}>{renderAddon(orderProduct, filed)}</Fragment>
								))}
							</div>
						</Accordion.Body>
					</Accordion.Item>
				) : (
					<div className="accordion-item satic d-flex justify-content-between" key={index}>
						{orderProduct.product.title}
						<div>
							<span className="me-2">{`x ${orderProduct.qty}`}</span>
							<span className="fw-bold price">
								<i className="bi bi-currency-dollar" />
								{`${(orderProduct.customizations.custom_total * orderProduct.qty).toLocaleString()}`}
							</span>
						</div>
					</div>
				),
			)}
		</Accordion>
	);
};

export default ProductAccordion;
