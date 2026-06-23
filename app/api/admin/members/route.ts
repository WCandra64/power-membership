import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
// import { getMembers } from "@/lib/db/queries/adminMembers";

export async function GET(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 30);

    const result = await getMembers(page, limit);

    return NextResponse.json({
      data: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (err: any) {
    console.error("ADMIN MEMBERS ERROR:", err);

    return NextResponse.json(
      {
        message: "Server error",
        error: err?.message || err,
      },
      { status: 500 }
    );
  }
}

export async function getMembers(page = 1, limit = 30) {
  const offset = (page - 1) * limit;

  const [rows] = await db.query(
    `
    SELECT
      m.id,
      m.nama AS name,
      m.no_telp AS phone,
      u.username,

      ms.tgl_mulai AS msStart,
      ms.tgl_kadaluarsa AS msEnd,

      CASE
        WHEN CURDATE() BETWEEN ms.tgl_mulai AND ms.tgl_kadaluarsa
        THEN 'ACTIVE'
        ELSE 'EXPIRED'
      END AS membershipStatus,

      v.waktu_checkin AS lastVisit

    FROM members m
    LEFT JOIN users u ON u.id_member = m.id

    LEFT JOIN (
      SELECT *
      FROM membership
      WHERE (id_member, tgl_kadaluarsa) IN (
        SELECT id_member, MAX(tgl_kadaluarsa)
        FROM membership
        GROUP BY id_member
      )
    ) ms
      ON ms.id_member = m.id

    LEFT JOIN (
      SELECT *
      FROM visits
      WHERE (id_member, waktu_checkin) IN (
        SELECT id_member, MAX(waktu_checkin)
        FROM visits
        GROUP BY id_member
      )
    ) v
      ON v.id_member = m.id

    ORDER BY m.created_at DESC
    LIMIT ? OFFSET ?;
    `,
    [limit, offset]
  );

  const [count] = await db.query(
    `SELECT COUNT(*) as total FROM members`
  );

  return {
    data: rows,
    total: (count as any)[0].total,
  };
}