import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import LoginComponent from "@/components/ClientLogin";

export default async function LoginPage() {
  const session = await getSession();

  if(session) {
    if (session.role === "admin") {
      redirect("/admin");
    } else if (session.role === "member") {
      redirect("/member?"+session.id)
    }
  }

  return (
    <LoginComponent />
  );
}