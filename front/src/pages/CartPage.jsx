import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { jwtDecoded } from "../utils/jwtDecoded";
import { useCart } from "../context/CartContext";
import "../assets/styles/Cart.css";

async function readResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

const CartPage = ({ onBack, onShopNow, onRequireAuth, ...headerProps }) => {
  const {
    items,
    changeQty: changeCartQty,
    removeFromCart: removeCartItem,
    replaceCart,
    clearCart,
    totalPrice,
  } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const JWTtoken = localStorage.getItem("JWTtoken");
  const user = jwtDecoded();
  const id_user = user?.id_user ?? user?.id ?? null;
  const isAuthenticated = Boolean(JWTtoken && id_user !== null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBasket() {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/show_user_basket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_user }),
          signal: controller.signal,
        });

        const resData = await readResponse(response);

        if (!response.ok) {
          throw new Error(resData.message || "Не удалось загрузить корзину");
        }

        if (
          resData.message === "Ваша корзина пуста" ||
          !Array.isArray(resData.data)
        ) {
          replaceCart([]);
          return;
        }

        const formattedItems = resData.data.map((item) => ({
          id: item.id_plant,
          qty: Number(item.count_plant) || 1,
          name: item["plant.name"] || "Неизвестное растение",
          price: Number(item["plant.price"]) || 0,
          img: item["plant.url_link"] || "/img/placeholder.jpg",
        }));

        replaceCart(formattedItems);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ошибка при загрузке корзины");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBasket();

    return () => controller.abort();
  }, [id_user, isAuthenticated, replaceCart]);

  const changeQty = async (id_plant, delta) => {
    const currentItem = items.find(
      (item) => String(item.id) === String(id_plant),
    );

    if (!currentItem || currentItem.qty + delta < 1) {
      return;
    }

    if (!isAuthenticated) {
      changeCartQty(id_plant, delta);
      return;
    }

    try {
      setError(null);

      const response = await fetch("/api/update_user_basket", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user, id_plant, delta }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Не удалось изменить количество");
      }

      changeCartQty(id_plant, delta);
    } catch (err) {
      setError(err.message || "Ошибка изменения количества");
    }
  };

  const removeFromCart = async (id_plant) => {
    if (!isAuthenticated) {
      removeCartItem(id_plant);
      return;
    }

    try {
      setError(null);

      const response = await fetch("/api/remove_plant_in_basket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user, id_plant }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Не удалось удалить товар");
      }

      removeCartItem(id_plant);
    } catch (err) {
      setError(err.message || "Ошибка удаления товара");
    }
  };

  const removeAllBasket = async () => {
    if (isAuthenticated) {
      try {
        setError(null);

        const response = await fetch("/api/remove_all_basket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_user }),
        });

        const data = await readResponse(response);

        if (!response.ok) {
          throw new Error(data.message || "Не удалось очистить корзину");
        }
      } catch (err) {
        setError(err.message || "Ошибка очистки корзины");
        return;
      }
    }

    clearCart();
  };

  const addPurchases = async () => {
    console.log(items);
    if (ordering || items.length === 0) {
      return;
    }

    setOrdering(true);
    setError(null);

    try {
      const response = await fetch("/api/add_purchases_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user, items }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Не удалось оформить заказ");
      }

      clearCart();

      try {
        const clearResponse = await fetch("/api/remove_all_basket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_user }),
        });
        const clearData = await readResponse(clearResponse);

        if (!clearResponse.ok) {
          setError(
            clearData.message ||
              "Заказ создан, но серверную корзину не удалось очистить.",
          );
        }
      } catch (clearError) {
        setError("Заказ создан, но серверную корзину не удалось очистить.");
      }

      setOrderSuccess(true);
    } catch (err) {
      setError(err.message || "Ошибка оформления заказа");
    } finally {
      setOrdering(false);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }

    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }

    addPurchases();
  };

  if (loading) {
    return (
      <div className="page">
        <Header {...headerProps} />
        <main className="cart">
          <div className="container">
            <h2>Загрузка корзины...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Header {...headerProps} />

      <main className="cart">
        <div className="container">
          <button className="cart__back" onClick={onBack}>
            ← Вернуться на главную
          </button>

          <h1 className="cart__title">Корзина</h1>

          {orderSuccess ? (
            <div className="cart__success">
              <div className="cart__success-icon">✓</div>
              <h2 className="cart__success-title">Заказ успешно оформлен!</h2>
              <p className="cart__success-text">
                Спасибо за покупку. Мы свяжемся с вами в ближайшее время.
              </p>
              {error && (
                <p style={{ color: "#b45309", marginBottom: "16px" }}>
                  {error}
                </p>
              )}
              <button className="btn btn--dark" onClick={onShopNow}>
                Продолжить покупки
              </button>
            </div>
          ) : (
            <>
              {error && (
                <p style={{ color: "red", marginBottom: "20px" }}>
                  Ошибка: {error}
                </p>
              )}

              {items.length === 0 ? (
                <div className="cart__empty">
                  <p>Ваша корзина пуста.</p>
                  <button className="btn btn--dark" onClick={onShopNow}>
                    Перейти в каталог
                  </button>
                </div>
              ) : (
                <div className="cart__layout">
                  <div className="cart__list">
                    {items.map((item) => (
                      <article className="cart-item" id={item.id} id={item.id}>
                        <div className="cart-item__img">
                          <img src={item.img} alt={item.name} />
                        </div>

                        <div className="cart-item__info">
                          <h3 className="cart-item__name">{item.name}</h3>
                          <span className="cart-item__price">
                            ${Number(item.price || 0).toFixed(2)}
                          </span>
                        </div>

                        <div className="cart-item__qty">
                          <button onClick={() => changeQty(item.id, -1)}>
                            −
                          </button>
                          <span>{item.qty}</span>
                          <button onClick={() => changeQty(item.id, 1)}>
                            +
                          </button>
                        </div>

                        <div className="cart-item__subtotal">
                          ${(Number(item.price || 0) * item.qty).toFixed(2)}
                        </div>

                        <button
                          className="cart-item__remove"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Удалить"
                        >
                          ✕
                        </button>
                      </article>
                    ))}

                    <button className="cart__clear" onClick={removeAllBasket}>
                      Очистить корзину
                    </button>
                  </div>

                  <aside className="cart__summary">
                    <h2 className="cart__summary-title">Итого</h2>

                    <div className="cart__summary-row">
                      <span>Товары</span>
                      <span>
                        {items.reduce((sum, item) => sum + item.qty, 0)} шт.
                      </span>
                    </div>

                    <div className="cart__summary-row">
                      <span>Доставка</span>
                      <span>Бесплатно</span>
                    </div>

                    <div className="cart__summary-row cart__summary-row--total">
                      <span>Сумма</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>

                    <button
                      className="btn btn--dark cart__checkout"
                      onClick={handleCheckout}
                      disabled={ordering}
                    >
                      {ordering ? "Оформляем..." : "Оформить заказ"}
                    </button>
                  </aside>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
