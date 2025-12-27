// import ImageCard from './ImageCard/ImageCard.jsx';
// import css from './ImageGallery.module.css';
// import "simplelightbox/dist/simple-lightbox.min.css";

// function ImageGallery({ images }) {
//     console.log(images);
//     return (
//         <ul className={css.cardList}>
//             {images.map(image => (
//                 <ImageCard key={image.id} alt_description={image.alt_description} urls={image.urls} />
//             ))}
//         </ul>
//     )
// }

// export default ImageGallery

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
