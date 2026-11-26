import { jwtDecode } from "jwt-decode";

export function jwtDecoded() {
  const JWTtoken = localStorage.getItem("JWTtoken");

  if (!JWTtoken) {
    return { haveJSTtoken: false };
  }
  try {
    const payloadJWT = jwtDecode(JWTtoken);
    return payloadJWT;
  } catch (err) {
    console.log("Ошибка декодирования - ", err);
    return { haveJSTtoken: false };
  }
}
