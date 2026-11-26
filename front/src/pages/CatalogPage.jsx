import { useState, useEffect, useMemo, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductModal from "../components/ProductModal";
import { useCart } from "../context/CartContext";
import "../assets/styles/Catalog.css";

const cartAddIcon = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>`,
)}`;

const PER_PAGE = 12;

const getPageNumbers = (current, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages]
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= total)
    .sort((a, b) => a - b);

  const result = [];
  let previous = 0;

  for (const pageNumber of sorted) {
    if (pageNumber - previous > 1) {
      result.push("…");
    }

    result.push(pageNumber);
    previous = pageNumber;
  }

  return result;
};

const CatalogPage = ({ onBack, ...headerProps }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);

  const { addToCart } = useCart();
  const gridRef = useRef(null);

  const filtered = useMemo(() => {
    return activeCategory === "Все"
      ? products
      : products.filter((product) => product.category === activeCategory);
  }, [products, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const visibleProducts = filtered.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleAdd = (product) => {
    addToCart(product);
    setSelected(null);
  };

  const goToPage = (nextPage) => {
    const clampedPage = Math.min(Math.max(1, nextPage), totalPages);

    if (clampedPage === page) {
      return;
    }

    setPage(clampedPage);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const categories = [
    "Все",
    ...new Set(products.map((plant) => plant.category).filter(Boolean)),
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
        setProducts(
          Array.isArray(data.plantsSendToFront) ? data.plantsSendToFront : [],
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Не удалось загрузить каталог");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPlants();

    return () => controller.abort();
  }, []);

  if (loading) {
    return <p>Загрузка каталога...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <div className="page">
      <Header {...headerProps} />

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
            {categories.map((category) => (
              <button
                id={category}
                className={`catalog__filter ${
                  activeCategory === category ? "is-active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="catalog__grid" ref={gridRef}>
            {visibleProducts.map((product) => (
              <article
                className="catalog-card"
                id={product.id}
                id={product.id}
                onClick={() => setSelected(product)}
              >
                <div className="catalog-card__img">
                  <img src={product.img} alt={product.name} />
                </div>

                <div className="catalog-card__info">
                  <div>
                    <h3 className="catalog-card__name">{product.name}</h3>
                    <span className="catalog-card__category">
                      {product.category}
                    </span>
                    <span className="catalog-card__price">
                      ${product.price}
                    </span>
                  </div>

                  <button
                    className="catalog-card__add"
                    aria-label="Добавить в корзину"
                    onClick={(event) => {
                      event.stopPropagation();
                      addToCart(product);
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

          {totalPages > 1 && (
            <nav
              className="catalog__pagination"
              aria-label="Пагинация каталога"
            >
              <button
                className="catalog__page-btn"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                aria-label="Предыдущая страница"
              >
                ← Назад
              </button>

              {getPageNumbers(page, totalPages).map((item, index) =>
                item === "…" ? (
                  <span
                    className="catalog__page-ellipsis"
                    id={`ellipsis-${index}`}
                  >
                    …
                  </span>
                ) : (
                  <button
                    id={item}
                    className={`catalog__page-btn ${
                      item === page ? "is-active" : ""
                    }`}
                    onClick={() => goToPage(item)}
                    aria-current={item === page ? "page" : undefined}
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                className="catalog__page-btn"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                aria-label="Следующая страница"
              >
                Вперёд →
              </button>
            </nav>
          )}
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
