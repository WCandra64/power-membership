import { db } from "@/lib/db";
import { getOperationalData } from "@/lib/operationalData";
import { storeDate, storeTime } from "@/lib/time";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const status = await getOperationalData();
    const now = storeTime();
    const jadwal = status.jadwal;
    let insert = true;

    if (jadwal && status.sesi !== 0) {
      insert = false;
    }

    const temporaryOverride = jadwal && status.sesi === 0 && new Date(jadwal.waktu_akhir).getTime() === new Date(status.waktuAkhir).getTime();

    if (temporaryOverride) {
      insert = false;
    }

    const operational = body.status ?? jadwal?.status_operasional ?? status.operasional;

    if (body.pengumuman !== undefined && body.pengumuman !== status.pengumuman)
      await db.execute(`
        UPDATE jadwal_manual
        SET pengumuman = ?, updated_at = ?
        WHERE DATE(waktu_mulai) = ?
      `, [body.pengumuman, now, storeDate()]
      );

    const announcement = body.pengumuman ?? status.pengumuman ?? "";
      
    await db.execute(jadwal && !insert ?
      `
      UPDATE jadwal_manual 
      SET
        waktu_mulai = ?,
        waktu_akhir = ?,
        status_operasional = ?,
        pengumuman = ?,
        updated_at = ?
      WHERE id = ${jadwal.id}
      ` : `
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
        storeTime(status.waktuAkhir),
        operational,
        announcement,
        now,
      ]
    );

    return Response.json({
      success: true,
      message: "Operational data updated",
      schedtime: new Date(jadwal.waktu_akhir).getTime(),
      endtime: new Date(status.waktuAkhir).getTime()
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