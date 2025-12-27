import ImageCard from './ImageCard/ImageCard.jsx';
import css from './ImageGallery.module.css';

function ImageGallery({ images }) {
    console.log(images);
    return (
        <ul className={css.cardList}>
            {images.map(image => (
                <ImageCard key={image.id} alt_description={image.alt_description} urls={image.urls} />
            ))}
        </ul>
    )
}

export default ImageGallery