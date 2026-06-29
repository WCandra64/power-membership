import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { storeTime } from "@/lib/time";

export async function PATCH() {
  const session = await getSession();

  if (!session || session.role !== "member") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const now = storeTime();

  const [rows] = await db.execute(
    `
    SELECT id
    FROM visits
    WHERE id_member = ?
    AND ? BETWEEN waktu_mulai AND waktu_akhir
    ORDER BY waktu_mulai DESC
    LIMIT 1
    `,
    [session.memberId as number, now]
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
    SET waktu_akhir = ?, updated_at = ?
    WHERE id = ?
    `,
    [now, now, active[0].id]
  );

  return NextResponse.json({
    message: "Check out successful."
  });
}