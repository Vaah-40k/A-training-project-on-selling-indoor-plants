import { where } from "sequelize";

/**
 * Валидация формы регистрации
 * @param {Object} data - объект с полями формы
 * @returns {{isValid: boolean, errors: Object}}
 */
import { userModules } from "../bd/indexdb.js";
export async function validateFormRegistration(data) {
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
  const findEmail = await userModules.findOne({
    where: {
      email: data.email,
    },
  });
  if (findEmail) {
    errors.email = "Пользователь с такой почтой уже существует";
  }

  // ---------- PHONE ----------
  // Допускаем форматы:
  //   +7 914 549-25-11, +79145492511, +7(914)549-25-11,
  //   8 914 549-25-11,  89145492511,  8(914)549-25-11,
  //   +7-914-549-25-11 и т.п.
  const phoneRegex = /^(\+7|8)[\s(-]*\d{3}[\s)-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}$/;

  if (!data.phone || String(data.phone).trim() === "") {
    errors.phone = "Телефон обязателен для заполнения";
  } else {
    const rawPhone = String(data.phone).trim();
    const digitsOnly = rawPhone.replace(/\D/g, ""); // оставляем только цифры

    if (!phoneRegex.test(rawPhone)) {
      errors.phone = "Введите корректный телефон (например, +7 914 549-25-11)";
    } else if (digitsOnly.length !== 11) {
      errors.phone = "Телефон должен содержать 11 цифр";
    } else {
      const normalized = digitsOnly.startsWith("8")
        ? "7" + digitsOnly.slice(1)
        : digitsOnly;

      const findPhone = await userModules.findOne({
        where: { phone: normalized },
      });
      if (findPhone) {
        errors.phone = "Пользователь с таким телефоном уже существует";
      }
    }
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
