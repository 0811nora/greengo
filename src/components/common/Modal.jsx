import { Children } from 'react';
import { Modal } from 'react-bootstrap';

function ConfirmModal({
  show,
  closeModal,
  text_icon,
  text_title,
  text_content,
  text_cancel,
  text_confirm,
  cancelModal,
  confirmModal,
  style,
}) {
  return (
    <Modal
      show={show}
      onHide={closeModal}
      aria-labelledby="confirmModal"
      size="lg"
      className={`confirm-modal ${style}__confirm-modal`}
      centered
    >
      <Modal.Header className="modal__header"></Modal.Header>
      <Modal.Body className="modal__body">
        <div className="d-flex justify-content-center">
          <i className={`${text_icon} modal__icon`}></i>
        </div>
        <h1 className="modal__body-title">{text_title}</h1>
        <p className="modal__body-content">{text_content}</p>
      </Modal.Body>
      <Modal.Footer className="d-flex align-items-center gap-2 modal__footer">
        <button
          className={`modal__button ${style}__modal__btn-secondary flex-fill`}
          onClick={cancelModal}
        >
          {text_cancel}
        </button>
        <button
          className={`modal__button ${style}__modal__btn-primary flex-fill`}
          onClick={confirmModal}
        >
          {text_confirm}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export { ConfirmModal };
