import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { storeDate, storeTime } from "@/lib/time";
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
    const limit = Number(searchParams.get("limit") || 20);
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "Member";
    const sort = searchParams.get("sort") || "newest";
    console.log(sort)

    const result = await getMembers(page, limit, search, filter, sort);

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

export async function getMembers(page = 1, limit = 20, search = "", filter = "Member", sort = "newest") {
  const now = storeTime();
  const date = storeDate();
  const offset = (page - 1) * limit;

  let where: string[] = [];
  let params: any[] = [];

  if (search.trim()) {
    where.push(`
      (
        m.nama LIKE ?
        OR u.username LIKE ?
      )
    `);

    const keyword = `%${search}%`;

    params.push(
      keyword,
      keyword,
    );
  }

  switch (filter) {
    case "Aktif":
      where.push(`
        ? BETWEEN ms.tgl_mulai
          AND ms.tgl_kedaluwarsa
      `);

      params.push(date);
      break;

    case "Latihan":
      where.push(`
        ? BETWEEN v.waktu_mulai
          AND v.waktu_akhir
      `);

      params.push(now);
      break;

    case "Nonaktif":
      where.push(`
        ? NOT BETWEEN ms.tgl_mulai
          AND ms.tgl_kedaluwarsa
      `);

      params.push(date);
      break;
  }

  const whereClause =
    where.length > 0
      ? `WHERE ${where.join(" AND ")}`
      : "";

  let orderBy = "ms.tgl_mulai DESC";

  switch (sort) {
    case "oldest":
      orderBy = "ms.tgl_mulai ASC";
      console.log(orderBy);
      break;

    case "name_asc":
      orderBy = "m.nama ASC";
      console.log(orderBy);
      break;

    case "name_desc":
      orderBy = "m.nama DESC";
      console.log(orderBy);
      break;
  }

  console.log(orderBy)
  console.log(sort)

  const join = `
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
  `;

  const [rows] = await db.query(
    `
    SELECT
      m.id,
      m.nama AS name,
      m.no_telp AS phone,
      m.foto_url AS photo,
      u.username,

      ms.tgl_mulai AS msStart,
      ms.tgl_kedaluwarsa AS msEnd,

      CASE
        WHEN ? BETWEEN ms.tgl_mulai AND ms.tgl_kedaluwarsa
        THEN TRUE
        ELSE FALSE
      END AS msStatus,

      v.waktu_mulai AS lastCheckin,
      v.waktu_akhir AS lastCheckout

    FROM members m
    
    ${join}

    ${whereClause}

    ORDER BY ${orderBy}

    LIMIT ? OFFSET ?;
    `,
    [date, ...params, limit, offset]
  );

  const [count] = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM members m
    ${join}

    ${whereClause}
    `,
    params
  );

  return {
    data: rows,
    total: (count as any)[0].total,
  };
}