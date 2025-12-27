import css from './ImageCard.module.css';

function ImageCard({ alt_description, urls }) {
  return (
    <li>
      <div>
        <img src={urls.regular} alt={alt_description} className={css.imgCard } />
      </div>
    </li>
  );
}

export default ImageCard;
