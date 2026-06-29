import { db } from "@/lib/db";
import { getOperationalData } from "@/lib/operationalData";
import { getSession } from "@/lib/session";
import { localTime, storeTime } from "@/lib/time";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

    const {
      date,
      sess1,
      sess2,
      announcement
    } = await req.json();

    if (
      !announcement ||
      !date ||
      (!sess1 &&
      !sess2)
    ) {
      return NextResponse.json(
        { message: "Incomplete data" },
        { status: 400 }
      );
    }

    if (new Date(date) < localTime()) {
      return NextResponse.json(
        { message: "Date has passed" },
        { status: 400 }
      );
    }

    let startHour = 7;
    let endHour = 21;

    if (sess1 && !sess2) {
      endHour = 11;
    } else if (sess2 && !sess1) {
      startHour = 15;
    }

    const start = new Date(date);
    start.setHours(startHour, 0, 0, 0);
    const end = new Date(date);
    end.setHours(endHour, 0, 0, 0);

    await db.query(
      `
      INSERT INTO jadwal_manual (
        waktu_mulai,
        waktu_akhir,
        status_operasional,
        pengumuman,
        created_at
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        storeTime(start),
        storeTime(end),
        false,
        announcement,
        storeTime()
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Jadwal berhasil ditambahkan",
    });
  } catch (err: any) {
    console.error("CREATE JADWAL ERROR:", err);

    return NextResponse.json(
      {
        message: "Server error",
        error: err?.message || err,
      },
      { status: 500 }
    );
  }
}

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

    const [rows] = await db.query(
      `
      SELECT * FROM jadwal_manual 
      WHERE waktu_akhir >= ?
      AND status_operasional = FALSE
      AND (
        (
          TIME(waktu_mulai) = '07:00:00'
          AND TIME(waktu_akhir) = '11:00:00'
        )
        OR
        (
          TIME(waktu_mulai) = '15:00:00'
          AND TIME(waktu_akhir) = '21:00:00'
        )
        OR
        (
          TIME(waktu_mulai) = '07:00:00'
          AND TIME(waktu_akhir) = '21:00:00'
        )
      )
      ORDER BY waktu_mulai ASC;
      `,
      [storeTime()]
    );

    return NextResponse.json({
      success: true,
      message: "Jadwal berhasil diambil",
      rows
    });
  } catch (err: any) {
    console.error("FETCH JADWAL ERROR:", err);

    return NextResponse.json(
      {
        message: "Server error",
        error: err?.message || err,
      },
      { status: 500 }
    );
  }
}