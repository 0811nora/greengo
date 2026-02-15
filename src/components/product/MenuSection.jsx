import Select from 'react-select';
import classNames from 'classnames';
import ProductCard from './ProductCard';

const MenuSection = ({
	data,
	category,
	filterState,
	toggleTabFilter,
	flavorSelect,
	toggleFlavorFilter,
	sortSelect,
	toggleSortFilter,
	renderDisplayData,
	apiProdutsData,
	handleOpenDetail,
	// renderUITag,
	// renderUITab,
}) => {
	const CustomMultiValueRemove = ({ innerProps }) => {
		return (
			<span {...innerProps} className="material-symbols-rounded">
				close
			</span>
		);
	};

	return (
		<section className="container menu-section">
			{/* 固定餐標題 */}
			<div className="title mb-10 position-relative">
				<span className="material-symbols-rounded position-absolute top-0 start-50 translate-middle">
					{data[category].title.icon}
				</span>
				<h2>{data[category].title.title}</h2>
				<h6>{data[category].title.subtitle}</h6>
			</div>

			<div className="tab-filter d-flex flex-xxl-row flex-column justify-content-between align-items-center gap-4">
				{/* 固定餐類別篩選 */}
				<ul className="nav nav-underline d-flex gap-sm-6 gap-2 flex-fill">
					{data[category].tab.map((tabItem, index) => (
						<li className="nav-item" key={index}>
							<button
								className={`nav-link tab-navLink ${filterState[category].tab === tabItem.value ? 'active' : ''}`}
								value={tabItem.value}
								onClick={e => toggleTabFilter(category, e.target.value)}
							>
								{tabItem.label}
							</button>
						</li>
					))}
				</ul>
				<div className="d-flex gap-4">
					{/* 固定餐忌口篩選 */}
					<Select
						options={data[category].flavor}
						placeholder="忌口篩選"
						isMulti={true}
						value={flavorSelect}
						onChange={value => toggleFlavorFilter(category, value)}
						components={{ MultiValueRemove: CustomMultiValueRemove }}
						unstyled
						classNamePrefix="rs"
						classNames={{
							control: ({ isFocused, hasValue }) =>
								classNames('rs__control', isFocused && 'rs__focus', hasValue && 'rs__hasValue'),
							menu: () => classNames('rs__menu'),
							option: ({ isFocused }) => classNames('rs__option', isFocused && 'rs__focus'),
						}}
					/>

					{/* 固定餐排序篩選 */}
					<Select
						options={data[category].sort}
						placeholder="排序"
						value={sortSelect}
						onChange={value => toggleSortFilter(category, value)}
						unstyled
						classNamePrefix="rs"
						classNames={{
							control: ({ isFocused }) => classNames('rs__control', isFocused && 'rs__focus'),
							menu: () => classNames('rs__menu'),
							option: ({ isFocused }) => classNames('rs__option', isFocused && 'rs__focus'),
						}}
					/>
				</div>
			</div>
			{/*卡片區 */}
			<div className="row mt-9">
				{renderDisplayData(apiProdutsData, filterState, category).map(product => (
					<ProductCard
						product={product}
						category={category}
						// renderUITag={renderUITag}
						// renderUITab={renderUITab}
						handleOpenDetail={handleOpenDetail}
						key={product.id}
					/>
				))}
			</div>
		</section>
	);
};

export default MenuSection;
