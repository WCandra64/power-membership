import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { localTime, storeTime } from "@/lib/time";

export async function PATCH(req: Request,{ params }: { params: Promise<{ id: string }>}
) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "admin") {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

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
      return Response.json(
        { message: "Incomplete data" },
        { status: 400 }
      );
    }

    if (new Date(date) < localTime()) {
      return Response.json(
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

    const [rows] = await db.query(
      `
      UPDATE jadwal_manual 
      SET 
        waktu_mulai = ?,
        waktu_akhir = ?,
        status_operasional = ?,
        pengumuman = ?,
        updated_at = ?
      WHERE id = ?
      `,
      [
        storeTime(start),
        storeTime(end),
        false,
        announcement,
        storeTime(),
        id
      ]
    );

    if ((rows as any).affectedRows === 0) {
      return Response.json(
        { message: "Schedule not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Schedule updated",
    });
  } catch (err: any) {
    console.error("UPDATE SCHEDULE ERROR:", err);

    return Response.json(
      {
        message: "Server error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }>}
) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "admin") {
      return Response.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const [result] = await db.query(
      `
      DELETE FROM jadwal_manual
      WHERE id = ?
      `,
      [id]
    );

    if ((result as any).affectedRows === 0) {
      return Response.json(
        { message: "Schedule not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Schedule deleted",
    });
  } catch (err: any) {
    console.error("DELETE SCHEDULE ERROR:", err);

    return Response.json(
      {
        message: "Server error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}