import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

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

    const result = await getMembershipHistory(username, page, limit);

    return Response.json({
      data: result.data,
      name: result.name,
      pagination: {
        page, limit, total: result.total, totalPages: Math.ceil(result.total / limit),
      },
    });

  } catch (err: any) {
    console.error("MEMBERSHIP HISTORY ERROR:", err);

    return Response.json(
      {
        message: "Server error",
        error: err?.message || err,
      },
      { status: 500 }
    );
  }
}

export async function getMembershipHistory(username: string, page = 1, limit = 10) {

  const offset = (page - 1) * limit;

  const [rows] = await db.query(`
    SELECT ms.* 
    FROM membership ms
    JOIN users u ON u.id_member = ms.id_member
    WHERE u.username = ?
    ORDER BY ms.tgl_mulai DESC
    LIMIT ? OFFSET ?;
    `, [ username, limit, offset, ]
  );

  const [count] = await db.query(`
    SELECT COUNT(*) total
    FROM membership ms
    JOIN users u ON u.id_member = ms.id_member
    WHERE u.username = ?;
    `, [username]
  );

  const [name] = await db.query(`
    SELECT m.nama
    FROM members m
    JOIN users u ON u.id_member = m.id_member
    WHERE u.username = ?;
    `, [username]
  );

  return { data: rows, total: (count as any)[0].total, name: (name as any)[0].nama};

}