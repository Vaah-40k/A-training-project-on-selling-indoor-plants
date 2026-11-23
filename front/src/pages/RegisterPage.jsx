import { useState } from "react";
import "../assets/styles/Auth.css";

const RegisterPage = ({ onBack, onGoLogin }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Введите имя";
    if (!form.email.trim()) err.email = "Введите email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Некорректный email";
    if (!form.password) err.password = "Введите пароль";
    else if (form.password.length < 6) err.password = "Минимум 6 символов";
    if (form.password !== form.confirm) err.confirm = "Пароли не совпадают";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    try {
      const respone = await fetch("/api/regisration_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          repeat_password: form.confirm,
        }),
      });
      const data = await respone.json();
      if (data.isValidation) {
        localStorage.setItem("JWTtoken", data.token);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.log("Ошибка-", err);
    }
    setSubmitted(true);
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <button className="auth__back" onClick={onBack}>
          ← Вернуться в магазин
        </button>

        <h1 className="auth__title">Регистрация</h1>
        <p className="auth__subtitle">
          Присоединяйтесь к GreenNest и привнесите природу домой.
        </p>

        {submitted ? (
          <div className="auth__success">Аккаунт создан (демо).</div>
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
              />
              {errors.confirm && (
                <em className="auth__error">{errors.confirm}</em>
              )}
            </label>

            <button type="submit" className="btn btn--dark auth__submit">
              Создать аккаунт
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
