"use server";

import { login } from "@/lib/auth";
import { createToken } from "@/lib/session";
import { storeTime } from "@/lib/time";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const user = await login(username, password);

  if (!user) {
    return { 
      error: "Username atau password salah!",
      ts: storeTime().getTime()
    };
  }

  const token = await createToken(
    user.id,
    user.role === "admin" ? 0 : user.id_member,
    username,
    user.role
  );

  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  if (user.role === "admin") redirect("/admin");
  else redirect("/member/"+username);
}