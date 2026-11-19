import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/styles/Catalog.css";

// --- ЗАГЛУШКИ для картинок (замените на реальные импорты) ---
const placeholder = (label, color = "#e8f0e5") =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="sans-serif" font-size="22" fill="#2f4f4f" text-anchor="middle" dominant-baseline="middle">${label}</text>
    </svg>`,
  )}`;

const cartAddIcon = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>`,
)}`;
// --- /ЗАГЛУШКИ ---

const products = [
  {
    id: 1,
    name: "Snake Plant",
    price: "$24.99",
    category: "Indoor",
    img: placeholder("Snake Plant"),
  },
  {
    id: 2,
    name: "Peace Lily",
    price: "$22.99",
    category: "Indoor",
    img: placeholder("Peace Lily"),
  },
  {
    id: 3,
    name: "Monstera",
    price: "$29.99",
    category: "Indoor",
    img: placeholder("Monstera"),
  },
  {
    id: 4,
    name: "ZZ Plant",
    price: "$26.99",
    category: "Indoor",
    img: placeholder("ZZ Plant"),
  },
  {
    id: 5,
    name: "Aloe Vera",
    price: "$18.99",
    category: "Succulents",
    img: placeholder("Aloe Vera"),
  },
  {
    id: 6,
    name: "Fiddle Leaf Fig",
    price: "$34.99",
    category: "Indoor",
    img: placeholder("Fiddle Leaf Fig"),
  },
  {
    id: 7,
    name: "Echeveria",
    price: "$14.99",
    category: "Succulents",
    img: placeholder("Echeveria"),
  },
  {
    id: 8,
    name: "Boston Fern",
    price: "$21.99",
    category: "Air Purifying",
    img: placeholder("Boston Fern"),
  },
  {
    id: 9,
    name: "Rubber Plant",
    price: "$27.99",
    category: "Indoor",
    img: placeholder("Rubber Plant"),
  },
  {
    id: 10,
    name: "Lavender",
    price: "$16.99",
    category: "Outdoor",
    img: placeholder("Lavender"),
  },
  {
    id: 11,
    name: "Pothos",
    price: "$19.99",
    category: "Air Purifying",
    img: placeholder("Pothos"),
  },
  {
    id: 12,
    name: "Jade Plant",
    price: "$23.99",
    category: "Succulents",
    img: placeholder("Jade Plant"),
  },
];

const categories = ["All", "Indoor", "Outdoor", "Succulents", "Air Purifying"];

const CatalogPage = ({ onBack, onLoginClick, onRegisterClick }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="page">
      <Header onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />

      <main className="catalog">
        <div className="container">
          <button className="catalog__back" onClick={onBack}>
            ← Вернуться на главную
          </button>

          <h1 className="catalog__title">Каталог растений</h1>
          <p className="catalog__subtitle">
            Выберите растение по душе — фильтруйте по категориям.
          </p>

          <div className="catalog__filters">
            {categories.map((c) => (
              <button
                key={c}
                className={`catalog__filter ${
                  activeCategory === c ? "is-active" : ""
                }`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="catalog__grid">
            {filtered.map((p) => (
              <article className="catalog-card" key={p.id}>
                <div className="catalog-card__img">
                  <img src={p.img} alt={p.name} />
                </div>
                <div className="catalog-card__info">
                  <div>
                    <h3 className="catalog-card__name">{p.name}</h3>
                    <span className="catalog-card__category">{p.category}</span>
                    <span className="catalog-card__price">{p.price}</span>
                  </div>
                  <button
                    className="catalog-card__add"
                    aria-label="Add to cart"
                  >
                    <img src={cartAddIcon} alt="" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="catalog__empty">В этой категории пока нет товаров.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CatalogPage;
