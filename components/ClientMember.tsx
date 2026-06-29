"use client";

import PrimaryButton from "@/components/PrimaryButton";
import BareButton from "@/components/BareButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { logout } from "@/app/actions/logout";
import { useEffect, useState } from "react";
import { localTime } from "@/lib/time";

export default function MemberPage({ username }: { username: string }) {

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>({});

  const [isTraining, setIsTraining] = useState(false);

  const [opStatus, setOpStatus] = useState<any>({}); 
  const [checkinLoading, setCheckinLoading] = useState(false);

  async function handleCheckin() {
    try {
      setCheckinLoading(true);

      const res = isTraining ? await fetch("/api/checkout", {
        method: "PATCH",
        credentials: "include",
      }) : await fetch("/api/checkin", {
        method: "POST",
        credentials: "include",
      })

      await res.json();

      if (res.ok) {
        window.location.reload();
      }
    } finally {
      setLoading(true);
      setCheckinLoading(false);
    }
  }

  // LOAD MEMBERS
  useEffect(() => {
    async function fetchData() {
      const [memberRes, opRes] = await Promise.all([
        fetch(`/api/member/${username}`, {
          credentials: "include",
        }),
        fetch("/api/operational"),
      ]);

      const memberJson = await memberRes.json();
      const opJson = await opRes.json();
      console.log(opJson);

      setMember(memberJson.data[0]);
      setOpStatus(opJson);

      setLoading(false);
    }

    fetchData();
  }, []);

  // LOAD MEMBERS
  useEffect(() => {
    if (!loading) {
      const now = Date.now();
      setIsTraining(
        member.lastCheckin &&
        member.lastCheckout &&
        now >= new Date(member.lastCheckin).getTime() &&
        now <= new Date(member.lastCheckout).getTime()
      );
    }
  }, [member]);

  return (
    <div className="h-[calc(100dvh-theme(spacing.12))] flex flex-col gap-8 py-4 px-6 justify-end items-center">
      {loading?
        <>
          <div className="w-full flex flex-col gap-4 items-center animate-pulse">

            <div className="bg-slate-400 size-64 rounded-full" />

            <div className="flex flex-col items-center gap-1">
              <div className="bg-slate-400 w-36 h-3 rounded-sm" />
              <div className="bg-slate-400 w-46 h-5 rounded-sm" />
            </div>

            <div className="w-full flex flex-col gap-2 items-center pb-1">
              <div className="bg-slate-400 w-full h-12 rounded-sm" />
              <div className="bg-slate-400 w-46 h-3 rounded-sm" />
            </div>

          </div>

          <div className="flex flex-col items-center gap-4 w-full pb-2 animate-pulse">
            <div className="bg-slate-400 w-full h-12 rounded-sm" />
            <div className="bg-slate-400 w-28 h-3 rounded-sm" />
          </div>
        </>
        :
        <>
          <div className="w-full flex flex-col gap-4 items-center">

            <img src={member.photo} className="object-cover size-64 rounded-full" />

            <div className="flex flex-col items-center">
              <span className="font-black text-xs italic">#{member.username}</span>
              <h1 className="font-black text-xl">{member.name}</h1>
            </div>

            <div className="w-full flex flex-col gap-2 items-center">
              <div
                className={`w-full text-center py-2 border-2
                  ${member.msStatus ? 
                  "bg-green-100 border-green-500 shadow-[0_0_10px_rgb(0,201,80,0.4)] inset-shadow-[0_0_10px_rgb(0,201,80,0.4)] text-green-500 text-shadow-[0_0_10px_rgb(0,201,80,0.4)]"
                  : "bg-paragraph/10 border-paragraph/40 text-paragraph/40"
                  }
                  text-md font-black font-mulish tracking-[.25em]
                `}
              >
                {member.msStatus ? "AKTIF" : "TIDAK AKTIF"}
              </div>
              <div className="text-xs font-extralight tracking-widest">
                {new Date(member.msStart).toLocaleDateString('id-ID')} - {new Date(member.msEnd).toLocaleDateString('id-ID')}
              </div>
            </div>

          </div>

          <div className="flex flex-col gap-4 w-full">
            <PrimaryButton onClick={handleCheckin} disabled={!opStatus.operasional || checkinLoading}>{checkinLoading? "Loading..." : isTraining ? "Check Out" : "Check In"}</PrimaryButton>
            <BareButton onClick={() => {setLoading(true); logout();}}>
              <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
              Log Out
            </BareButton>
          </div>
        </>
      }
    </div>
  );
};