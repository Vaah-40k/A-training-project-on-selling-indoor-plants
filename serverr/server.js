const express = require("express");
const PORT = 40000;
const app = express();

const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
require("dotenv").config();

app.use(express.json());

const registrationFormValidation = require("./validation");
const { createJWT } = require("./createJWT");
const { userModules, plugPlantts } = require("./bd/indexdb");

app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  const html = await fs.readFileSync(path.join(__dirname, "index.html"));
  res.send(html);
});

app.post("/api/regisration_user", async (req, res) => {
  const result = registrationFormValidation.validateForm(req.body);

  if (!result.isValid) {
    console.log("Не удачная валидация -", result);
    return res.status(400).json({ isValidation: false, result });
  }
  const user = userModules.build({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const hash = await bcrypt.hash(req.body.password, 12);
  user.password = hash;
  await user.save();
  console.log(user.toJSON());
  const JSONuser = user.toJSON();
  const token = createJWT(JSONuser.id_user, JSONuser.name, JSONuser.email);
  console.log("Создан новый пользователь");
  res.status(200).json({ isValidation: true, token });
});

app.post("/api/autarization", async (req, res) => {
  let token;
  console.log(req.body);
  const user = await userModules.findOne({
    where: {
      email: req.body.email,
    },
    raw: true,
  });
  if (user) {
    const isPassword = await bcrypt.compare(req.body.password, user.password);
    console.log(isPassword);
    token = createJWT(user.id_user, user.name, user.email);
  } else {
    res.status(404).json({ message: "Пользователя с такой почтой - нет" });
  }
  res.status(200).json({ token });
});
app.get("/api/show_plants", async (req, res) => {
  try {
    const plants = await plugPlantts.findAll();
    res.status(200).json({ plants });
  } catch (err) {
    res.status(404).json({
      message: "Произошла ошибка сервера, невозможно отправить список растений",
    });
  }
});
app.listen(PORT, () => console.log(`Сервер запущен на порту - ${PORT}`));
