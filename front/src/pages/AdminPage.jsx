import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/styles/Admin.css";

const avatarPlaceholder = (label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="60" fill="#1e3a2b"/>
      <text x="50%" y="50%" font-family="sans-serif" font-size="40" fill="#e8f0e5"
        text-anchor="middle" dominant-baseline="middle">${label}</text>
    </svg>`,
  )}`;

const productPlaceholder = (label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
      <rect width="100%" height="100%" fill="#e8f0e5"/>
      <text x="50%" y="50%" font-family="sans-serif" font-size="12" fill="#2f4f4f"
        text-anchor="middle" dominant-baseline="middle">${label}</text>
    </svg>`,
  )}`;

const mockAdmin = {
  name: "Анна Админова",
  email: "admin@greennest.com",
  role: "Администратор",
  joined: "01 января 2026",
  avatar: avatarPlaceholder("АА"),
};

const mockStats = [
  { label: "Пользователи", value: "1 248", trend: "+12 за неделю" },
  { label: "Заказы", value: "386", trend: "+24 за неделю" },
  { label: "Выручка", value: "$12 480", trend: "+$1 120 за неделю" },
  { label: "Товары", value: "52", trend: "3 на модерации" },
];

const mockProducts = [
  { id: 1, name: "Snake Plant", price: "$24.99", category: "Indoor", stock: 34, status: "Активен" },
  { id: 2, name: "Peace Lily", price: "$22.99", category: "Indoor", stock: 12, status: "Активен" },
  { id: 3, name: "Monstera", price: "$29.99", category: "Indoor", stock: 0, status: "Нет в наличии" },
  { id: 4, name: "ZZ Plant", price: "$26.99", category: "Indoor", stock: 21, status: "Активен" },
  { id: 5, name: "Aloe Vera", price: "$18.99", category: "Succulents", stock: 48, status: "Активен" },
  { id: 6, name: "Lavender", price: "$16.99", category: "Outdoor", stock: 5, status: "Мало на складе" },
];

const mockOrders = [
  { id: "GN-1042", user: "Иван Зелёный", date: "18.11.2026", total: "$49.98", status: "Доставлен" },
  { id: "GN-1041", user: "Мария Цветова", date: "18.11.2026", total: "$29.99", status: "В пути" },
  { id: "GN-1040", user: "Пётр Листов", date: "17.11.2026", total: "$76.97", status: "Обрабатывается" },
  { id: "GN-1039", user: "Ольга Росток", date: "17.11.2026", total: "$22.99", status: "Доставлен" },
  { id: "GN-1038", user: "Сергей Куст", date: "16.11.2026", total: "$18.99", status: "Отменён" },
];

const mockUsers = [
  { id: 1, name: "Иван Зелёный", email: "ivan@greennest.com", role: "Покупатель", orders: 8, joined: "12.03.2026" },
  { id: 2, name: "Мария Цветова", email: "maria@greennest.com", role: "Покупатель", orders: 3, joined: "02.05.2026" },
  { id: 3, name: "Пётр Листов", email: "petr@greennest.com", role: "Покупатель", orders: 12, joined: "21.01.2026" },
  { id: 4, name: "Анна Админова", email: "admin@greennest.com", role: "Администратор", orders: 0, joined: "01.01.2026" },
  { id: 5, name: "Ольга Росток", email: "olga@greennest.com", role: "Покупатель", orders: 5, joined: "14.07.2026" },
];

const statusClass = (status) => {
  if (status === "Доставлен" || status === "Активен") return "is-done";
  if (
    status === "В пути" ||
    status === "Обрабатывается" ||
    status === "Мало на складе"
  )
    return "is-progress";
  return "is-danger";
};

const AdminPage = ({ onBack, ...headerProps }) => {
  const [tab, setTab] = useState("dashboard");
  const [dataAllPurchases, setDataAllPurchases] = useState(null);
  const [dataAllUsers, setDataAllUsers] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      const adminId = -1;
      try {
        const response = await fetch(
          `/api/show_all_purchases_user/${adminId}`,
          {},
        );
        const data = await response.json();
        setDataAllPurchases(data);
      } catch (err) {
        console.log("Ошибка чтения заказов, повторите попытку позже", -err);
      }
    };

    fetchPurchases();

    const fetchGetAllUser = async () => {
      const respone = await fetch("/api/show_all_users");
      const data = await respone.json();
      setDataAllUsers(data);
    };
    fetchGetAllUser();
  }, []);

  console.log(dataAllPurchases);
  console.log(dataAllUsers);

  return (
    <div className="page">
      <Header {...headerProps} />

      <main className="admin">
        <div className="container">
          <button className="admin__back" onClick={onBack}>
            ← Вернуться на главную
          </button>

          <div className="admin__header">
            <img
              className="admin__avatar"
              src={mockAdmin.avatar}
              alt={mockAdmin.name}
            />
            <div>
              <h1 className="admin__name">{mockAdmin.name}</h1>
              <p className="admin__meta">
                {mockAdmin.email} · {mockAdmin.role} · с {mockAdmin.joined}
              </p>
            </div>
            <button className="btn btn--ghost admin__logout">Выйти</button>
          </div>

          <div className="admin__tabs">
            {[
              ["dashboard", "Обзор"],
              ["products", "Товары"],
              ["orders", "Заказы"],
              ["users", "Пользователи"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`admin__tab ${tab === key ? "is-active" : ""}`}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "dashboard" && (
            <>
              <div className="admin__stats">
                {mockStats.map((s) => (
                  <div className="admin-stat" key={s.label}>
                    <span className="admin-stat__label">{s.label}</span>
                    <strong className="admin-stat__value">{s.value}</strong>
                    <span className="admin-stat__trend">{s.trend}</span>
                  </div>
                ))}
              </div>

              <div className="admin__grid-2">
                <section className="admin-card">
                  <h2 className="admin-card__title">Последние заказы</h2>
                  <div className="admin-table">
                    {mockOrders.slice(0, 4).map((o) => (
                      <div className="admin-table__row" key={o.id}>
                        <span className="admin-table__strong">{o.id}</span>
                        <span>{o.user}</span>
                        <span>{o.total}</span>
                        <span
                          className={`admin-badge ${statusClass(o.status)}`}
                        >
                          {o.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="admin-card">
                  <h2 className="admin-card__title">Новые пользователи</h2>
                  <div className="admin-table">
                    {mockUsers.slice(0, 4).map((u) => (
                      <div className="admin-table__row" key={u.id}>
                        <span className="admin-table__strong">{u.name}</span>
                        <span>{u.email}</span>
                        <span>{u.role}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {tab === "products" && (
            <section className="admin-card">
              <div className="admin-card__head">
                <h2 className="admin-card__title">Товары</h2>
                <button className="btn btn--dark">Добавить товар</button>
              </div>
              <div className="admin-table admin-table--products">
                {mockProducts.map((p) => (
                  <div className="admin-table__row" key={p.id}>
                    <img
                      className="admin-table__thumb"
                      src={productPlaceholder(p.name.split(" ")[0])}
                      alt={p.name}
                    />
                    <span className="admin-table__strong">{p.name}</span>
                    <span>{p.category}</span>
                    <span>{p.price}</span>
                    <span>{p.stock} шт.</span>
                    <span className={`admin-badge ${statusClass(p.status)}`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "orders" && (
            <section className="admin-card">
              <h2 className="admin-card__title">Заказы</h2>
              <div className="admin-table admin-table--orders">
                {mockOrders.map((o) => (
                  <div className="admin-table__row" key={o.id}>
                    <span className="admin-table__strong">{o.id}</span>
                    <span>{o.user}</span>
                    <span>{o.date}</span>
                    <span>{o.total}</span>
                    <span className={`admin-badge ${statusClass(o.status)}`}>
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "users" && (
            <section className="admin-card">
              <h2 className="admin-card__title">Пользователи</h2>
              <div className="admin-table admin-table--users">
                {mockUsers.map((u) => (
                  <div className="admin-table__row" key={u.id}>
                    <span className="admin-table__strong">{u.name}</span>
                    <span>{u.email}</span>
                    <span>{u.role}</span>
                    <span>{u.orders} заказов</span>
                    <span>{u.joined}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;