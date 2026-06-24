import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { getOperationalStatus } from "@/lib/operationalStatus";

export async function POST() {
  try {
    const session = await getSession();

    if (!session || session.role !== "member") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const status = await getOperationalStatus();

    if (!status.operasional) {
      return NextResponse.json(
        { message: "Gym is closed." },
        { status: 400 }
      );
    }

    console.log({
      session,
      status,
    });

    console.log({
      memberId: session?.memberId,
    });

    const [rows] = await db.execute(
      `
      SELECT id
      FROM visits
      WHERE id_member = ?
      AND NOW() BETWEEN waktu_mulai AND waktu_akhir
      LIMIT 1
      `,
      [session.memberId as number]
    );

    const active = rows as { id: number }[];

    if (active.length > 0) {
      return NextResponse.json(
        { message: "Already checked in." },
        { status: 400 }
      );
    }

    const akhir = new Date();

    if (status.sesi === 1) {
      akhir.setHours(11, 0, 0, 0);
    } else if (status.sesi === 2) {
      akhir.setHours(21, 0, 0, 0);
    } else {
      akhir.setDate(akhir.getDate() + 1);
      akhir.setHours(11, 0, 0, 0);
    }

    await db.execute(
      `
      INSERT INTO visits (
        id_member,
        waktu_mulai,
        waktu_akhir
      )
      VALUES (?, NOW(), ?)
      `,
      [session.memberId as number, akhir]
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