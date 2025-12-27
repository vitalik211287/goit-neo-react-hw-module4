import css from "./ImageCard.module.css";

function ImageCard({ image, onImageClick }) {
  return (
    <li className={css.item} onClick={() => onImageClick(image)}>
      <img
        src={image.urls.small}
        alt={image.alt_description || "Image"}
        className={css.imgCard}
        loading="lazy"
      />
    </li>
  );
}

export default ImageCard;
