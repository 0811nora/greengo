import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { notify } from '../../components/Notify';
import { admUserCheck } from '../../api/ApiAdmin';
import Loading from '../../components/admin/order/Loading';

const ProtectedRouted = ({ children }) => {
	const [isVerifying, setIsVerifying] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();

	// 網址切換檢查是否有token
	useEffect(() => {
		const greenCookie = document.cookie.replace(/(?:(?:^|.*;\s*)greenToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
		if (!greenCookie) {
			navigate('/admin/login');
			return;
		}
	}, [navigate, location.pathname]);

	// 第一次進入都檢查
	useEffect(() => {
		const greenCookie = document.cookie.replace(/(?:(?:^|.*;\s*)greenToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
		const checkLogin = async () => {
			try {
				axios.defaults.headers.common['Authorization'] = greenCookie;
				const res = await admUserCheck();
				if (!res.data.success) {
					navigate('/admin/login', { replace: true });
					return;
				}
			} catch (error) {
				console.log(error.message);
				notify('error', '登入錯誤，請先輸入帳號密碼');
				navigate('/admin/login', { replace: true });
			} finally {
				setIsVerifying(false);
			}
		};
		checkLogin();
	}, [navigate]);

	if (isVerifying) {
		return (
			<div className="position-absolute top-50 start-50 translate-middle">
				<Loading />
			</div>
		);
	} else {
		return children;
	}
};

export default ProtectedRouted;
