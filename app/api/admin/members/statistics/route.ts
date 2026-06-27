import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { localTime } from "@/lib/time";
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

    const result = await getStats();

    return NextResponse.json({
      data: result.data,
    });
  } catch (err: any) {
    console.error("ADMIN MEMBERS STATISTICS ERROR:", err);

    return NextResponse.json(
      {
        message: "Server error",
        error: err?.message || err,
      },
      { status: 500 }
    );
  }
}

export async function getStats() {
  const now = localTime();

  const [result] = await db.query(
    `
    SELECT
      COUNT(*) AS total,

      SUM(
        CASE
          WHEN ?
          BETWEEN ms.tgl_mulai
          AND ms.tgl_kedaluwarsa
          THEN 1
          ELSE 0
        END
      ) AS active,

      SUM(
        CASE
          WHEN ?
          NOT BETWEEN ms.tgl_mulai
          AND ms.tgl_kedaluwarsa
          THEN 1
          ELSE 0
        END
      ) AS inactive,

      SUM(
        CASE
          WHEN ?
          BETWEEN v.waktu_mulai
          AND v.waktu_akhir
          THEN 1
          ELSE 0
        END
      ) AS training

    FROM members m

    LEFT JOIN (
      SELECT *
      FROM membership
      WHERE (id_member, tgl_kedaluwarsa) IN (
        SELECT id_member, MAX(tgl_kedaluwarsa)
        FROM membership
        GROUP BY id_member
      )
    ) ms
    ON ms.id_member = m.id

    LEFT JOIN (
      SELECT *
      FROM visits
      WHERE (id_member, waktu_mulai) IN (
        SELECT id_member, MAX(waktu_mulai)
        FROM visits
        GROUP BY id_member
      )
    ) v
    ON v.id_member = m.id
    `,
    [now, now, now]
  );

  return {
    data: result,
  };
}