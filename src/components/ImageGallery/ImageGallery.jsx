import ImageCard from "./ImageCard/ImageCard.jsx";
import css from "./ImageGallery.module.css";

function ImageGallery({ images, onImageClick }) {
  return (
    <ul className={css.cardList}>
      {images.map((image) => (
        <ImageCard key={image.id} image={image} onImageClick={onImageClick} />
      ))}
    </ul>
  );
}

export default ImageGallery;
