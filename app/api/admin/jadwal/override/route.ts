import { db } from "@/lib/db";
import { getOperationalStatus } from "@/lib/operationalStatus";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const status = await getOperationalStatus();

    let akhir = new Date();

    if (akhir.getHours() < 11) 
      akhir.setHours(11, 0, 0, 0);
    else if (akhir.getHours() < 21) 
      akhir.setHours(21, 0, 0, 0);
    else {
      akhir.setDate(akhir.getDate() + 1);
      akhir.setHours(11, 0, 0, 0);
    }

    await db.execute(
      `
      INSERT INTO jadwal_manual (
        waktu_mulai,
        waktu_akhir,
        status_operasional,
        pengumuman
      )
      VALUES (
        NOW(),
        ?,
        ?,
        ?
      )
      `,
      [
        akhir,
        body.status,
        body.pengumuman
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