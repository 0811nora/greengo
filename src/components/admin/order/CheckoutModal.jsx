import { Modal } from 'react-bootstrap';
import AdmButton from '../common/AdmButton';
const CheckoutModal = ({ show, closeModal, orderDetail, backToLast }) => {
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
						<input className="d-none" type="radio" name="payment-method" id="creditCard" />
						<label htmlFor="creditCard" className="w-100">
							<div className=" d-flex align-items-center justify-content-center">
								<i className="bi bi-credit-card-2-front me-3"></i>
								<div>
									<div className="fw-medium">信用卡 / 金融卡</div>
									<small className="text-muted">Visa, Master, JCB</small>
								</div>
								<i className="bi bi-check-circle-fill"></i>
							</div>
						</label>

						<input className="d-none" type="radio" name="payment-method" id="thirdParty" />
						<label htmlFor="thirdParty" className="w-100">
							<div className=" d-flex align-items-center justify-content-center">
								<i className="bi bi-phone me-3"></i>
								<div>
									<div className="fw-medium">電子支付</div>
									<small className="text-muted">LINE Pay, 街口支付, Apple Pay</small>
								</div>
								<i className="bi bi-check-circle-fill"></i>
							</div>
						</label>

						<input className="d-none" type="radio" name="payment-method" id="cash" />
						<label htmlFor="cash" className="w-100">
							<div className=" d-flex align-items-center justify-content-center">
								<i className="bi bi-cash-coin me-3"></i>
								<div>
									<div className="fw-medium">現金</div>
								</div>
								<i className="bi bi-check-circle-fill"></i>
							</div>
						</label>
					</div>
				</div>
			</Modal.Body>

			<Modal.Footer className="d-flex align-items-center gap-3">
				<div className="container-fluid">
					<div className="amount position-sticky top-0">
						<p>
							<span>小計</span>
							<span>
								<i className="bi bi-currency-dollar"></i>
								124
							</span>
						</p>
						<p>
							<span>加購</span>
							<span>
								<i className="bi bi-currency-dollar"></i>
								345
							</span>
						</p>
						<p className="total-price">
							<span>總計</span>
							<span className="">
								<i className="bi bi-currency-dollar"></i>
								678
							</span>
						</p>
					</div>
					{/* <div className="d-flex justify-content-between  total-price">
						<p>總計</p>
						<p className="adm_text-primary ">$2000</p>
					</div> */}
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
								// onClick={}
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
