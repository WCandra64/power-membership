import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { storeTime } from "@/lib/time";

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

    if (session.role !== "admin") {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const [data]: any = await db.query(
      `
      SELECT
        m.*,
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

    if (!data.length) {
      return Response.json(
        { message: "Member tidak ditemukan." },
        { status: 404 }
      );
    }

    return Response.json({
      data,
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

// EXTEND MEMBERSHIP
export async function POST(req: Request, { params }: Props) {
  const { username } = await params;

  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "admin") {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const member: any = await getMember(username);

    if (!member.length) {
      return Response.json(
        { message: "Member tidak ditemukan." },
        { status: 404 }
      );
    }

    const memberId = member[0].id;

    const {
      startMembership,
      endMembership,
    } = await req.json();

    await db.getConnection();

    if (isNaN(memberId)) {
      return Response.json(
        { message: "ID member tidak valid." },
        { status: 400 }
      );
    }

    if (!startMembership || !endMembership) {
      return Response.json(
        { message: "Tanggal wajib diisi." },
        { status: 400 }
      );
    }

    // 3. CREATE MEMBERSHIP
    await db.query(
      `INSERT INTO membership (id_member, tgl_mulai, tgl_kedaluwarsa, created_at)
      VALUES (?, ?, ?, ?)`,
      [memberId, startMembership, endMembership, storeTime()]
    );

    return Response.json({
      success: true,
      message: "Membership Extended",
      memberId,
      username,
      startMembership,
      endMembership,
    });

  } catch (err: any) {
    console.error("MEMBERSHIP EXTENSION ERROR:", err);

    return Response.json(
      {
        message: "Server error",
        error: err?.message || err,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: Props) {
  const { username } = await params;

  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "admin") {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const member: any = await getMember(username);

    if (!member.length) {
      return Response.json(
        { message: "Member tidak ditemukan." },
        { status: 404 }
      );
    }

    const memberId = member[0].id;

    const body = await req.json();

    const {
      name,
      phone,
      photoUrl,
      photoId,
    } = body;

    if (!name?.trim()) {
      return Response.json(
        { message: "Nama wajib diisi." },
        { status: 400 }
      );
    }

    await db.query(
      `
      UPDATE members
      SET
        nama = ?,
        no_telp = ?,
        foto_url = ?,
        foto_id = ?,
        updated_at = ?
      WHERE id = ?
      `,
      [
        name.trim(),
        phone || null,
        photoUrl,
        photoId,
        storeTime(),
        memberId,
      ]
    );
    return Response.json({
      success: true,
      message: "Member Data Updated",
      memberId,
      name,
      phone,
      photoUrl,
      photoId,
    });
  } catch (err: any) {
    console.error("EDIT MEMBER ERROR:", err);

    return Response.json(
      {
        message: "Server error",
        error: err?.message || err,
      },
      { status: 500 }
    );
  }
}

// DELETE MEMBER
export async function DELETE(req: Request, { params }: Props) {
  const { username } = await params;

  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "admin") {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const member: any = await getMember(username);

    if (!member.length) {
      return Response.json(
        { message: "Member tidak ditemukan." },
        { status: 404 }
      );
    }

    await db.query(
      `
      DELETE FROM members
      WHERE id = ?
      `,
      [member[0].id]
    );

    return Response.json({
      success: true,
      message: "Member Deleted",
      memberId: member[0].id,
      photoId: member[0].foto_id
    });
  } catch (err: any) {
    console.error("DELETE MEMBER ERROR:", err);

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
        m.id,
        m.foto_id
      FROM users u
      JOIN members m
        ON m.id = u.id_member
      WHERE u.username = ?
      LIMIT 1
    `,
    [username]
  );

  return rows;
}