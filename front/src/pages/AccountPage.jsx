import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import "../assets/styles/Account.css";
import { jwtDecoded } from "../utils/jwtDecoded";

const avatarPlaceholder = (label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="60" fill="#e8f0e5"/>
      <text x="50%" y="50%" font-family="sans-serif" font-size="40" fill="#2f4f4f"
        text-anchor="middle" dominant-baseline="middle">${label}</text>
    </svg>`,
  )}`;

const mockpurchases = [
  {
    id: "GN-1042",
    date: "18.11.2026",
    status: "Доставлен",
    total: "$49.98",
    items: ["Snake Plant", "Peace Lily"],
  },
  {
    id: "GN-1031",
    date: "02.11.2026",
    status: "В пути",
    total: "$29.99",
    items: ["Monstera"],
  },
  {
    id: "GN-1015",
    date: "21.10.2026",
    status: "Доставлен",
    total: "$52.98",
    items: ["ZZ Plant", "Aloe Vera"],
  },
];

const AccountPage = ({ onBack, ...headerProps }) => {
  const [payload, setPayload] = useState(() => jwtDecoded());
  const { totalCount } = useCart();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: payload?.name ?? "",
    email: payload?.email ?? "",
    phone: payload?.phone ?? "",
  });

  const [page, setPage] = useState(1);
  const PER_PAGE = 3;

  const [dataAllPurchases, setDataAllPurchases] = useState(null);

  const startEditing = () => {
    setFormData({
      name: payload?.name ?? "",
      email: payload?.email ?? "",
      phone: payload?.phone ?? "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setFormData({
      name: payload?.name ?? "",
      email: payload?.email ?? "",
      phone: payload?.phone ?? "",
    });
    setIsEditing(false);
  };

  const saveEditing = async () => {
    setPayload((prev) => ({ ...prev, ...formData }));
    formData.id_user = payload.id;
    setIsEditing(false);
    const respone = await fetch("/api/update_user_data", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await respone.json();
    if (data.isValidation) {
      localStorage.setItem("JWTtoken", data.token);
    } else {
      console.log(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch(
          `/api/show_all_purchases_user/${payload.id}`,
          {},
        );
        const data = await response.json();
        setDataAllPurchases(data);
      } catch (err) {
        console.log("Ошибка чтения заказов, повторите попытку позже", -err);
      }
    };

    fetchPurchases();
  }, []);

  console.log(dataAllPurchases);

  return (
    <div className="page">
      <Header {...headerProps} />

      <main className="account">
        <div className="container">
          <button className="account__back" onClick={onBack}>
            ← Вернуться на главную
          </button>

          <div className="account__header">
            <img
              className="account__avatar"
              src={avatarPlaceholder(payload.name[0])}
              alt={payload.name}
            />
            <div>
              <h1 className="account__name">{payload.name}</h1>
              <p className="account__meta">{payload.email}</p>
            </div>
            <button
              className="btn btn--ghost account__logout"
              onClick={() => localStorage.removeItem("JWTtoken")}
            >
              Выйти
            </button>
          </div>

          <div className="account__grid">
            <section className="account-card">
              <h2 className="account-card__title">Личные данные</h2>

              {isEditing ? (
                <>
                  <label className="account-card__row">
                    <span>Имя: </span>
                    <input
                      type="text"
                      name="name"
                      className="account-card__input"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="account-card__row">
                    <span>Email: </span>
                    <input
                      type="email"
                      name="email"
                      className="account-card__input"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="account-card__row">
                    <span>Телефон: </span>
                    <input
                      type="tel"
                      name="phone"
                      className="account-card__input"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </label>

                  <div className="account-card__actions">
                    <button className="btn btn--ghost" onClick={cancelEditing}>
                      Отменить
                    </button>
                    <button className="btn btn--dark" onClick={saveEditing}>
                      Сохранить
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="account-card__row">
                    <span>Имя</span>
                    <strong>{payload.name}</strong>
                  </div>
                  <div className="account-card__row">
                    <span>Email</span>
                    <strong>{payload.email}</strong>
                  </div>
                  <div className="account-card__row_t">
                    <span>Телефон</span>
                    <strong>{payload.phone}</strong>
                  </div>
                  <button
                    className="btn btn--dark account-card__btn"
                    onClick={startEditing}
                  >
                    Редактировать
                  </button>
                </>
              )}
            </section>

            <section className="account-card account__purchases">
              <h2 className="account-card__title">Заказы</h2>
              {mockpurchases.length === 0 ? (
                <p className="account__empty">Заказов пока нет.</p>
              ) : (
                <>
                  {mockpurchases
                    .slice((page - 1) * PER_PAGE, page * PER_PAGE)
                    .map((o) => (
                      <article className="order" key={o.id}>
                        <div className="order__head">
                          <div>
                            <h3 className="order__id">Заказ {o.id}</h3>
                            <span className="order__date">{o.date}</span>
                          </div>
                          <span
                            className={`order__status ${
                              o.status === "Доставлен" ? "is-done" : "is-progress"
                            }`}
                          >
                            {o.status}
                          </span>
                        </div>
                        <p className="order__items">{o.items.join(", ")}</p>
                        <div className="order__foot">
                          <span>Сумма: {o.total}</span>
                          <button className="btn btn--ghost">Подробнее</button>
                        </div>
                      </article>
                    ))}

                  {mockpurchases.length > PER_PAGE && (
                    <div className="pagination">
                      <button
                        className="pagination__btn"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        ← Назад
                      </button>

                      <span className="pagination__info">
                        Страница {page} из{" "}
                        {Math.ceil(mockpurchases.length / PER_PAGE)}
                      </span>

                      <button
                        className="pagination__btn"
                        onClick={() =>
                          setPage((p) =>
                            Math.min(
                              Math.ceil(mockpurchases.length / PER_PAGE),
                              p + 1,
                            ),
                          )
                        }
                        disabled={
                          page === Math.ceil(mockpurchases.length / PER_PAGE)
                        }
                      >
                        Вперёд →
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountPage;