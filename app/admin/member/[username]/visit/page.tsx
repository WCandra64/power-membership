import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import VisitHistory from "@/components/ClientVisit";

type Props = {
  params: Promise<{ username: string }>;
}

export default async function AdminVisitHistoryServer({ params }: Props) {
  const { username } = await params;

  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  return (
    <VisitHistory username={username}  />
  );
};