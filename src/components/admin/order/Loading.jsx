function Loading() {
	return (
		<div className="d-flex justify-content-center align-items-center">
			<div className="border-0 text-center table-empty" colSpan="8">
				<div className="spinner-border adm_text-subtitle " role="status">
					<span className="visually-hidden">資料載入中...</span>
				</div>
			</div>
		</div>
	);
}

export default Loading;
