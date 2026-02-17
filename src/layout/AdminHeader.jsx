import { NavLink } from 'react-router-dom';

const admNavbarData = {
	brand: {
		title: 'GreenGo',
		imgageSrc: `${import.meta.env.BASE_URL}img/adm/admBrand.svg`,
	},
	navLink: {
		title: '訂單管理',
		route: 'order',
	},
	navLink_needAdmMode: [
		{ title: '商品管理', route: 'products' },
		{ title: '文章管理', route: 'blog' },
		{ title: '報表統整', route: 'report' },
	],
};

export default function AdminHeader({ admMode, handleToggleMode, handleNavMode }) {
	return (
		<>
			<nav className="navbar fixed-top">
				<div className="container adm__navbar adm__glassbg ">
					{/* brand */}
					<span className="navbar-brand ft-en fw-semibold">
						<img src={admNavbarData.brand.imgageSrc} alt={admNavbarData.brand.title} className="me-2" />
						{admNavbarData.brand.title}
					</span>

					{/* navlink */}
					<ul className="navbar-nav delete__navbar_nav__glassbg">
						<li className="nav-item">
							<NavLink className="nav-link adm__navLink" to={admNavbarData.navLink.route}>
								{admNavbarData.navLink.title}
							</NavLink>
						</li>
						{admNavbarData.navLink_needAdmMode.map(item => (
							<li className="nav-item" key={item.route}>
								<NavLink
									className={({ isActive }) =>
										`d-flex aligns-item-center nav-link adm__navLink ${
											admMode ? '' : 'disable'
										} ${isActive ? 'active' : ''}`
									}
									to={item.route}
									onClick={e => {
										e.preventDefault();
										handleNavMode(`/admin/${item.route}`);
									}}
								>
									{item.title}
								</NavLink>
							</li>
						))}
					</ul>

					<div className="d-flex align-items-center gap-4">
						{/* 管理員模式-button */}
						<div className="d-flex align-items-center">
							<button
								type="button"
								className={`adm__mode__bg ${admMode ? 'show' : ''}`}
								onClick={() => {
									handleToggleMode('/admin/order');
								}}
							>
								<span className={`adm__mode__circle ${admMode ? '' : 'show'}`}></span>
								<span className={`adm__mode__circle ${admMode ? 'show' : ''}`}></span>
							</button>
							<label htmlFor="admModeToggle">管理員模式</label>
						</div>

						{/* 登入按鈕 */}
						<button type="button" className="btn adm__button__secondary  sm">
							登出
						</button>
					</div>
				</div>
			</nav>
		</>
	);
}
