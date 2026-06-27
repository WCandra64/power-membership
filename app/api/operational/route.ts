// app/api/operational/route.ts

import { NextResponse } from "next/server";
import { getOperationalData } from "@/lib/operationalData";

export async function GET() {
  const status = await getOperationalData();

  return NextResponse.json(status);
}