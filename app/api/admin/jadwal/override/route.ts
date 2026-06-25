import { db } from "@/lib/db";
import { getOperationalStatus } from "@/lib/operationalStatus";
import { localTime } from "@/lib/time";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const status = await getOperationalStatus();
    const now = localTime();

    await db.execute(
      `
      INSERT INTO jadwal_manual (
        waktu_mulai,
        waktu_akhir,
        status_operasional,
        pengumuman,
        created_at
      )
      VALUES (
        ?,
        ?,
        ?,
        ?,
        ?
      )
      `,
      [
        now,
        status.waktuAkhir,
        body.status,
        body.pengumuman,
        now
      ]
    );

    return Response.json({
      message: "Success",
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