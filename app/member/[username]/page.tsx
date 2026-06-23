import PrimaryButton from "@/components/PrimaryButton";
import BareButton from "@/components/BareButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/logout";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function MemberPage({ params }: Props) {
  const { username } = await params;

  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "member") {
    redirect("/login");
  }

  const member = {
    username,
    name: "John Doe",
    img: "/user.png",
    isActive: true,
    activeDate: "07/06/2026",
    expiredDate: "06/07/2026",
    checkedIn: true,
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.12))] flex flex-col gap-8 py-4 px-6 justify-end items-center">
      <div className="w-full flex flex-col gap-4 items-center">

        <img src={member.img} alt="" className="object-cover size-64 rounded-full" />

        <div className="flex flex-col items-center">
          <span className="font-black text-xs italic">#{username}</span>
          <h1 className="font-black text-xl">Nama Member</h1>
        </div>

        <div className="w-full flex flex-col gap-2 items-center">
          <div
            className="w-full text-center py-2 bg-green-50
            border-4 border-green-500
            shadow-[0_0_10px_rgb(0,201,80,0.4)] inset-shadow-[0_0_10px_rgb(0,201,80,0.4)]
            text-green-500 text-md font-extrabold font-mulish tracking-[.25em]
            text-shadow-[0_0_10px_rgb(0,201,80,0.4)]"
          >
            {member.isActive ? "AKTIF" : "TIDAK AKTIF"}
          </div>
          <div className="text-xs font-extralight tracking-widest">{member.activeDate} - {member.expiredDate}</div>
        </div>

      </div>

      <div className="flex flex-col gap-4 w-full">
        <PrimaryButton disabled={member.checkedIn}>Check In</PrimaryButton>
        <BareButton onClick={logout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
          Log Out
        </BareButton>
      </div>
    </div>
  );
};