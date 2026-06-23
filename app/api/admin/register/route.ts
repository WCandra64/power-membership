import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  let conn;

  try {
    const {
      name,
      noHp,
      photo,
      deletePhoto,
      startMembership,
      endMembership,
    } = await req.json();
    const now = new Date();

    conn = await db.getConnection();

    await conn.beginTransaction();

    // 1. CREATE MEMBER
    const [memberResult]: any = await db.query(
      `
      INSERT INTO members (nama, no_telp, foto, hapus_foto, waktu_daftar, terdaftar)
      VALUES (?, ?, ?, ?, ?, TRUE)
      `,
      [name, noHp, photo, deletePhoto, now]
    );

    const memberId = memberResult.insertId;

    // USERNAME & PASSWORD GENERATE
    const base = name.toLowerCase().replace(/\s+/g, "");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const [rows]: any = await db.query(
      "SELECT COUNT(*) as count FROM users WHERE DAY(created_at) = DAY(NOW())"
    );
    const counter = String(rows[0].count + 1).padStart(2, "0");

    const username = base + day + counter;
    const password = hours + minutes + base + day;
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. CREATE USER
    await db.query(
      `INSERT INTO users (id_member, username, password, role)
       VALUES (?, ?, ?, 'member')`,
      [memberId, username, hashedPassword]
    );

    // 3. CREATE MEMBERSHIP
    await db.query(
      `INSERT INTO membership (id_member, tgl_mulai, tgl_kadaluarsa)
       VALUES (?, ?, ?)`,
      [memberId, startMembership, endMembership]
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