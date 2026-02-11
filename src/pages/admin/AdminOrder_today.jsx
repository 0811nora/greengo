import { useEffect, useState } from 'react';
import { getAdmOrders } from '../../api/ApiAdmin';
import EmptyDataHint from '../../components/admin/order/EmptyDataHint';
import Loading from '../../components/admin/order/Loading';
import Modal from '../../components/admin/order/Modal';
import AdmModal_confirm2 from '../../components/admin/common/AdmComfirmModal2';

export default function AdminOrder_today() {
	const [orders, setOrders] = useState([]);
	const [specificOrder, setSpecificOrder] = useState(null);
	const [filterType, setFilterType] = useState('all');
	const [modalType, setModalType] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalShow, setIsModalShow] = useState(false);

	// 取得 api 原始資料，新增訂單和付款狀態
	useEffect(() => {
		const getApiOrders = async () => {
			try {
				const res = await getAdmOrders();
				console.log(res.data);
				let order_status_value;
				const withStatusOrders = res.data.orders.map(order => {
					if (order.paid_date) {
						if (Date.now() - order.paid_date * 1000 >= 900000) {
							order_status_value = 'ready';
						} else {
							order_status_value = 'prepare';
						}
					} else {
						order_status_value = 'new';
					}

					return {
						...order,
						order_status: order_status_value,
						payment_status: order.is_paid ? 'paid' : 'unpaid',
					};
				});
				setOrders(withStatusOrders);
				setIsLoading(false);
			} catch (error) {
				console.log(error.response);
			}
		};
		getApiOrders();
	}, []);

	// 視窗背景不滑動
	useEffect(() => {
		document.body.style.overflow = modalType !== null ? 'hidden' : '';
	}, [modalType]);

	// 透過狀態篩選，決定訂單列表的渲染
	const displayOrders = orders.filter(order => {
		if (filterType === 'all') return true;
		return filterType === order.order_status || filterType === order.payment_status;
	});
	const allOrderNum = orders.length;
	const readyOrderNum = orders.filter(order => order.order_status === 'ready').length;
	console.log(readyOrderNum);

	// 時間戳轉換
	const changeTimeStamp_date = timeStamp => {
		const time = new Date(timeStamp * 1000);
		const year = time.getFullYear();
		const month = String(time.getMonth() + 1).padStart(2, '0');
		const date = String(time.getDate()).padStart(2, '0');
		return `${year}-${month}-${date}`;
	};
	const changeTimeStamp_time = timeStamp => {
		const time = new Date(timeStamp * 1000);
		const hour = String(time.getHours()).padStart(2, '0');
		const minute = String(time.getMinutes()).padStart(2, '0');
		return `${hour}:${minute}`;
	};

	// 選染列表上的狀態標籤
	const renderTagStatus = status => {
		switch (status) {
			case 'prepare':
				return <span className="tag status-prepare">製餐中</span>;
			case 'ready':
				return <span className="tag status-ready">可取餐</span>;
			case 'done':
				return <span className="tag status-done">已取貨</span>;
			case 'paid':
				return <span className="tag status-done">已付款</span>;
			case 'unpaid':
				return <span className="tag status-unpaid">未付款</span>;
			default:
				return <span className="tag status-new">新訂單</span>;
		}
	};

	// 查看產品詳細視窗
	const handleOpenSpecificOrder = order => {
		setModalType('detail');
		setSpecificOrder(order);
	};

	// 關閉視窗
	const handleCloseModal = () => {
		setModalType(null);
	};

	// 回到上一頁視窗
	const handleBackToLast = lastModalType => {
		setModalType(lastModalType);
	};

	// 進入取餐頁面
	const handlePickOrder = order => {
		setSpecificOrder(order);
		console.log(order);
		setModalType('confirm');
	};

	// 進入結帳頁面
	const handleCheckoutOrder = order => {
		setSpecificOrder(order);
		console.log(order);
		setModalType('checkout');
	};

	return (
		<>
			<main className=" container-fluid px-0 order-today">
				<div className="d-flex flex-column gap-6">
					<div className="dashboard">
						<div className="row">
							<div className="col-3">
								<button
									className="adm__glassbg w-100 filter__block"
									onClick={() => {
										setFilterType('all');
									}}
								>
									<div className="d-flex align-items-center justify-content-between">
										<div>
											<h5 className="num">{allOrderNum}</h5>
											<p>今日所有訂單數</p>
										</div>
										<i className="bi bi-box2-fill"></i>
									</div>
								</button>
							</div>
							<div className="col-3">
								<button
									className="btn adm__glassbg w-100 filter__block"
									onClick={() => {
										setFilterType('ready');
									}}
								>
									<div className="d-flex align-items-center justify-content-between">
										<div>
											<h5 className="num">{readyOrderNum}</h5>
											<p>可取餐數</p>
										</div>
										<i className="bi bi-check2-circle"></i>
									</div>
								</button>
							</div>
							<div className="col-3">
								<button
									className="btn adm__glassbg w-100 filter__block"
									onClick={() => {
										setFilterType('prepare');
									}}
								>
									<div className="d-flex align-items-center justify-content-between">
										<div>
											<h5 className="num">10</h5>
											<p>製作中數</p>
										</div>
										<i className="bi bi-clock"></i>
									</div>
								</button>
							</div>
							<div className="col-3">
								<button
									className="btn adm__glassbg w-100 filter__block"
									onClick={() => {
										setFilterType('unpaid');
									}}
								>
									<div className="d-flex align-items-center justify-content-between">
										<div>
											<h5 className="num">10</h5>
											<p>未付款數</p>
										</div>
										<i className="bi bi-credit-card-2-back"></i>
									</div>
								</button>
							</div>
						</div>
					</div>
					<div className="content adm__glassbg">
						<div className="d-flex flex-column gap-6">
							{/* <div className="toolbar">
                <div className="d-flex justify-content-between align-items-center gap-2 ">
                  <div className="position-relative">
                    <i className="bi bi-search adm__text__icon search-bar__icon"></i>
                    <input
                      type="text"
                      className="form-control adm__input search-bar"
                      placeholder="搜尋所有訂單"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn adm__button__primary md text-nowrap"
                  >
                    <i className="bi bi-plus-lg me-2"></i>
                    新增訂單
                  </button>
                </div>
              </div> */}
							<table className="table">
								<thead>
									<tr>
										<th scope="col">訂單時間</th>
										<th scope="col">取餐號</th>
										<th scope="col">訂購者</th>
										<th scope="col">電話</th>
										<th scope="col">金額</th>

										<th scope="col">訂單狀態</th>
										<th scope="col">交易狀態</th>
										<th scope="col">操作</th>
									</tr>
								</thead>

								<tbody>
									{isLoading ? (
										<Loading />
									) : displayOrders.length === 0 ? (
										<EmptyDataHint />
									) : (
										displayOrders.map(order => {
											return (
												<tr key={order.id}>
													<td>
														<span className="date">{changeTimeStamp_date(order.create_at)}</span>
														<span className="time">{changeTimeStamp_time(order.create_at)}</span>
													</td>
													<td>{order.user.tel.slice(-4)}</td>
													<td>{order.user.name}</td>
													<td>{order.user.tel}</td>

													<td>{`$${order.total}`}</td>

													<td>{renderTagStatus(order.order_status)}</td>
													<td>{renderTagStatus(order.payment_status)}</td>
													<td>
														<button className="btn" onClick={() => handleOpenSpecificOrder(order)}>
															<i className="bi bi-eye-fill"></i>
														</button>
														<button className="btn">
															<i className="bi bi-trash-fill"></i>
														</button>
													</td>
												</tr>
											);
										})
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</main>

			{modalType && (
				<Modal
					modalType={modalType}
					order={specificOrder}
					timeStamp_date={changeTimeStamp_date}
					timeStamp_time={changeTimeStamp_time}
					renderTagStatus={renderTagStatus}
					onCloseBtn={handleCloseModal}
					onBackBtn={handleBackToLast}
					onPickBtn={handlePickOrder}
					onBackdrop={handleCloseModal}
					onCheckoutBtn={handleCheckoutOrder}
				/>
			)}
			<AdmModal_confirm2 show={isModalShow} onHide={() => setIsModalShow(false)} />
		</>
	);
}
