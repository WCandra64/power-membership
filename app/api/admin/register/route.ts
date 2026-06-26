import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { localTime } from "@/lib/time";

export async function POST(req: Request) {
  let conn;

  try {
    const {
      name,
      noHp,
      photoUrl,
      photoId,
      startMembership,
      endMembership,
    } = await req.json();
    const now = localTime();

    const date = now.toISOString().slice(0, 10);

    conn = await db.getConnection();

    await conn.beginTransaction();

    // 1. CREATE MEMBER
    const [memberResult]: any = await db.query(
      `
      INSERT INTO members (nama, no_telp, foto_url, foto_id, waktu_daftar, terdaftar, created_at)
      VALUES (?, ?, ?, ?, ?, TRUE, ?)
      `,
      [name, noHp, photoUrl, photoId, now, now]
    );

    const memberId = memberResult.insertId;

    // USERNAME & PASSWORD GENERATE
    const base = name.toLowerCase().replace(/\s+/g, "");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const [rows]: any = await db.query(
      "SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = ?", [now]
    );
    const counter = String(rows[0].count + 1).padStart(2, "0");

    const username = base + day + counter;
    const password = hours + minutes + base + day;
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. CREATE USER
    await db.query(
      `INSERT INTO users (id_member, username, password, role, created_at)
       VALUES (?, ?, ?, 'member', ?)`,
      [memberId, username, hashedPassword, now]
    );

    // 3. CREATE MEMBERSHIP
    await db.query(
      `INSERT INTO membership (id_member, tgl_mulai, tgl_kedaluwarsa, created_at)
       VALUES (?, ?, ?, ?)`,
      [memberId, startMembership, endMembership, now]
    );

    await conn.commit();

    return NextResponse.json({
      message: "Member created",
      memberId,
      username,
      password: password
    });

  } catch (err: any) {
    console.error("MEMBER REGISTRATION ERROR:", err);

    return NextResponse.json(
      {
        message: "Server error",
        error: err?.message || err,
      },
      { status: 500 }
    );
  }
}