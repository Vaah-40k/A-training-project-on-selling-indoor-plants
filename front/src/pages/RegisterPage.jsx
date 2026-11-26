import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useCart } from "../context/CartContext";
import "../assets/styles/Auth.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirm: "",
};

async function readResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

const RegisterPage = ({ onBack, onGoLogin, onRegistrationSuccess }) => {
  const { items, clearCart } = useCart();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
      server: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Введите имя";
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      nextErrors.email = "Введите корректную электронную почту";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Введите номер телефона";
    }

    if (form.password.length < 6) {
      nextErrors.password = "Пароль должен содержать не менее 6 символов";
    }

    if (form.confirm !== form.password) {
      nextErrors.confirm = "Пароли не совпадают";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting || !validateForm()) {
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/regisration_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim(),
          repeat_password: form.confirm,
        }),
      });

      const data = await readResponse(response);

      if (!response.ok || data.isValidation !== true || !data.token) {
        throw new Error(
          data.message || "Не удалось зарегистрировать пользователя",
        );
      }

      // Получаем ID созданного пользователя из JWT.
      const tokenPayload = jwtDecode(data.token);
      const id_user = tokenPayload?.id_user ?? tokenPayload?.id;

      // Сохраняем товары гостевой корзины перед переносом.
      const guestItems = [...items];

      if (
        guestItems.length > 0 &&
        (id_user === undefined || id_user === null)
      ) {
        throw new Error(
          "Регистрация прошла, но в токене не найден ID пользователя. Корзина пока не перенесена.",
        );
      }

      // Переносим каждый товар в серверную корзину пользователя.
      for (const item of guestItems) {
        const basketResponse = await fetch("/api/update_user_basket", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_user,
            id_plant: item.id,
            delta: item.qty,
          }),
        });

        const basketData = await readResponse(basketResponse);

        if (
          !basketResponse.ok ||
          basketData.isValidation === false ||
          basketData.success === false
        ) {
          throw new Error(
            basketData.message ||
              `Не удалось перенести товар «${item.name}» в аккаунт`,
          );
        }
      }

      // Сохраняем токен и очищаем гостевую корзину
      // только после успешного переноса всех товаров.
      localStorage.setItem("JWTtoken", data.token);
      localStorage.removeItem("guestCart");
      clearCart();

      setSubmitted(true);

      // Возвращаем пользователя на страницу корзины.
      onRegistrationSuccess?.();
    } catch (error) {
      console.error("Ошибка регистрации:", error);

      setErrors((prevErrors) => ({
        ...prevErrors,
        server: error.message || "Произошла ошибка при регистрации",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <button type="button" className="auth__back" onClick={onBack}>
          ← Вернуться в магазин
        </button>

        <h1 className="auth__title">Регистрация</h1>

        <p className="auth__subtitle">
          Присоединяйтесь к GreenNest и привнесите природу домой.
        </p>

        {submitted ? (
          <div className="auth__success">
            Аккаунт создан. Перенаправляем в корзину...
          </div>
        ) : (
          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <label className="auth__field">
              <span>Имя</span>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Иван Зелёный"
                autoComplete="name"
              />

              {errors.name && <em className="auth__error">{errors.name}</em>}
            </label>

            <label className="auth__field">
              <span>Email</span>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />

              {errors.email && <em className="auth__error">{errors.email}</em>}
            </label>

            <label className="auth__field">
              <span>Phone</span>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+7999-999-99-99"
                autoComplete="tel"
              />

              {errors.phone && <em className="auth__error">{errors.phone}</em>}
            </label>

            <label className="auth__field">
              <span>Пароль</span>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••"
                autoComplete="new-password"
              />

              {errors.password && (
                <em className="auth__error">{errors.password}</em>
              )}
            </label>

            <label className="auth__field">
              <span>Повторите пароль</span>

              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="••••••"
                autoComplete="new-password"
              />

              {errors.confirm && (
                <em className="auth__error">{errors.confirm}</em>
              )}
            </label>

            {errors.server && <em className="auth__error">{errors.server}</em>}

            <button
              type="submit"
              className="btn btn--dark auth__submit"
              disabled={submitting}
            >
              {submitting ? "Создаём аккаунт..." : "Создать аккаунт"}
            </button>
          </form>
        )}

        <p className="auth__switch">
          Уже есть аккаунт?{" "}
          <button type="button" className="auth__link" onClick={onGoLogin}>
            Войти
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
