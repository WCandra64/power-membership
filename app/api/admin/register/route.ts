import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { localTime, storeDate, storeTime } from "@/lib/time";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  let conn;
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, phone, photoUrl, photoId, startMembership, endMembership, } =
      await req.json();
    const now = localTime();
    const dbNow = storeTime();
    conn = await db.getConnection();
    await conn.beginTransaction();

    const [memberResult]: any = await db.query(`
      INSERT INTO members (nama, no_telp, foto_url, foto_id, created_at)
      VALUES (?, ?, ?, ?, ?)
      `, [name, phone, photoUrl, photoId, dbNow]
    );
    const memberId = memberResult.insertId;
    const base = name.toLowerCase().replace(/\s+/g, "");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const [rows]: any = await db.query(`
      SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = ?
      `, [storeDate()]
    );
    const counter = String(rows[0].count + 1).padStart(2, "0");
    const username = base + day + counter;
    const password = hours + minutes + base + day;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(`
      INSERT INTO users (id_member, username, password, role, created_at)
      VALUES (?, ?, ?, 'member', ?)
      `, [memberId, username, hashedPassword, dbNow]
    );
    await db.query(`
      INSERT INTO membership (id_member, tgl_mulai, tgl_kedaluwarsa, created_at)
      VALUES (?, ?, ?, ?)
      `, [memberId, startMembership, endMembership, dbNow]
    );
    await conn.commit();

    return Response.json({
      success: true, message: "Member created",
      memberId, username, password
    });
  } catch (err: any) {
    console.error("MEMBER REGISTRATION ERROR:", err);
    return Response.json(
      { message: "Server error", error: err?.message || err, },
      { status: 500 }
    );
  }
}