import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { jwtDecoded } from "../utils/jwtDecoded";
import "../assets/styles/Cart.css";

const CartPage = ({
  onBack,
  onShopNow,
  onLoginClick,
  onRegisterClick,
  onCartClick,
  onAccountClick,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = jwtDecoded();
  const id_user = user?.id_user || user?.id;

  useEffect(() => {
    // Если токена нет — не делаем запрос
    if (!id_user) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadBasket() {
      try {
        setLoading(true);
        const response = await fetch("/api/show_user_basket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_user }),
          signal: controller.signal,
        });

        const resData = await response.json();

        if (resData.message === "Ваша корзина пуста") {
          setItems([]);
        } else if (response.ok) {
          // Форматируем данные из бэкенда под нужды фронтенда
          const formattedItems = resData.data.map((item) => ({
            id: item.id_plant,
            qty: item.count_plant,
            name: item["plant.name"] || "Неизвестное растение",
            price: item["plant.price"] || "$0.00",
            img: item["plant.url_link"] || "/img/placeholder.jpg",
          }));
          setItems(formattedItems);
        } else {
          throw new Error(resData.message || "Ошибка при загрузке");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadBasket();
    return () => controller.abort();
  }, [id_user]);

  // Подсчет итоговой суммы
  const totalPrice = items.reduce((sum, i) => {
    return sum + i.qty;
  }, 0);

  // Временные локальные функции (нужно будет привязать к API)
  const changeQty = async (id_plant, delta) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id_plant ? { ...i, qty: Math.max(1, i.qty + delta) } : i,
      ),
    );
    // TODO: Сделать 3 фикс
    const respone = await fetch("/api/update_user_basket", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_user, id_plant, delta }),
    });
    const data = await respone.json();
    console.log(data);
  };
  const removeFromCart = async (id_plant) => {
    setItems((prev) => prev.filter((i) => i.id !== id_plant));
    const respone = await fetch("/api/remove_plant_in_basket", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_user, id_plant }),
    });
    const data = await respone.json();
    console.log(data);
  };
  const removeAllBasket = async () => {
    const respone = await fetch("/api/remove_all_basket", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_user }),
    });
    const data = await respone.json();
    console.log(data);
  };

  const addPurchases = async () => {
    console.log(items);
    const respone = await fetch("/api/add_purchases_user", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_user, items }),
    });
    const data = await respone.json();
    console.log(data);
  };

  if (loading) {
    return (
      <div className="page">
        <Header
          {...{ onLoginClick, onRegisterClick, onCartClick, onAccountClick }}
        />
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
      <Header
        onLoginClick={onLoginClick}
        onRegisterClick={onRegisterClick}
        onCartClick={onCartClick}
        onAccountClick={onAccountClick}
      />

      <main className="cart">
        <div className="container">
          <button className="cart__back" onClick={onBack}>
            ← Вернуться на главную
          </button>

          <h1 className="cart__title">Корзина</h1>

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
                {items.map((i) => (
                  <article className="cart-item" key={i.id} id={i.id}>
                    <div className="cart-item__img">
                      <img src={i.img} alt={i.name} />
                    </div>
                    <div className="cart-item__info">
                      <h3 className="cart-item__name">{i.name}</h3>
                      <span className="cart-item__price">{i.price}</span>
                    </div>
                    <div className="cart-item__qty">
                      <button
                        onClick={() => changeQty(i.id, -1)}
                        aria-label="Уменьшить"
                      >
                        −
                      </button>
                      <span>{i.qty}</span>
                      <button
                        onClick={() => changeQty(i.id, 1)}
                        aria-label="Увеличить"
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item__subtotal">
                      ${i.qty.toFixed(2)}
                    </div>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeFromCart(i.id)}
                      aria-label="Удалить"
                    >
                      ✕
                    </button>
                  </article>
                ))}

                <button
                  className="cart__clear"
                  onClick={() => {
                    removeAllBasket();
                    setItems([]);
                  }}
                >
                  Очистить корзину
                </button>
              </div>

              <aside className="cart__summary">
                <h2 className="cart__summary-title">Итого</h2>
                <div className="cart__summary-row">
                  <span>Товары</span>
                  <span>{items.reduce((sum, i) => sum + i.qty, 0)} шт.</span>
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
                  onClick={() => addPurchases()}
                >
                  Оформить заказ
                </button>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
