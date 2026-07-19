import MemberPage from "@/components/ClientMember";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getOperationalData } from "@/lib/operationalData";

type Props = {
  params: Promise<{ username: string }>;
}

export default async function MemberServer() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // if (username !== session.username) {
  //   redirect("/member/"+session.username);
  // }

  console.log("username: "+session.username);

  return (
    <MemberPage username={session.username as string}  />
  );
};