import { NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { createToken } from "@/lib/session";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = await login(username, password);

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = await createToken(
    user.id,
    user.role
  );

  const res = NextResponse.json({ message: "Login success" });

  res.cookies.set("session", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}