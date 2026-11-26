import { useState } from "react";
import "../assets/styles/BestSellers.css";
import { useCart } from "../context/CartContext";
import ProductModal from "../components/ProductModal";
import { jwtDecoded } from "../utils/jwtDecoded";
import snakePlant from "../assets/img/product-snake.jpg";
import peaceLily from "../assets/img/product-peace-lily.jpg";
import monstera from "../assets/img/product-monstera.jpg";
import zzPlant from "../assets/img/product-zz.jpg";

const cartAddIcon = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>`,
)}`;

// TODO: нужно определиться, как у нас выбираются бестселлеры
const products = [
  {
    id: 1,
    img: snakePlant,
    name: "Сансевиерия",
    price: "$24.99",
    category: "Indoor",
    description:
      "Неприхотливое суккулентное растение с жёсткими вертикальными листьями. Отлично очищает воздух и переносит редкий полив — идеальный выбор для новичков.",
    care: {
      light: "Яркий рассеянный или полутень",
      water: "Раз в 2–3 недели, давать почве просохнуть",
      humidity: "Не требовательна",
      temp: "+18…+30 °C",
    },
  },
  {
    id: 2,
    img: peaceLily,
    name: "Спатифиллум",
    price: "$22.99",
    category: "Indoor",
    description:
      "Элегантное растение с белыми «парусами» соцветий. Любит рассеянный свет и регулярный полив, отлично подходит для спальни и гостиной.",
    care: {
      light: "Полутень или рассеянный свет",
      water: "2–3 раза в неделю, мягкой водой",
      humidity: "Высокая, полезно опрыскивать",
      temp: "+18…+25 °C",
    },
  },
  {
    id: 3,
    img: monstera,
    name: "Монстера",
    price: "$29.99",
    category: "Indoor",
    description:
      "Крупное тропическое растение с характерными резными листьями. Быстро растёт и становится эффектным акцентом интерьера.",
    care: {
      light: "Яркий рассеянный, без прямых лучей",
      water: "1 раз в неделю, обильно",
      humidity: "Высокая, желательно опрыскивать",
      temp: "+20…+28 °C",
    },
  },
  {
    id: 4,
    img: zzPlant,
    name: "Замиокулькас",
    price: "$26.99",
    category: "Indoor",
    description:
      "«Долларовое дерево» с глянцевыми тёмно-зелёными листьями. Запасает влагу в клубнях, поэтому переносит длительную засуху без вреда.",
    care: {
      light: "Яркий рассеянный или полутень",
      water: "Раз в 2–3 недели, умеренный",
      humidity: "Низкая, не требует опрыскивания",
      temp: "+16…+26 °C",
    },
  },
];

const BestSellers = () => {
  const { addToCart } = useCart();
  const [payloadUserData] = useState(() => jwtDecoded());
  const [selected, setSelected] = useState(null);

  const handleAdd = (product) => {
    addToCart(product, payloadUserData.id);
    setSelected(null);
  };

  return (
    <section className="best" id="blog">
      <div className="container">
        <h2 className="section-title">Наши бестселлеры</h2>
        <div className="best__grid">
          {products.map((p) => (
            <article
              className="product"
              id={p.id}
              key={p.id}
              onClick={() => setSelected(p)}
              style={{ cursor: "pointer" }}
            >
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
                  onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p, payloadUserData?.id); // ← ?.id
                  }}
                >
                <img src={cartAddIcon} alt="" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ProductModal
        product={selected}
        onClose={() => setSelected(null)}
        onAddToCart={handleAdd}
      />
    </section>
  );
};

export default BestSellers;