import { Op } from "sequelize";
import { userModules } from "../bd/indexdb.js";

/**
 * Валидация формы личных данных пользователя
 * @param {Object} data - объект с полями формы { name, email, phone }
 * @param {Object} [options] - доп. опции
 * @param {number|string} [options.id_user] - id текущего пользователя
 *        (нужен, чтобы при проверке уникальности не сравнивать его с самим собой)
 * @returns {{isValid: boolean, errors: Object}}
 */
export async function validateFormUpdateUserData(data, options = {}) {
  const { id_user } = options;
  const errors = {};

  // ---------- NAME ----------
  if (!data.name || data.name.trim() === "") {
    errors.name = "Имя обязательно для заполнения";
  } else if (!/^[а-яА-ЯёЁa-zA-Z\s-]{2,30}$/.test(data.name.trim())) {
    errors.name =
      "Имя должно содержать от 2 до 30 букв (кириллица или латиница)";
  }

  // ---------- EMAIL ----------
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!data.email || data.email.trim() === "") {
    errors.email = "Email обязателен для заполнения";
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = "Введите корректный email (например, user@mail.ru)";
  } else {
    const where = { email: data.email.trim() };
    if (id_user != null) {
      where.id_user = { [Op.ne]: id_user }; // ← было where.id
    }
    const findEmail = await userModules.findOne({ where });
    if (findEmail) {
      errors.email = "Пользователь с такой почтой уже существует";
    }
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
    const digitsOnly = rawPhone.replace(/\D/g, "");

    if (!phoneRegex.test(rawPhone)) {
      errors.phone = "Введите корректный телефон (например, +7 914 549-25-11)";
    } else if (digitsOnly.length !== 11) {
      errors.phone = "Телефон должен содержать 11 цифр";
    } else {
      // Нормализуем 8XXXXXXXXXX -> 7XXXXXXXXXX,
      // чтобы 8-ка и +7 считались одним номером
      const normalized = digitsOnly.startsWith("8")
        ? "7" + digitsOnly.slice(1)
        : digitsOnly;

      const where = { phone: normalized };
      if (id_user != null) {
        where.id = { [Op.ne]: id_user };
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
