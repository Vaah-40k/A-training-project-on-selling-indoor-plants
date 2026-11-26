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
  {
    id: 1,
    name: "Snake Plant",
    price: "$24.99",
    category: "Indoor",
    stock: 34,
    status: "Активен",
  },
  {
    id: 2,
    name: "Peace Lily",
    price: "$22.99",
    category: "Indoor",
    stock: 12,
    status: "Активен",
  },
  {
    id: 3,
    name: "Monstera",
    price: "$29.99",
    category: "Indoor",
    stock: 0,
    status: "Нет в наличии",
  },
  {
    id: 4,
    name: "ZZ Plant",
    price: "$26.99",
    category: "Indoor",
    stock: 21,
    status: "Активен",
  },
  {
    id: 5,
    name: "Aloe Vera",
    price: "$18.99",
    category: "Succulents",
    stock: 48,
    status: "Активен",
  },
  {
    id: 6,
    name: "Lavender",
    price: "$16.99",
    category: "Outdoor",
    stock: 5,
    status: "Мало на складе",
  },
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
  const [dataAllPurchases, setDataAllPurchases] = useState([]);
  const [dataAllUsers, setDataAllUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, purchasesResponse] = await Promise.all([
          fetch("/api/show_all_users"),
          fetch(`/api/show_all_purchases_user/-1`),
        ]);

        const usersData = await usersResponse.json();
        const purchasesData = await purchasesResponse.json();

        const formattedDataUser = usersData.allUserData.map((item) => {
          const userOrdersCount = purchasesData.userDataOnBD.filter(
            (order) => order.id_user === item.id_user,
          ).length;
          return {
            email: item.email,
            id_user: item.id_user,
            joined: "12",
            name: item.name,
            orders: userOrdersCount,
            role: "Покупатель",
          };
        });
        setDataAllUsers(formattedDataUser);

        const formattedDataPurchases = purchasesData.userDataOnBD.map(
          (order) => {
            const foundUser = usersData.allUserData.find(
              (u) => u.id_user === order.id_user,
            );
            const dataOfYears = new Date(order.createdAt);
            const readable = dataOfYears.toLocaleString("ru-RU");

            return {
              date: readable || "Дата неизвестна",
              id_purchases: order.id_purchases,
              status: order.status,
              total: order.total_sum,
              id_user: order.id_user,
              user: foundUser ? foundUser.name : "Неизвестный",
            };
          },
        );

        setDataAllPurchases(formattedDataPurchases);
      } catch (err) {
        console.error("Ошибка чтения данных:", err);
      }
    };

    fetchData();
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
            ].map(([id, label]) => (
              <button
                id={id}
                className={`admin__tab ${tab === id ? "is-active" : ""}`}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "dashboard" && (
            <>
              <div className="admin__stats">
                {mockStats.map((s) => (
                  <div className="admin-stat" id={s.label}>
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
                    {dataAllPurchases.slice(0, 4).map((o) => (
                      <div className="admin-table__row" id={o.id_purchases}>
                        <span className="admin-table__strong">
                          {o.id_purchases}
                        </span>
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
                    {dataAllUsers.slice(0, 4).map((u) => (
                      <div className="admin-table__row" id={u.id_user}>
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
                  <div className="admin-table__row" id={p.id}>
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
                {dataAllPurchases.map((o) => (
                  <div className="admin-table__row" id={o.id_purchases}>
                    <span className="admin-table__strong">
                      Id заказа: {o.id_purchases}
                    </span>
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
                {dataAllUsers.map((u) => (
                  <div className="admin-table__row" id={u.id_user}>
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
