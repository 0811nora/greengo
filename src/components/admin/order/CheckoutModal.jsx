import { Modal } from 'react-bootstrap';
import AdmButton from '../common/AdmButton';
import { useState } from 'react';
import { postPay } from '../../../api/ApiClient';
import { putAdmSingleOrder } from '../../../api/ApiAdmin';
import { notify } from '../../Notify';

const CheckoutModal = ({ show, closeModal, orderDetail, backToLast, getApiOrders }) => {
	const [paymentState, setPaymentState] = useState(null); // null, cash, credit_card, e_payment

	const orderProductsArry = Object.values(orderDetail?.products ?? {});

	// 小計金額
	const subtotal = orderProductsArry.reduce((accu, curr) => accu + curr?.final_total, 0).toLocaleString();

	// 加購金額
	const addTotal = orderProductsArry
		.reduce((accu, curr) => accu + (curr?.customizations.extra_price ?? 0), 0)
		.toLocaleString();

	// 總計金額
	const finalTotal = subtotal + addTotal;

	// 超做付款行為，戳付款API
	const handlePostPay = async () => {
		if (!paymentState) {
			notify('error', '請選擇付款方式', 'top-right');
			return;
		}
		try {
			const payRes = await postPay(orderDetail.id); // 先付錢

			const patmentData = {
				...orderDetail,
				user: {
					...orderDetail.user,
					order_status: 'ready',
					payment_method: paymentState,
					payment_status: 'paid',
				},
			};
			const editRes = await putAdmSingleOrder(orderDetail.id, patmentData); // 再修改訂單的交易狀態

			console.log(editRes.data);
			console.log(payRes.data);
			notify('success', '結帳成功', 'top-right');
			closeModal();
			getApiOrders();
		} catch (error) {
			console.log(error.response);
			notify('error', '臨櫃結帳失敗，請再試一次', 'top-right');
		}
	};

	return (
		<Modal
			show={show}
			onHide={closeModal}
			dialogClassName="adm-theme adm-order-modal order-checkout"
			aria-labelledby="order-checkout"
			size=""
			scrollable="false"
		>
			<Modal.Header closeButton>
				<h5 className="modal-title">臨櫃結帳</h5>
				<p className="fw-medium  adm_text-primary ms-3 ">{orderDetail?.id}</p>
			</Modal.Header>

			<Modal.Body className="d-flex flex-column gap-9 p-7">
				<div className="payment-method">
					<p className="subtitle">
						<i className="bi bi-tag-fill me-2"></i> 選擇付款方式
					</p>

					<div className="container-fluid d-flex flex-column gap-4">
						<input
							className="d-none"
							type="radio"
							name="payment-method"
							id="credit_card"
							checked={paymentState === 'credit_card'}
							onChange={() => setPaymentState('credit_card')}
						/>
						<label htmlFor="credit_card" className="d-block w-100">
							<div className=" d-flex align-items-center">
								<i className="bi bi-credit-card-2-front me-3"></i>
								<div>
									<div className="fw-medium">信用卡 / 金融卡</div>
									<small className="text-muted">Visa, Master, JCB</small>
								</div>
								<i
									className={`bi bi-check-circle-fill payChecked ms-auto ${paymentState === 'credit_card' ? '' : 'd-none'}`}
								></i>
							</div>
						</label>

						<input
							className="d-none"
							type="radio"
							name="payment-method"
							id="e_payment"
							checked={paymentState === 'e_payment'}
							onChange={() => setPaymentState('e_payment')}
						/>
						<label htmlFor="e_payment" className="d-block w-100">
							<div className=" d-flex align-items-center">
								<i className="bi bi-phone me-3"></i>
								<div>
									<div className="fw-medium">電子支付</div>
									<small className="text-muted">LINE Pay, 街口支付, Apple Pay</small>
								</div>
								<i
									className={`bi bi-check-circle-fill payChecked ms-auto ${paymentState === 'e_payment' ? '' : 'd-none'}`}
								></i>
							</div>
						</label>

						<input
							className="d-none"
							type="radio"
							name="payment-method"
							id="cash"
							checked={paymentState === 'cash'}
							onChange={() => setPaymentState('cash')}
						/>
						<label htmlFor="cash" className="d-block w-100">
							<div className=" d-flex align-items-center h-100">
								<i className="bi bi-cash-coin me-3"></i>
								<div>
									<div className="fw-medium">現金</div>
								</div>
								<i
									className={`bi bi-check-circle-fill payChecked ms-auto ${paymentState === 'cash' ? '' : 'd-none'}`}
								></i>
							</div>
						</label>
					</div>
				</div>
			</Modal.Body>

			<Modal.Footer className="d-flex align-items-center gap-3">
				<div className="container-fluid">
					<div className="amount position-sticky top-0 total-price">
						<div className="d-flex justify-content-between mb-1">
							<p>小計</p>
							<p>
								<i className="bi bi-currency-dollar"></i>
								{subtotal}
							</p>
						</div>
						<div className="d-flex justify-content-between">
							<p>加購</p>
							<p>
								+<i className="bi bi-currency-dollar"></i>
								{addTotal}
							</p>
						</div>
						<hr />
						<div className="d-flex justify-content-between fw-medium final-total">
							<p>總計</p>
							<p>
								<i className="bi bi-currency-dollar"></i>
								{finalTotal}
							</p>
						</div>
					</div>
					<div className="row">
						<div className="col-6">
							<AdmButton
								onClick={backToLast}
								text={'取消付款'}
								color={'tertiary'}
								size={'lg'}
								className="w-100"
							/>
						</div>
						<div className="col-6">
							<AdmButton
								onClick={handlePostPay}
								text={'確定付款'}
								color={'secondary'}
								size={'lg'}
								className="w-100"
							/>
						</div>
					</div>
				</div>
			</Modal.Footer>
		</Modal>
	);
};

export default CheckoutModal;
