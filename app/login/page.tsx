import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import LoginPage from "@/components/ClientLogin";

export default async function LoginServer() {
  const session = await getSession();

  if(session) {
    if (session.role === "admin") {
      redirect("/admin");
    } else if (session.role === "member") {
      redirect("/member/"+session.username)
    }
  }

  return (
    <LoginPage />
  );
}