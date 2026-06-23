import bcrypt from "bcrypt";
import { db } from "./db";

export async function login(
  username: string,
  password: string
) {
  const [rows]: any = await db.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  const user = rows[0];

  if (!user) return null;

  const valid = await bcrypt.compare(
    password,
    user.password
  );

  if (!valid) return null;

  return user;
}