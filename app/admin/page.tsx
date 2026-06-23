import AdminComponent from "@/components/ClientAdmin";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";


export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "admin") {
    redirect("/login");
  }
  
  return (
    <AdminComponent />
  );
}