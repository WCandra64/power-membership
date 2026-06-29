import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { getOperationalData } from "@/lib/operationalData";
import { storeTime } from "@/lib/time";

export async function POST() {
  try {
    const session = await getSession();

    if (!session || session.role !== "member") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const status = await getOperationalData();

    if (!status.operasional) {
      return NextResponse.json(
        { message: "Gym is closed." },
        { status: 400 }
      );
    }

    const now = storeTime();

    const [rows] = await db.execute(
      `
      SELECT id
      FROM visits
      WHERE id_member = ?
      AND ? BETWEEN waktu_mulai AND waktu_akhir
      LIMIT 1
      `,
      [session.memberId as number, now]
    );

    const active = rows as { id: number }[];

    if (active.length > 0) {
      return NextResponse.json(
        { message: "Already checked in." },
        { status: 400 }
      );
    }

    await db.execute(
      `
      INSERT INTO visits (
        id_member,
        waktu_mulai,
        waktu_akhir,
        created_at
      )
      VALUES (?, ?, ?, ?)
      `,
      [session.memberId as number, now, storeTime(status.waktuAkhir), now]
    );

    return NextResponse.json({
      message: "Check in successful."
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}