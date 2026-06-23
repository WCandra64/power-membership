import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

export async function createToken(
  id: number,
  role: string
) {
  return await new SignJWT({
    id,
    role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export async function getSession() {
  const token = (await cookies()).get("session")?.value;

  if (!token) return null;

  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}