import jwt from "jsonwebtoken";
import "dotenv/config";

const Secret_Key = process.env.SECRETKEY;
export function createJWT(id, email, name) {
  const payload = {
    id,
    email,
    name,
  };
  const token = jwt.sign(payload, Secret_Key, { expiresIn: "24h" });
  return token;
}
