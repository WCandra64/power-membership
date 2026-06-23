"use server";

import { cookies } from "next/headers";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  // cookieStore.set("session", "", {
  //   httpOnly: true,
  //   expires: new Date(0), // instantly expires
  //   path: "/",
  // });
}