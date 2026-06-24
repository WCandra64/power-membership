import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function PATCH() {
  const session = await getSession();

  if (!session || session.role !== "member") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const [rows] = await db.execute(
    `
    SELECT id
    FROM visits
    WHERE id_member = ?
    AND NOW() BETWEEN waktu_mulai AND waktu_akhir
    ORDER BY waktu_mulai DESC
    LIMIT 1
    `,
    [session.memberId as number]
  );

  const active = rows as { id: number }[];

  if (active.length === 0) {
    return NextResponse.json(
      { message: "No active visit found." },
      { status: 400 }
    );
  }

  await db.execute(
    `
    UPDATE visits
    SET waktu_akhir = NOW()
    WHERE id = ?
    `,
    [active[0].id]
  );

  return NextResponse.json({
    message: "Check out successful."
  });
}