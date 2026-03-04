import { Fragment, useEffect, useState } from 'react';
import { delAdmSingleOrder, getAdmOrders, putAdmSingleOrder } from '../../api/ApiAdmin';
import EmptyDataHint from '../../components/admin/order/EmptyDataHint';
import Loading from '../../components/admin/order/Loading';
import OrderDetail from '../../components/admin/order/AdminOrderDetail';
import { notify } from '../../components/Notify';
import { ConfirmModal } from '../../components/common/Modal';
import CheckoutModal from '../../components/admin/order/CheckoutModal';

export default function AdminOrder_today() {
	const [allOrders, setAllOrders] = useState([]);
	const [orderPagination, setOrderPagination] = useState(null);
	const [specificOrder, setSpecificOrder] = useState(null);
	const [filterType, setFilterType] = useState('all');
	const [modalType, setModalType] = useState(null); // null, detail, pickup, checkout
	const [isDataLoading, setIsDataLoading] = useState(true);
	const [orderDetail, setOrderDetail] = useState(null);

	// 取得原始訂單資料API
	const getApiOrders = async page => {
		try {
			const res = await getAdmOrders(page);
			console.log(res.data);
			setIsDataLoading(false);
			setAllOrders(res.data.orders);
			setOrderPagination(res.data.pagination);
		} catch (error) {
			console.log(error.response);
			setIsDataLoading(false);
		}
	};
	useEffect(() => {
		getApiOrders();
	}, []);

	const renderPagination = () => {
		const totalPages = orderPagination?.total_pages || 0;
		const paginationArray = [...Array(totalPages).keys()];
		return paginationArray.map((item, index) => (
			<li className="page-item" key={index}>
				<button className={`page-link ${orderPagination.current_page === item + 1 ? 'bg-primary text-white' : ''}`}>
					{item + 1}
				</button>
			</li>
		));
	};
	const handleChangePages = type => {
		const currentPage = orderPagination.current_page;

		if (type === 'next') {
			getApiOrders(currentPage + 1);
			return;
		}
		if (type === 'prev') {
			getApiOrders(currentPage - 1);
			return;
		}
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
	const displayOrders = allOrders.filter(order => {
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
									) : allOrders.length === 0 ? (
										<EmptyDataHint />
									) : (
										allOrders.map(order => {
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
						<nav aria-label="Page navigation">
							<ul className="pagination d-flex justify-content-center">
								<li className="page-item">
									<button
										className="page-link"
										aria-label="Previous"
										onClick={() => handleChangePages('prev')}
									>
										<span aria-hidden="true">前一頁</span>
									</button>
								</li>
								{renderPagination()}
								<li className="page-item">
									<button className="page-link" aria-label="Next" onClick={() => handleChangePages('next')}>
										<span aria-hidden="true">後一頁</span>
									</button>
								</li>
							</ul>
						</nav>
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
