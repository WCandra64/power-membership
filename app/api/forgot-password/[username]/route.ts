import { db } from "@/lib/db";
import { localTime, storeDate, storeTime } from "@/lib/time";
import bcrypt from "bcrypt";

type Props = {
  params: Promise<{ username: string }>;
};

export async function GET(req: Request, { params }: Props) {
  try {
    const { username } = await params;

    if (!username?.trim()) {
      return Response.json(
        { message: "Username wajib diisi." },
        { status: 400 }
      );
    }

    const [rows] = await db.query(`
      SELECT u.username
      FROM users u
      WHERE u.username = ? AND u.role = 'member'
      LIMIT 1
      `, [username.trim()]
    );

    const users = rows as { username: string }[];

    if (users.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Username tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    return Response.json({ success: true, message: "Username ditemukan.", });

  } catch (err: any) {
    console.error("CHECK USERNAME ERROR:", err);

    return Response.json(
      { success: false, message: "Server error.", error: err?.message || err, },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params } : Props) {
  try {
    const { username } = await params;

    const { registrationDate, registrationTime, } = await req.json();

    if ( !username || !registrationDate || !registrationTime) {
      return Response.json(
        { message: "Semua data wajib diisi." },
        { status: 400 }
      );
    }

    const [rows] = await db.query(`
      SELECT created_at FROM users
      WHERE username = ? AND role = 'member'
      LIMIT 1
      `, [username]
    );

    const users = rows as { created_at: Date }[];

    if (!users.length) {
      return Response.json(
        { message: "Username tidak ditemukan." },
        { status: 404 }
      );
    }

    const createdAt = localTime(users[0].created_at);

    // Date comparison
    const dbDate = storeDate(createdAt);

    // Hour:Minute comparison
    const dbTime =
      `${String(createdAt.getHours()).padStart(2, "0")}:${String(createdAt.getMinutes()).padStart(2, "0")}`;

    if (dbDate !== registrationDate || dbTime !== registrationTime) {
      return Response.json(
        { success: false, message: "Tanggal atau waktu registrasi tidak sesuai.", registrationDate, registrationTime, dbDate, dbTime, createdAt },
        { status: 400 }
      );
    }

    return Response.json({ success: true, message: "Verifikasi berhasil." });

  } catch (err: any) {
    console.error("VERIFY REGISTRATION TIME ERROR:", err);

    return Response.json(
      { message: "Server error.", error: err?.message || err, },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: Props) {
  try {
    const { username } = await params;
    const { password } = await req.json();

    if (!username || !password) {
      return Response.json(
        { message: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    // if (password.length < 6) {
    //   return Response.json(
    //     { message: "Password minimal 6 karakter." },
    //     { status: 400 }
    //   );
    // }

    const [rows] = await db.query(`
      SELECT id FROM users
      WHERE username = ? AND role = 'member'
      LIMIT 1
      `, [username]
    );

    const users = rows as { id: number }[];

    if (users.length === 0) {
      return Response.json(
        { message: "Username tidak ditemukan." },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(`
      UPDATE users
      SET password = ?, updated_at = ?
      WHERE id = ?
      `, [hashedPassword, storeTime(), users[0].id]
    );

    return Response.json({ success: true, message: "Password berhasil diperbarui.", });

  } catch (err: any) {
    console.error("UPDATE PASSWORD ERROR:", err);

    return Response.json(
      { message: "Server error.", error: err?.message || err, },
      { status: 500 }
    );
  }
}