import "../assets/styles/BestSellers.css";
import { useCart } from "../context/CartContext";
import snakePlant from "../assets/img/product-snake.jpg";
import peaceLily from "../assets/img/product-peace-lily.jpg";
import monstera from "../assets/img/product-monstera.jpg";
import zzPlant from "../assets/img/product-zz.jpg";
import { jwtDecoded } from "../utils/jwtDecoded";
import { useState } from "react";
const cartAddIcon = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>`,
)}`;
// TODO: нужно определится как у нас выбираются бестцеллеры
const products = [
  { id: 1, img: snakePlant, name: "Сансевиерия", price: "$24.99" },
  { id: 2, img: peaceLily, name: "Спатифиллум", price: "$22.99" },
  { id: 3, img: monstera, name: "Монстера", price: "$29.99" },
  { id: 4, img: zzPlant, name: "Замиокулькас", price: "$26.99" },
];
//
const BestSellers = () => {
  const { addToCart } = useCart();
  const [payloadUserData] = useState(() => jwtDecoded());
  return (
    <section className="best" id="blog">
      <div className="container">
        <h2 className="section-title">Наши бестселлеры</h2>
        <div className="best__grid">
          {products.map((p) => (
            <article className="product" id={p.id}>
              <div className="product__img">
                <img src={p.img} alt={p.name} />
              </div>
              <div className="product__info">
                <div>
                  <h3 className="product__name">{p.name}</h3>
                  <span className="product__price">{p.price}</span>
                </div>
                <button
                  className="product__add"
                  aria-label="Добавить в корзину"
                  onClick={() => addToCart(p, payloadUserData.id)}
                >
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
