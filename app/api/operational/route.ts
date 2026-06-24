// app/api/operational/route.ts

import { NextResponse } from "next/server";
import { getOperationalStatus } from "@/lib/operationalStatus";

export async function GET() {
  const status = await getOperationalStatus();

  return NextResponse.json(status);
}