import { db } from "@/lib/db";
import { getOperationalData } from "@/lib/operationalData";
import { getSession } from "@/lib/session";
import { storeDate, storeTime } from "@/lib/time";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const status = await getOperationalData();
    const now = storeTime();
    const jadwal = status.jadwal;

    let insert = true;
    const endTime = new Date(status.waktuAkhir.getTime() - 7 * 60 * 60 * 1000);
    
    if (jadwal && (
      status.sesi !== 0 || new Date(jadwal.waktu_akhir).getTime() === endTime.getTime()
    ))
      insert = false;

    const operational = body.status ?? jadwal?.status_operasional ?? status.operasional;
    const announcement = body.pengumuman ?? status.pengumumanHariIni ?? "";

    const updatePengumumanQuery = `
      UPDATE jadwal_manual SET pengumuman = ?, updated_at = ?
      WHERE DATE(waktu_mulai) = ? `;
    const updateStatusQuery = `
      UPDATE jadwal_manual SET
        waktu_mulai = ?, waktu_akhir = ?, status_operasional = ?, pengumuman = ?, updated_at = ?
      WHERE id_jadwal = ${jadwal?.id_jadwal} `;
    const insertJadwalQuery = `
      INSERT INTO jadwal_manual (waktu_mulai, waktu_akhir, status_operasional, pengumuman, created_at)
      VALUES (?, ?, ?, ?, ?) `;

    if (body.pengumuman !== undefined && status.pengumumanHariIni !== "" && body.pengumuman !== status.pengumumanHariIni)
      await db.execute(
        updatePengumumanQuery, [body.pengumuman, now, storeDate()]
      );
    else
      await db.execute(
        jadwal && !insert ? updateStatusQuery : insertJadwalQuery,
        [now, storeTime(status.waktuAkhir), operational, announcement, now,]
      );

    if(body.status === false)
      await db.execute(`
        UPDATE visits
        SET waktu_akhir = ?, updated_at = ?
        WHERE ? BETWEEN waktu_mulai AND waktu_akhir
        `, [now, now, now]
      );

    return Response.json({ success: true, message: "Operational data updated", });
  } catch (err: any) {
    console.error("OVERRIDE ERROR:", err);
    return Response.json(
      { message: "Server error", error: err?.message || err, },
      { status: 500, }
    );
  }
}