import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { storeTime } from "@/lib/time";

export async function GET(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);

    const username =
      session.role === "admin"
        ? searchParams.get("username") ?? ""
        : (session.username as string);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const result = await getVisitHistory(username, page, limit);

    return Response.json({
      data: result.data,
      name: result.name,
      pagination: {
        page, limit, total: result.total, latestTotal: result.latestTotal, totalPages: Math.ceil(result.total / limit),
      },
    });

  } catch (err: any) {
    console.error("VISIT HISTORY ERROR:", err);

    return Response.json(
      { message: "Server error", error: err?.message || err, },
      { status: 500 }
    );
  }
}

export async function getVisitHistory(username: string, page = 1, limit = 10) {

  const offset = (page - 1) * limit;

  const [rows] = await db.query(`
    SELECT v.*,
    CASE
      WHEN ? BETWEEN v.waktu_mulai AND v.waktu_akhir
        THEN TRUE
        ELSE FALSE
    END AS isActive 
    FROM visits v
    JOIN users u ON u.id_member = v.id_member
    WHERE u.username = ?
    ORDER BY v.waktu_mulai DESC
    LIMIT ? OFFSET ?;
    `, [ storeTime(), username, limit, offset, ]
  );

  const [totalCount] = await db.query(`
    SELECT COUNT(*) total
    FROM visits v
    JOIN users u ON u.id_member = v.id_member
    WHERE u.username = ?;
    `, [username]
  );

  const [latestCount] = await db.query(`
    SELECT COUNT(*) AS total
    FROM visits v
    JOIN (
      SELECT id_member, tgl_mulai, tgl_kedaluwarsa
      FROM membership
      WHERE id_member = (
        SELECT id_member
        FROM users
        WHERE username = ?
      )
      ORDER BY tgl_kedaluwarsa DESC
      LIMIT 1
    ) ms
    ON DATE(v.waktu_mulai) BETWEEN ms.tgl_mulai AND ms.tgl_kedaluwarsa
    WHERE v.id_member = ms.id_member;
    `, [username]
  );

  const [name] = await db.query(`
    SELECT m.nama
    FROM members m
    JOIN users u ON u.id_member = m.id
    WHERE u.username = ?;
    `, [username]
  );

  return { data: rows, total: (totalCount as any)[0].total, latestTotal: (latestCount as any)[0].total, name: (name as any)[0].nama};
}