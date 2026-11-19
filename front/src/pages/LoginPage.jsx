import { useState } from "react";
import "../assets/styles/Auth.css";

const LoginPage = ({ onBack, onGoRegister }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err = {};
    if (!form.email.trim()) err.email = "Введите email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Некорректный email";
    if (!form.password) err.password = "Введите пароль";
    else if (form.password.length < 6) err.password = "Минимум 6 символов";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    try {
      const respone = await fetch("/api/autarization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await respone.json();
      console.log(data);
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

        <h1 className="auth__title">Вход</h1>
        <p className="auth__subtitle">
          Войдите, чтобы управлять растениями и заказами.
        </p>

        {submitted ? (
          <div className="auth__success">✅ Вы вошли (демо).</div>
        ) : (
          <form className="auth__form" onSubmit={handleSubmit} noValidate>
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

            <button type="submit" className="btn btn--dark auth__submit">
              Войти
            </button>
          </form>
        )}

        <p className="auth__switch">
          Нет аккаунта?{" "}
          <button type="button" className="auth__link" onClick={onGoRegister}>
            Зарегистрироваться
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
