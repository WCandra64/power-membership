import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

type Props = {
  params: Promise<{ username: string }>;
}

export async function GET(req: Request, { params }: Props) {
  const { username } = await params;

  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.username !== username) {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const result = await getMember(username);

    return Response.json({
      data: result.data,
    });
  } catch (err: any) {
    console.error("GET MEMBER ERROR:", err);

    return Response.json(
      {
        message: "Server error",
        error: err?.message || err,
      },
      { status: 500 }
    );
  }
}

export async function getMember(username: string) {
  const [rows] = await db.query(
    `
    SELECT
      m.nama AS name,
      m.no_telp AS phone,
      m.foto_url AS photo,
      u.username,

      ms.tgl_mulai AS msStart,
      ms.tgl_kedaluwarsa AS msEnd,

      CASE
        WHEN CURDATE() BETWEEN ms.tgl_mulai AND ms.tgl_kedaluwarsa
        THEN TRUE
        ELSE FALSE
      END AS msStatus,

      v.waktu_mulai AS lastCheckin,
      v.waktu_akhir AS lastCheckout

    FROM members m
    LEFT JOIN users u ON u.id_member = m.id

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

    WHERE u.username = ?
    LIMIT 1
    `,
    [username]
  );

  return {
    data: rows,
  };
}