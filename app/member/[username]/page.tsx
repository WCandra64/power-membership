import MemberPage from "@/components/ClientMember";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getOperationalData } from "@/lib/operationalData";

type Props = {
  params: Promise<{ username: string }>;
}

export default async function MemberServer({ params }: Props) {
  const { username } = await params;

  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (username !== session.username) {
    redirect("/member/"+session.username);
  }

  console.log("username: "+username);

  return (
    <MemberPage username={username}  />
  );
};