import { getOperationalData } from "@/lib/operationalData";

export async function GET() {
  const status = await getOperationalData();

  return Response.json(status);
}