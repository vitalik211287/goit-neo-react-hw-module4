import css from './LoadMoreBtn.module.css';

function LoadMoreBtn({ onClick, disabled }) {
  return (
    <button type="button" className={css.span} onClick={onClick} disabled={disabled}>
      Load More
    </button>
  );
}

export default LoadMoreBtn;