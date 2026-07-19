"use client";

import PrimaryButton from "@/components/PrimaryButton";
import BareButton from "@/components/BareButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCertificate, faSignOutAlt, faStreetView } from "@fortawesome/free-solid-svg-icons";
import { logout } from "@/app/actions/logout";
import { useEffect, useRef, useState } from "react";
import { localTime } from "@/lib/time";
import Link from "next/link";

export default function MemberPage({ username }: { username: string }) {

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>({});

  const now = Date.now();
  const isTraining = 
    member.lastCheckin &&
    member.lastCheckout &&
    now >= new Date(member.lastCheckin).getTime() &&
    now <= new Date(member.lastCheckout).getTime();

  const [opData, setOpData] = useState<any>({}); 
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // const loading = opLoading || memberLoading || checkinLoading;

  function toast(message: string) {
    setToastMessage(message);
    setShowToast(true);

    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }

  async function handleCheckin() {
    setCheckinLoading(true);

    // Save what action we're performing BEFORE it changes
    const action = isTraining ? "checkout" : "checkin";

    const res = await (
      action === "checkout"
        ? fetch("/api/checkout", {
            method: "PATCH",
            credentials: "include",
          })
        : fetch("/api/checkin", {
            method: "POST",
            credentials: "include",
          })
    );

    await res.json();

    if (res.ok) {
      await fetchData();

      toast(action === "checkin"
        ? "Sesi latihan berhasil dimulai."
        : "Sesi latihan berhasil diakhiri."
      );
    }

    setCheckinLoading(false);
  }

  async function fetchData() {
    try {
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
      setOpData(opJson);
    } finally {
      setLoading(false);
    }
  }

  // LOAD MEMBERS
  useEffect(() => {
    fetchData();
  }, []);

  // LOAD MEMBERS
  // useEffect(() => {
  //   setTraining();
  // }, [member]);

  return (
    <div className="h-[calc(100dvh-theme(spacing.12))] flex flex-col gap-8 py-4 px-6 justify-end items-center">
      { loading ?
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
          
          {/* <div className="flex flex-col gap-2 items-center w-full">
            <span className="text-xs font-extralight tracking-widest">RIWAYAT</span>
            <div className="flex gap-2 w-full">
              <Link href={`/member/${member.username}/membership`} className="w-full">
                <BareButton>
                  <FontAwesomeIcon icon={faCertificate} className="w-4" />
                  Membership
                </BareButton>
              </Link>
              
              <Link href={`/member/${member.username}/visit`} className="w-full">
                <BareButton>
                  <FontAwesomeIcon icon={faStreetView} className="w-4" />
                  Visit
                </BareButton>
              </Link>
            </div>
          </div> */}

          <div className="flex flex-col gap-4 w-full">
            <PrimaryButton onClick={handleCheckin} disabled={!opData.operasional || !member.msStatus || checkinLoading}>{checkinLoading ? "Loading..." : isTraining ? "Check Out" : "Check In"}</PrimaryButton>
            <BareButton onClick={() => {setLoading(true); logout();}}>
              <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
              Log Out
            </BareButton>
          </div>
        </>
      }
      { showToast && (
        <div className={`fixed top-16 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-4 rounded-md shadow-xl text-background text-center z-50`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};