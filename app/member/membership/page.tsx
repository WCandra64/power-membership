import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import MembershipHistory from "@/components/ClientMembership";

type Props = {
  params: Promise<{ username: string }>;
}

export default async function MembershipHistoryServer() {
  const session = await getSession();

  if (!session || session.role === "admin") {
    redirect("/login");
  }

  return (
    <MembershipHistory username={session.username as string}  />
  );
};