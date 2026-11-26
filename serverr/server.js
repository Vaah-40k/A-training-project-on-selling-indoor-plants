const express = require("express");
const PORT = 40000;
const app = express();

const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
require("dotenv").config();

app.use(express.json());

const {
  validateFormRegistration,
} = require("./validations/validationRegistrations");
const {
  validateFormUpdateUserData,
} = require("./validations/validationsUpdateUserData");
const { createJWT } = require("./createJWT");
const {
  userModules,
  plugs,
  basket,
  purchasesModules,
} = require("./bd/indexdb");

app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  const html = await fs.readFileSync(path.join(__dirname, "index.html"));
  res.send(html);
});

app.post("/api/regisration_user", async (req, res) => {
  const result = await validateFormRegistration(req.body);
  if (!result.isValid) {
    console.log("Не удачная валидация -", result);
    return res
      .status(400)
      .json({ isValidation: result.isValid, error: result.errors });
  }
  const user = userModules.build({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  });

  const hash = await bcrypt.hash(req.body.password, 12);
  user.password = hash;
  await user.save();
  const token = createJWT(user.id_user, user.email, user.name, user.phone);
  console.log("Создан новый пользователь");
  res.status(200).json({ isValidation: true, token });
});

app.post("/api/autarization", async (req, res) => {
  let token;
  const user = await userModules.findOne({
    where: {
      email: req.body.email,
    },
    raw: true,
  });
  if (user) {
    const isPassword = await bcrypt.compare(req.body.password, user.password);
    if (isPassword) {
      token = createJWT(user.id_user, user.email, user.name, user.phone);
    } else {
      res.status(404).json({
        isValidation: false,
        message: "Не правильная почта или пароль",
      });
    }
  } else {
    res.status(404).json({
      isValidation: false,
      message: "Пользователя с такой почтой - нет",
    });
  }
  res.status(200).json({ isValidation: true, token });
});
app.get("/api/show_all_users", async (req, res) => {
  try {
    const allUserData = await userModules.findAll();
    if (allUserData.length == 0) {
      return res
        .status(500)
        .json({ message: "В бд нет ни одного пользователя", findUser: false });
    } else {
      return res.status(200).json({ findUser: true, allUserData });
    }
  } catch (err) {
    console.log(
      "Не удалось прочесть БД, невозможно вывести пользователей",
      err,
    );
    return res.status(500).json({
      message: "Не удалось прочесть БД, невозможно вывести пользователей",
      findUser: false,
    });
  }
});
app.put("/api/update_user_data", async (req, res) => {
  const { name, email, phone, id_user } = req.body;
  const validateFormRegistrationUpdateUserData =
    await validateFormUpdateUserData({ name, email, phone }, { id_user });
  if (!validateFormRegistrationUpdateUserData.isValid) {
    return res.status(400).json({
      isValidation: false,
      errors: validateFormRegistrationUpdateUserData.errors,
    });
  }
  await userModules.update(
    { name, email, phone },
    {
      where: {
        id_user,
      },
    },
  );
  const token = createJWT(id_user, email, name, phone);
  console.log("Пользователь изменил свои данные");

  res.status(200).json({
    message: "Пользователь изменил свои данные",
    token,
    isValidation: true,
  });
});

app.put("/api/update_user_basket", async (req, res) => {
  try {
    const { id_user, id_plant, delta } = req.body;
    const entryBasketTable = await basket.findOne({
      where: {
        id_user,
        id_plant,
      },
      raw: true,
    });

    if (entryBasketTable == null) {
      await basket.create({
        id_user,
        id_plant,
        count_plant: 1,
      });
      return res.status(200).json({ message: "Создана запись в БД" });
    } else {
      await basket.update(
        { count_plant: entryBasketTable.count_plant + delta },
        { where: { id_user, id_plant } },
      );
      return res.status(200).json({ message: "Корзина обновлена" });
    }
  } catch (err) {
    console.log("Произошла внутряняя ошибка сервера", -err);
    res.status(500).json({ message: "Произошла внутряняя ошибка сервера" });
  }
});

app.post("/api/show_user_basket", async (req, res) => {
  try {
    const { id_user } = req.body;
    const data = await basket.findAll({
      where: {
        id_user,
      },
      include: [
        {
          model: plugs,
          attributes: ["id_plant", "name", "price", "url_link"],
        },
      ],
      raw: true,
    });
    if (data.length === 0) {
      return res.status(200).json({ message: "Ваша корзина пуста" });
    } else {
      return res.status(200).json({ data });
    }
  } catch (err) {
    console.log("Произошла внутряняя ошибка сервера", -err);
    res.status(500).json({ message: "Произошла внутряняя ошибка сервера" });
  }
});

app.post("/api/add_purchases_user", async (req, res) => {
  try {
    const { id_user, items } = req.body;

    const purchases = await purchasesModules.create({
      id_user,
      plants_data: JSON.stringify(items),
      status: "В обработке",
      total_sum: 1000,
    });

    await basket.destroy({ where: { id_user } });
    res.status(200).json({ message: "Добавлен новый заказ" });
  } catch (err) {
    console.log("Произошла внутряняя ошибка сервера", err);
    res.status(500).json({ message: "Произошла внутряняя ошибка сервера" });
  }
});

app.get("/api/show_all_purchases_user/:id", async (req, res) => {
  try {
    let userDataOnBD;
    const id_user = req.params.id;
    if (id_user == -1) {
      userDataOnBD = await purchasesModules.findAll({
        raw: true,
      });
    } else {
      userDataOnBD = await purchasesModules.findAll({
        where: {
          id_user,
        },
        raw: true,
      });
    }

    for (let index = 0; index < userDataOnBD.length; index++) {
      userDataOnBD[index].plants_data = JSON.parse(
        userDataOnBD[index].plants_data,
      );
    }
    res.status(200).json({ userDataOnBD });
  } catch (err) {
    console.log("Произошла внутряняя ошибка сервера", err);
    res.status(500).json({ message: "Произошла внутряняя ошибка сервера" });
  }
});

app.get("/api/show_plants", async (req, res) => {
  try {
    const plants = await plugs.findAll({
      raw: true,
    });
    let plantsSendToFront = [];
    let plantObject;
    for (let index = 0; index < plants.length; index++) {
      plantObject = {
        id: plants[index].id_plant,
        name: plants[index].name,
        price: plants[index].price,
        category: plants[index].type,
        description: plants[index].description,
        care: {
          light: plants[index].light,
          water: plants[index].watering,
          humidity: plants[index].humidity,
          temp: plants[index].temperature,
        },
        url_link: plants[index].url_link,
      };
      plantsSendToFront.push(plantObject);
    }

    res.status(200).json({ plantsSendToFront });
  } catch (err) {
    res.status(404).json({
      message: "Произошла ошибка сервера, невозможно отправить список растений",
    });
  }
});

app.post("/api/remove_plant_in_basket", async (req, res) => {
  try {
    const { id_user, id_plant } = req.body;
    await basket.destroy({ where: { id_user, id_plant } });
    res.status(200).json({ message: "запись из корзины удалена" });
  } catch (err) {
    res.status(500).json({ message: "Внутреняя ошибка сервера", err });
  }
});

app.post("/api/remove_all_basket", async (req, res) => {
  try {
    const { id_user } = req.body;
    await basket.destroy({ where: { id_user } });
    res.status(200).json({ message: "Корзина удалена" });
  } catch (err) {
    console.log("Произошла внутряняя ошибка сервера", err);
    res.status(500).json({ message: "Произошла внутряняя ошибка сервера" });
  }
});

app.listen(PORT, () => console.log(`Сервер запущен на порту - ${PORT}`));
