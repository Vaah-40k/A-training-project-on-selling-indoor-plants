import { jwtDecode } from "jwt-decode";

export function jwtDecoded() {
  const JWTtoken = localStorage.getItem("JWTtoken");

  if (!JWTtoken) {
    console.log("Отсутвует токен в системе");
    // TODO: ПРИ ПУСТОМ payload нужно сделать редирект на страницу авторизации
    return;
  }
  try {
    const payloadJWT = jwtDecode(JWTtoken);
    return payloadJWT;
  } catch (err) {
    console.log("Ошибка декодирования - ", err);
  }
}
