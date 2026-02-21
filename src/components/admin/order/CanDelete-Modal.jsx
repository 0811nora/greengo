import { useEffect } from "react";
import { CheckoutModal, ConfirmModal, DetailModal } from "./ModalType";

function Modal({
  modalType,
  order,
  timeStamp_date,
  timeStamp_time,
  renderTagStatus,
  onCloseBtn,
  onBackBtn,
  onPickBtn,
  onCheckoutBtn,
  onBackdrop,
}) {
  // 視窗背景不滑動
  useEffect(() => {
    document.body.style.overflow = modalType !== null ? "hidden" : "";
  }, [modalType]);

  return (
    <div className="modal d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content adm__glassbg__info">
          {modalType === "detail" && (
            <DetailModal
              order={order}
              timeStamp_date={timeStamp_date}
              timeStamp_time={timeStamp_time}
              renderTagStatus={renderTagStatus}
              onCloseBtn={onCloseBtn}
              onPickBtn={onPickBtn}
              onCheckoutBtn={onCheckoutBtn}
            />
          )}
          {modalType === "confirm" && (
            <ConfirmModal onCloseBtn={onCloseBtn} onBackBtn={onBackBtn} />
          )}
          {modalType === "checkout" && (
            <CheckoutModal onCloseBtn={onCloseBtn} onBackBtn={onBackBtn} />
          )}
        </div>
      </div>
      <div className="backdrop" onClick={onBackdrop}></div>
    </div>
  );
}

export default Modal;
