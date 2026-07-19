import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import VisitHistory from "@/components/ClientVisit";

type Props = {
  params: Promise<{ username: string }>;
}

export default async function VisitHistoryServer() {
  const session = await getSession();

  if (!session || session.role === "admin") {
    redirect("/login");
  }

  return (
    <VisitHistory username={session.username as string}  />
  );
};