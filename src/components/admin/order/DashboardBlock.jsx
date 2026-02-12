function DashboardBlock({ setFilterType }) {
  return (
    <div className="col-3">
      <button
        className="adm__glassbg w-100 filter__block"
        onClick={() => {
          setFilterType("all");
        }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h5 className="num">10</h5>
            <p>目前所有訂單數</p>
          </div>
          <i className="bi bi-box2-fill"></i>
        </div>
      </button>
    </div>
  );
}

export default DashboardBlock;
