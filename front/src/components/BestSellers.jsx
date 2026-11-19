import '../assets/styles/BestSellers.css';
import snakePlant from '../assets/img/product-snake.jpg';
import peaceLily from '../assets/img/product-peace-lily.jpg';
import monstera from '../assets/img/product-monstera.jpg';
import zzPlant from '../assets/img/product-zz.jpg';

// --- ЗАГЛУШКИ (удалить, когда появятся реальные картинки) ---
const placeholder = (label, color = '#e8f0e5') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#2f4f4f" text-anchor="middle" dominant-baseline="middle">${label}</text>
    </svg>`
  )}`;

const cartAddIcon = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>`
)}`;
// --- /ЗАГЛУШКИ ---

const products = [
  { img: snakePlant, name: 'Snake Plant', price: '$24.99' },
  { img: peaceLily, name: 'Peace Lily', price: '$22.99' },
  { img: monstera, name: 'Monstera', price: '$29.99' },
  { img: zzPlant, name: 'ZZ Plant', price: '$26.99' },
];

const BestSellers = () => {
  return (
    <section className="best" id="blog">
      <div className="container">
        <h2 className="section-title">Our Best Sellers</h2>
        <div className="best__grid">
          {products.map((p) => (
            <article className="product" key={p.name}>
              <div className="product__img">
                <img src={p.img} alt={p.name} />
              </div>
              <div className="product__info">
                <div>
                  <h3 className="product__name">{p.name}</h3>
                  <span className="product__price">{p.price}</span>
                </div>
                <button className="product__add" aria-label="Add to cart">
                  <img src={cartAddIcon} alt="" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;