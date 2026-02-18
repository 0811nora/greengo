import * as bootstrap from 'bootstrap';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import AdminHeader from '../../layout/AdminHeader';
import { AdmModal_confirm, AdmModal_password } from '../../component/AdmModal';
import { ADM_MODE_LOGOUT } from '../../config/confirmModal';
import axios from 'axios';
import { admUserCheck } from '../../api/ApiAdmin';
import { notify } from '../../components/Notify';

let loginModal;
let logoutModal;

export default function AdminPages() {
	const [admMode, setAdmMode] = useState(false); // 管理員模式
	const [admPassword, setAdmPassword] = useState(''); // 管理員密碼
	const [pagePath, setpagePath] = useState(''); // navLink 指定的路由
	const loginModalRef = useRef(null);
	const logoutModalRef = useRef(null);
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();
	const navigate = useNavigate();

	// 把管理員模式設定傳到order頁
	const contextValue = { admMode, handleNavMode };

	useEffect(() => {
		const checkLogin = async () => {
			const greenCookie = document.cookie.replace(/(?:(?:^|.*;\s*)greenToken\s*\=\s*([^;]*).*$)|^.*$/, '$1');

			// a. 驗證是否有token，沒有直接回登入頁
			if (!greenCookie) {
				navigate('/admin/login');
				notify('error', '登入錯誤，請先輸入帳號密碼');
				return;
			}

			// b. 驗證token是否合法
			try {
				axios.defaults.headers.common['Authorization'] = greenCookie;
				const res = await admUserCheck();
				if (location.pathname === '/admin') {
					navigate('/admin/order/today', { replace: true });
				}

				// c. 驗證是否有管理員模式
				// const needAdmModePath = ['/admin/order/history', '/admin/products', '/admin/blog', '/admin/report'];
				// const isRestrictedPath = needAdmModePath.some(path => location.pathname?.startsWith(path));
				// if (isRestrictedPath && !admMode) {
				// 	notify('error', '請先開啟管理員模式');
				// }
			} catch (error) {
				console.log(error.message);
				notify('error', '登入錯誤，請先輸入帳號密碼');
				navigate('/admin/login');
			}
		};

		checkLogin();
	}, [location.pathname]);

	function handleNavMode(path) {
		if (!admMode) {
			openLoginModal();
			setpagePath(path);
		} else {
			navigate(path);
		}
	}
	function handleToggleMode(path) {
		if (!admMode) {
			openLoginModal();
			setpagePath(path);
		} else {
			openLogoutModal();
		}
	}
	function openLoginModal() {
		loginModal = new bootstrap.Modal(loginModalRef.current);
		loginModal.show();
	}
	function openLogoutModal() {
		logoutModal = new bootstrap.Modal(logoutModalRef.current);
		logoutModal.show();
	}
	function closeLoginModal() {
		document.activeElement?.blur();
		loginModal.hide();
	}
	function closeLogoutModal() {
		document.activeElement?.blur();
		logoutModal.hide();
		navigate('/admin/order');
	}
	function cancelModal() {
		document.activeElement?.blur();
		logoutModal.hide();
	}
	function checkAdmPassword() {
		if (admPassword === '0000') {
			handlePasswordSuccess();
		} else {
			alert('登入失敗');
		}
		setAdmPassword('');
	}
	function handlePasswordSuccess() {
		setAdmMode(true);
		closeLoginModal();
		navigate(pagePath);
		alert('登入成功');
	}
	function logoutMode() {
		setAdmMode(false);
		closeLogoutModal();
		console.log('登出成功');
	}

	return (
		<main className="adm-theme adm__bg-gray ">
			<div className="container">
				<AdminHeader admMode={admMode} handleToggleMode={handleToggleMode} handleNavMode={handleNavMode} />
				<AdmModal_password
					loginModalRef={loginModalRef}
					admPassword={admPassword}
					setAdmPassword={setAdmPassword}
					onCancelBtn={() => {
						closeLoginModal();
					}}
					onConfirmBtn={() => {
						checkAdmPassword();
					}}
				/>
				<AdmModal_confirm
					logoutModalRef={logoutModalRef}
					onCancelBtn={() => {
						cancelModal();
					}}
					onConfirmBtn={() => {
						logoutMode();
					}}
					icon={ADM_MODE_LOGOUT.icon}
					title={ADM_MODE_LOGOUT.title}
					content={ADM_MODE_LOGOUT.content}
					confirmText={ADM_MODE_LOGOUT.confirmText}
					cancelText={ADM_MODE_LOGOUT.cancelText}
				/>

				{/* 把管理員模式設定傳到order頁 */}
				<Outlet context={contextValue} />
			</div>
		</main>
	);
}
