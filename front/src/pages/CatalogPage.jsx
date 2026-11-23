import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductModal from "../components/ProductModal";
import { useCart } from "../context/CartContext";
import { jwtDecoded } from "../utils/jwtDecoded";
import "../assets/styles/Catalog.css";

// --- Заглушки картинок ---
// const placeholder = (label, color = "#e8f0e5") =>
//   `data:image/svg+xml;utf8,${encodeURIComponent(
//     `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
//       <rect width="100%" height="100%" fill="${color}"/>
//       <text x="50%" y="50%" font-family="sans-serif" font-size="22" fill="#2f4f4f" text-anchor="middle" dominant-baseline="middle">${label}</text>
//     </svg>`,
//   )}`;

const cartAddIcon = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>`,
)}`;

const CatalogPage = ({
  onBack,
  onLoginClick,
  onRegisterClick,
  onCartClick,
  onAccountClick,
  onAdminClick,
  onShopNow,
}) => {
  const [payloadUserData] = useState(() => jwtDecoded());
  const [products, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [selected, setSelected] = useState(null);
  const { addToCart } = useCart();

  const filtered =
    activeCategory === "Все"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleAdd = (product) => {
    addToCart(product, payloadUserData.id);
    setSelected(null);
  };
  const categories = [
    "Все",
    ...new Set(products.map((plant) => plant.category)),
  ];
  useEffect(() => {
    const controller = new AbortController();

    async function loadPlants() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/show_plants", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setPlants(data.plantsSendToFront);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadPlants();

    return () => controller.abort();
  }, []);

  if (loading) return <p>Загрузка каталога...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className="page">
      <Header
        onLoginClick={onLoginClick}
        onRegisterClick={onRegisterClick}
        onCartClick={onCartClick}
        onAccountClick={onAccountClick}
        onAdminClick={onAdminClick}
      />

      <main className="catalog">
        <div className="container">
          <button className="catalog__back" onClick={onBack}>
            ← Вернуться на главную
          </button>

          <h1 className="catalog__title">Каталог растений</h1>
          <p className="catalog__subtitle">
            Нажмите на карточку, чтобы посмотреть описание и уход.
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
              <article
                className="catalog-card"
                id={p.id}
                onClick={() => setSelected(p)}
              >
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
                    aria-label="Добавить в корзину"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p, payloadUserData.id);
                    }}
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

          <div style={{ marginTop: 32 }}>
            <button className="btn btn--ghost" onClick={onShopNow}>
              Обновить каталог
            </button>
          </div>
        </div>
      </main>

      <ProductModal
        product={selected}
        onClose={() => setSelected(null)}
        onAddToCart={handleAdd}
      />

      <Footer />
    </div>
  );
};

export default CatalogPage;
