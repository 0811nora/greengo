export function AdmModal_password({
  loginModalRef,
  admPassword,
  setAdmPassword,
  onCancelBtn,
  onConfirmBtn,
}) {
  return (
    <div className="modal fade" tabIndex="-1" ref={loginModalRef}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content adm__glassbg adm__modal__comfirm">
          <div className="modal-body adm__modal__body">
            <div>
              <div className="d-flex justify-content-center">
                <i className="bi bi-lock-fill adm__modal__icon"></i>
              </div>
              <h1 className="modal-title fs-5">登入管理員模式</h1>
              <p>
                您未擁有此權限，請輸入管理員密碼 <br />
                密碼提示：0000
              </p>
            </div>

            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="admPasswordInput"
                placeholder="管理員密碼"
                value={admPassword}
                onChange={(e) => {
                  setAdmPassword(e.target.value);
                }}
              />
              <label
                htmlFor="admPasswordInput"
                className="adm__label__floating"
              >
                管理員密碼
              </label>
            </div>

            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn adm__button__tertiary lg flex-fill"
                onClick={onCancelBtn}
              >
                取消
              </button>
              <button
                type="button"
                className="btn adm__button__secondary lg flex-fill"
                onClick={onConfirmBtn}
              >
                確定
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdmModal_confirm({
  logoutModalRef,
  onCancelBtn,
  onConfirmBtn,
  icon,
  title,
  content,
  confirmText,
  cancelText,
}) {
  return (
    <div className="modal fade" tabIndex="-1" ref={logoutModalRef}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content adm__glassbg adm__modal__comfirm">
          <div className="modal-body adm__modal__body">
            <div>
              <div className="d-flex justify-content-center">
                <i className={`bi ${icon} adm__modal__icon`}></i>
              </div>
              <h1 className="modal-title fs-5">{title}</h1>
              <p>{content}</p>
            </div>

            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn adm__button__tertiary lg flex-fill"
                onClick={onCancelBtn}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className="btn adm__button__secondary lg flex-fill"
                onClick={onConfirmBtn}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
