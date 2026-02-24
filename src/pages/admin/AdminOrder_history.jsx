// import { useEffect, useState } from 'react';
// import { getAdmOrders } from '../../api/ApiAdmin';
// import EmptyDataHint from '../../components/admin/order/EmptyDataHint';
// import Loading from '../../components/admin/order/Loading';

// export default function AdminOrder_history() {
// 	const [orders, setOrders] = useState([]);
// 	const [specificOrder, setSpecificOrder] = useState(null);
// 	const [filterType, setFilterType] = useState('all');
// 	const [modalType, setModalType] = useState(null);
// 	const [isLoading, setIsLoading] = useState(true);

// 	// 取得 api 原始資料，新增訂單和付款狀態
// 	useEffect(() => {
// 		const getApiOrders = async () => {
// 			try {
// 				const res = await getAdmOrders();
// 				console.log(res.data);
// 				let order_status_value;
// 				const withStatusOrders = res.data.orders.map(order => {
// 					if (order.paid_date) {
// 						if (Date.now() - order.paid_date * 1000 >= 900000) {
// 							order_status_value = 'ready';
// 						} else {
// 							order_status_value = 'prepare';
// 						}
// 					} else {
// 						order_status_value = 'new';
// 					}

// 					return {
// 						...order,
// 						order_status: order_status_value,
// 						payment_status: order.is_paid ? 'paid' : 'unpaid',
// 					};
// 				});
// 				setOrders(withStatusOrders);
// 				setIsLoading(false);
// 			} catch (error) {
// 				console.log(error.response);
// 			}
// 		};
// 		getApiOrders();
// 	}, []);

// 	// 視窗背景不滑動
// 	useEffect(() => {
// 		document.body.style.overflow = modalType !== null ? 'hidden' : '';
// 	}, [modalType]);

// 	// 透過狀態篩選，決定訂單列表的渲染
// 	const displayOrders = orders.filter(order => {
// 		if (filterType === 'all') return true;
// 		return filterType === order.order_status || filterType === order.payment_status;
// 	});

// 	// 時間戳轉換
// 	const changeTimeStamp_date = timeStamp => {
// 		const time = new Date(timeStamp * 1000);
// 		const year = time.getFullYear();
// 		const month = String(time.getMonth() + 1).padStart(2, '0');
// 		const date = String(time.getDate()).padStart(2, '0');
// 		return `${year}-${month}-${date}`;
// 	};
// 	const changeTimeStamp_time = timeStamp => {
// 		const time = new Date(timeStamp * 1000);
// 		const hour = String(time.getHours()).padStart(2, '0');
// 		const minute = String(time.getMinutes()).padStart(2, '0');
// 		return `${hour}:${minute}`;
// 	};

// 	// 選染列表上的狀態標籤
// 	const renderTagStatus = status => {
// 		switch (status) {
// 			case 'prepare':
// 				return <span className="tag status-prepare">製餐中</span>;
// 			case 'ready':
// 				return (
// 					<span className="tag status-ready">
// 						可取餐
// 						{/* <i className="bi bi-check-circle-fill"> 可取餐</i> */}
// 					</span>
// 				);
// 			case 'done':
// 				return <span className="tag status-done">已取貨</span>;
// 			case 'paid':
// 				return <span className="tag status-done">已付款</span>;
// 			case 'unpaid':
// 				return (
// 					<span className="tag status-unpaid">
// 						未付款
// 						{/* <i className="bi bi-credit-card-2-back-fill"> 未付款</i> */}
// 					</span>
// 				);
// 			default:
// 				return <span className="tag status-new">新訂單</span>;
// 		}
// 	};

// 	// 查看產品詳細視窗
// 	const handleOpenSpecificOrder = order => {
// 		setModalType('detail');
// 		setSpecificOrder(order);
// 	};

// 	// 關閉視窗
// 	const handleCloseModal = () => {
// 		setModalType(null);
// 	};

// 	// 回到上一頁視窗
// 	const handleBackToLast = lastModalType => {
// 		setModalType(lastModalType);
// 	};

// 	// 進入取餐頁面
// 	const handlePickOrder = order => {
// 		setSpecificOrder(order);
// 		console.log(order);
// 		setModalType('confirm');
// 	};

// 	// 進入結帳頁面
// 	const handleCheckoutOrder = order => {
// 		setSpecificOrder(order);
// 		console.log(order);
// 		setModalType('checkout');
// 	};

// 	return (
// 		<>
// 			<main className=" container-fluid px-0 order-today">
// 				<div className="d-flex flex-column gap-6">
// 					<div className="content adm__glassbg">
// 						<div className="d-flex flex-column gap-6">
// 							<table className="table">
// 								<thead>
// 									<tr>
// 										<th scope="col">訂單時間</th>
// 										<th scope="col">取餐號</th>
// 										<th scope="col">訂購者</th>
// 										<th scope="col">電話</th>
// 										<th scope="col">金額</th>

// 										<th scope="col">訂單狀態</th>
// 										<th scope="col">交易狀態</th>
// 										<th scope="col">操作</th>
// 									</tr>
// 								</thead>

// 								<tbody>
// 									{isLoading ? (
// 										<Loading />
// 									) : displayOrders.length === 0 ? (
// 										<EmptyDataHint />
// 									) : (
// 										displayOrders.map(order => {
// 											return (
// 												<tr key={order.id}>
// 													<td>
// 														<span className="date">{changeTimeStamp_date(order.create_at)}</span>
// 														<span className="time">{changeTimeStamp_time(order.create_at)}</span>
// 													</td>
// 													<td>{order.user.tel.slice(-4)}</td>
// 													<td>{order.user.name}</td>
// 													<td>{order.user.tel}</td>

// 													<td>{`$${order.total}`}</td>

// 													<td>{renderTagStatus(order.order_status)}</td>
// 													<td>{renderTagStatus(order.payment_status)}</td>
// 													<td>
// 														<button className="btn" onClick={() => handleOpenSpecificOrder(order)}>
// 															<i className="bi bi-eye-fill"></i>
// 														</button>
// 														<button className="btn">
// 															<i className="bi bi-trash-fill"></i>
// 														</button>
// 													</td>
// 												</tr>
// 											);
// 										})
// 									)}
// 								</tbody>
// 							</table>
// 						</div>
// 					</div>
// 				</div>
// 			</main>
// 		</>
// 	);
// }

import { Fragment, useEffect, useState } from 'react';
import { delAdmSingleOrder, getAdmOrders, putAdmSingleOrder } from '../../api/ApiAdmin';
import EmptyDataHint from '../../components/admin/order/EmptyDataHint';
import Loading from '../../components/admin/order/Loading';
import OrderDetail from '../../components/admin/order/AdminOrderDetail';
import { notify } from '../../components/Notify';
import { ConfirmModal } from '../../components/common/Modal';
import CheckoutModal from '../../components/admin/order/CheckoutModal';

export default function AdminOrder_today() {
	const [todayOrders, setTodayOrders] = useState([]);
	const [specificOrder, setSpecificOrder] = useState(null);
	const [filterType, setFilterType] = useState('all');
	const [modalType, setModalType] = useState(null); // null, detail, pickup, checkout
	const [isDataLoading, setIsDataLoading] = useState(true);
	const [orderDetail, setOrderDetail] = useState(null);

	// 建立今日訂單時間的範圍
	const todayTime = new Date();
	const todayStart = new Date(todayTime.getFullYear(), todayTime.getMonth(), todayTime.getDate()).getTime();
	const todayEnd = todayStart + (24 * 60 * 60 * 1000 - 1);

	// 取得原始訂單資料API
	const getApiOrders = async () => {
		try {
			const res = await getAdmOrders(1);
			let resOrds = res.data.orders;
			console.log(res.data);
			const totalPages = res.data.pagination.total_pages;

			// 以訂單建立時間，局限在今日時間
			// const allPagesOrders = resOrds.filter(
			// 	order => order.create_at * 1000 >= todayStart && order.create_at * 1000 <= todayEnd,
			// );

			// 以訂單建立時間，局限在今日以前
			const allPagesOrders = resOrds.filter(order => order.create_at * 1000 < todayStart);

			// 如果第一頁沒有今日時間，就return
			if (allPagesOrders.length === 0) {
				setTodayOrders([]);
				setIsDataLoading(false);
				return;
			}

			// 如果第一頁有今日時間，就跑迴圈從第二頁開始戳api
			if (allPagesOrders.length > 0) {
				for (let page = 2; page <= totalPages; page++) {
					const res = await getAdmOrders(page);
					resOrds = res.data.orders;
					const otherPagesOrder = resOrds.filter(
						order => order.create_at * 1000 >= todayStart && order.create_at * 1000 <= todayEnd,
					);
					// 如果現在頁數沒有今日時間，就break
					if (otherPagesOrder.length === 0) {
						break;
					}

					// 將所有有今日時間的訂單放一起
					allPagesOrders.push(...otherPagesOrder);
				}
			}
			setIsDataLoading(false);
			setTodayOrders(allPagesOrders);
		} catch (error) {
			console.log(error.response);
			setIsDataLoading(false);
		}
	};
	useEffect(() => {
		getApiOrders();
	}, []);

	// filter blocks：即時顯示相關訂單數
	const calDiffFilterStateNum = category => {
		if (category === 'all') return todayOrders.length;
		return todayOrders.filter(order => order.user.order_status === category || order.user.payment_status === category)
			.length;
	};

	// filter blocks：UI 渲染資料預備
	const filterBlocks_fields = [
		{
			category: 'all',
			title: '今日所有訂單數',
			icon: 'bi bi-archive',
		},
		{
			category: 'ready',
			title: '可取餐數',
			icon: 'bi bi-check-circle',
		},
		{
			category: 'unpaid',
			title: '未付款數',
			icon: 'bi bi-credit-card-2-back',
		},
		{
			category: 'done',
			title: '已完成數',
			icon: 'bi bi-ban',
		},
	];

	// 透過狀態篩選，決定訂單列表的tag渲染
	const displayOrders = todayOrders.filter(order => {
		if (filterType === 'all') return true;
		return filterType === order.user.order_status || filterType === order.user.payment_status;
	});

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
			case 'ready':
				return <span className="tag status-ready">可取餐</span>;
			case 'done':
				return <span className="tag status-done">已取餐</span>;
			case 'paid':
				return <span className="tag status-done">已付款</span>;
			case 'unpaid':
				return <span className="tag status-unpaid">未付款</span>;
			default:
				return <span className="tag status-new">新訂單</span>;
		}
	};

	// 刪除單一訂單API
	const handleDeleteSingleOrder = async id => {
		// setIsDataLoading(true);
		try {
			const res = await delAdmSingleOrder(id);
			console.log(res.data);
			getApiOrders();
			// setIsDataLoading(false);
			notify('success', '刪除當筆訂單成功', 'bottom-center');
		} catch (error) {
			console.log(error.response);
			// setIsDataLoading(false);
			notify('error', '刪除當筆訂單失敗', 'bottom-center');
		}
	};

	// 查看產品詳細視窗
	const handleOpenDetail = order => {
		setModalType('detail');
		setOrderDetail(order);
	};

	// 關閉視窗
	const handleCloseDetail = () => {
		setModalType(null);
	};

	// 回到上一頁視窗
	const handleBackToLast = lastModalType => {
		setModalType(lastModalType);
	};

	// 進入取餐頁面
	const OpenPickupPage = order => {
		setModalType('pickup');
		setSpecificOrder(order);
	};

	//領取餐點行為-> 戳修改訂單API
	const handlePickupMeal = async () => {
		const id = specificOrder.id;
		const data = { ...specificOrder, user: { ...specificOrder.user, order_status: 'done' } };

		try {
			const res = await putAdmSingleOrder(id, data);
			getApiOrders();
			notify('success', '餐點已領取', 'top-right');
			handleCloseDetail();
		} catch (error) {
			console.log(error.response);
			notify('error', '餐點領取失敗', 'top-right');
		}
	};

	// 進入結帳頁面
	const OpenCheckoutPage = order => {
		setModalType('checkout');
		setSpecificOrder(order);
		console.log(order);
	};

	// 價格有千分位逗號
	const formatPrice = num => {
		const value = Number(num) || 0;
		return value.toLocaleString();
	};

	return (
		<>
			<main className="container-fluid px-0 order-today">
				<div className="d-flex flex-column gap-6">
					<div className="content adm__glassbg">
						<div className="d-flex flex-column gap-6">
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
									{isDataLoading ? (
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
													<td>{order.user.order_number}</td>
													<td>{order.user.name}</td>
													<td>{order.user.tel}</td>

													<td>{`$${formatPrice(order.total)}`}</td>

													<td>{renderTagStatus(order.user.order_status)}</td>
													<td>{renderTagStatus(order.user.payment_status)}</td>
													<td>
														<button className="btn" onClick={() => handleOpenDetail(order)}>
															<i className="bi bi-eye-fill"></i>
														</button>
														<button className="btn" onClick={() => handleDeleteSingleOrder(order.id)}>
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
			<Fragment>
				{modalType === 'detail' ? (
					<OrderDetail
						isModalShow={modalType === 'detail'}
						handleCloseDetail={handleCloseDetail}
						orderDetail={orderDetail}
						timeStamp_date={changeTimeStamp_date}
						timeStamp_time={changeTimeStamp_time}
						renderTagStatus={renderTagStatus}
						OpenPickupPage={OpenPickupPage}
						OpenCheckoutPage={OpenCheckoutPage}
						formatPrice={formatPrice}
					/>
				) : modalType === 'pickup' ? (
					<ConfirmModal
						style={'admin'}
						show={modalType === 'pickup'}
						closeModal={handleCloseDetail}
						text_icon={`bi bi-question-circle-fill`}
						text_title={'確認餐點已領取'}
						text_content={
							<div>
								訂單 {specificOrder.id}
								<br />
								請確認已將餐點交予客人
							</div>
						}
						text_cancel={'取消'}
						cancelModal={() => handleBackToLast('detail')}
						text_confirm={'確認'}
						confirmModal={handlePickupMeal}
					/>
				) : modalType === 'checkout' ? (
					<CheckoutModal
						show={modalType === 'checkout'}
						closeModal={handleCloseDetail}
						orderDetail={orderDetail}
						backToLast={() => handleBackToLast('detail')}
						getApiOrders={getApiOrders}
						formatPrice={formatPrice}
					/>
				) : (
					''
				)}
			</Fragment>
		</>
	);
}
