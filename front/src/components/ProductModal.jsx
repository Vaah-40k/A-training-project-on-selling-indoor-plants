import '../assets/styles/ProductModal.css';

const ProductModal = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div
        className="modal__content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        <button className="modal__close" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>

        <div className="modal__body">
          <div className="modal__img">
            <img src={product.img} alt={product.name} />
          </div>

          <div className="modal__info">
            <span className="modal__category">{product.category}</span>
            <h2 className="modal__title">{product.name}</h2>
            <span className="modal__price">{product.price}</span>

            <p className="modal__desc">{product.description}</p>

            <div className="modal__care">
              <h3 className="modal__care-title">Уход</h3>
              <ul className="modal__care-list">
                <li>
                  <strong>Свет:</strong> {product.care.light}
                </li>
                <li>
                  <strong>Полив:</strong> {product.care.water}
                </li>
                <li>
                  <strong>Влажность:</strong> {product.care.humidity}
                </li>
                <li>
                  <strong>Температура:</strong> {product.care.temp}
                </li>
              </ul>
            </div>

            <button
              className="btn btn--dark modal__add"
              onClick={() => onAddToCart(product)}
            >
              Добавить в корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;