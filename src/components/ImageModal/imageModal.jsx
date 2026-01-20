import Modal from "react-modal";
import css from "./ImageModal.module.css";

Modal.setAppElement("#root");

export default function ImageModal({ isOpen, onClose, image }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose} // ESC і клік по overlay
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      overlayClassName={css.overlay}
      className={css.content}
    >
      {image && (
        <img
          src={image.urls.regular}
          alt={image.alt_description || "Image"}
          className={css.image}
        />
      )}
    </Modal>
  );
}
