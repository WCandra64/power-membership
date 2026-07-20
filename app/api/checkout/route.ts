import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { storeTime } from "@/lib/time";

export async function PATCH() {
  try {
    const session = await getSession();
    if (!session || session.role !== "member") {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = storeTime();
    const [rows] = await db.execute(`
      SELECT id_visit FROM visits
      WHERE id_member = ? AND ? BETWEEN waktu_mulai AND waktu_akhir
      ORDER BY waktu_mulai DESC LIMIT 1
      `, [session.memberId as number, now]
    );
    const active = rows as { id: number }[];
    if (active.length === 0) {
      return Response.json(
        { message: "No active visit found." },
        { status: 400 }
      );
    }

    await db.execute(`
      UPDATE visits SET waktu_akhir = ?, updated_at = ?
      WHERE id_visit = ?
      `, [now, now, active[0].id]
    );
    
    return Response.json({ success: true, message: "Check out successful." });
  } catch (err: any) {
    console.error("CHECK OUT ERROR:", err);
    return Response.json(
      { message: "Server error", error: err?.message || err,  },
      { status: 500, }
    );
  }
}