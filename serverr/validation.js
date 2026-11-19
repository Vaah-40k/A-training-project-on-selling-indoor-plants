import { where } from "sequelize";

/**
 * Валидация формы регистрации
 * @param {Object} data - объект с полями формы
 * @returns {{isValid: boolean, errors: Object}}
 */
import { userModules } from "./bd/indexdb.js";
export function validateForm(data) {
  const errors = {};

  // ---------- LOGIN ----------
  if (!data.name || data.name.trim() === "") {
    errors.name = "Имя обязательно для заполнения";
  } else if (!/^[а-яА-ЯёЁa-zA-Z\s-]{2,30}$/.test(data.name.trim())) {
    errors.name =
      "Имя должно содержать от 2 до 30 букв (кириллица или латиница)";
  }

  // ---------- EMAIL ----------
  // Простая, но рабочая регулярка для email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!data.email || data.email.trim() === "") {
    errors.email = "Email обязателен для заполнения";
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Введите корректный email (например, user@mail.ru)";
  }
  const findEmail = userModules.findOne({
    where: data.email,
  });
  if (findEmail) {
    errors.email = "Пользователь с такой почтой уже существует";
  }

  // ---------- PASSWORD ----------
  if (!data.password || data.password === "") {
    errors.password = "Пароль обязателен для заполнения";
  } else if (data.password.length < 8) {
    errors.password = "Пароль должен содержать минимум 8 символов";
  } else if (!/[A-Za-z]/.test(data.password)) {
    errors.password = "Пароль должен содержать хотя бы одну букву";
  } else if (!/\d/.test(data.password)) {
    errors.password = "Пароль должен содержать хотя бы одну цифру";
  }

  // ---------- REPEAT PASSWORD ----------
  if (!data.repeat_password || data.repeat_password === "") {
    errors.repeat_password = "Подтвердите пароль";
  } else if (data.repeat_password !== data.password) {
    errors.repeat_password = "Пароли не совпадают";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
