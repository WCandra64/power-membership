"use client";

import PrimaryButton from "@/components/PrimaryButton";
import BareButton from "@/components/BareButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSignOutAlt, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { localTime } from "@/lib/time";


// type Props = {
//   params: Promise<{ username: string }>;
// };

export default function MemberAdmin(
  // { params }: Props
) {
  // const { username } = await params;

  const defMember = {
    username: "abc123",
    name: "John Doe",
    img: "/user.png",
    phone: "62838340442393",
    isActive: false,
    activeDate: new Date("2026-05-19"),
    expiredDate: new Date("2026-06-18"),
    checkedIn: true,
  }

  const [member, setMember] = useState(defMember);

  const now = localTime();

  // FORMAT PHONE
  const phone = `+62 ${member.phone.slice(2, 5)}-${member.phone.slice(6, 10)}-${member.phone.slice(10)}`;

  // DETERMINE MEMBERSHIP
  const today = now.setHours(0,0,0,0)
  const activeMembership = today >= member.activeDate.setHours(0,0,0,0) && today <= member.expiredDate.setHours(0,0,0,0);

  const [zoomImg, setZoomImg] = useState(false);
  const [edit, setEdit] = useState(false);
  const [remove, setRemove] = useState(false);

  function updateMembership(date: Date) {
    const result = date;

    setStartMembership(date.toISOString().split("T")[0]);

    const daysOfMonth = new Date(
      result.getFullYear(),
      result.getMonth() + 1,
      0
    ).getDate();

    result.setDate(result.getDate() + daysOfMonth - 1);

    setEndMembership(result.toISOString().split("T")[0]);
  }

  const [membershipUpdate, setMembershipUpdate] = useState(false);
  const [startMembership, setStartMembership] = useState("");
  const [endMembership, setEndMembership] = useState("");
  
  useEffect(() => {
    updateMembership(now);
    console.log(member.expiredDate)
  }, [])

  function formatDate(date: Date) {
    // const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  // useEffect(() => {
  //   console.log(startMembership, new Date(endMembership))
  // }, [startMembership])

  return (
    <main className="h-[calc(100dvh-theme(spacing.12))] relative flex flex-col gap-8 py-4 px-6 justify-end items-center bg-foreground">
      {!edit ?
      <>
        <div className="w-full flex flex-col gap-2 items-center">

          <img src={member.img} alt="" onClick={() => setZoomImg(true)} className="object-cover size-64 rounded-full" />

          <div className="flex flex-col items-center">
            <span className="font-black text-xs italic">#{member.username}</span>
            <h1 className="font-black text-xl">{member.name}</h1>
            <span className="text-xs pt-1">{phone}</span>
          </div>

          <div className="w-full flex flex-col gap-2 items-center">
            <span className="w-full text-xs text-start pt-1">Latihan terakhir 2 hari</span>

            <div
              className={`w-full text-center py-2 border-2
                ${activeMembership ? 
                "bg-green-100 border-green-500 shadow-[0_0_10px_rgb(0,201,80,0.4)] inset-shadow-[0_0_10px_rgb(0,201,80,0.4)] text-green-500 text-shadow-[0_0_10px_rgb(0,201,80,0.4)]"
                : "bg-paragraph/10 border-paragraph/40 text-paragraph/40"
                }
                text-md font-black font-mulish tracking-[.25em]
              `}
            >
              {activeMembership ? "AKTIF" : "TIDAK AKTIF"}
            </div>
            <div className="text-xs font-extralight tracking-widest">{formatDate(member.activeDate)} - {formatDate(member.expiredDate)}</div>
          </div>

        </div>

        <div className="flex flex-col gap-4 w-full">
          <PrimaryButton disabled={activeMembership} onClick={() => setMembershipUpdate(true)}>Perpanjang Membership</PrimaryButton>

          <div className="flex gap-2">
            <BareButton onClick={() => setRemove(true)}>
              <FontAwesomeIcon icon={faTrash} className="w-4" />
              Hapus
            </BareButton>
            <BareButton onClick={() => setEdit(true)}>
              <FontAwesomeIcon icon={faEdit} className="w-4" />
              Edit
            </BareButton>
          </div>

        </div>

        {/* IMAGE ZOOM */}
        <div className={`fixed inset-0 flex items-center justify-center z-50 w-full h-full ${!zoomImg && "hidden"}`}>
          <div onClick={() => setZoomImg(false)} className="absolute inset-0 bg-stroke/80" />
          <div className="absolute">
            <FontAwesomeIcon icon={faX} onClick={() => setZoomImg(false)} className="text-prime right-0 absolute -top-6 cursor-pointer" />
            <img src={member.img} alt="" className="w-96 h-96 object-cover" />
          </div>
          {/* <img src={member.img} alt="" className="absolute w-96 h-96 object-cover" /> */}
        </div>

        {/* DELETE CONFIRMATION */}
        <div className={`fixed inset-0 flex items-center justify-center z-50 w-full h-full ${!remove && "hidden"}`}>

          <div onClick={() => setRemove(false)} className="absolute inset-0 bg-stroke/80" />

          <div className="absolute w-full max-w-md p-6">
            <div className="flex flex-col gap-4 bg-background p-6 rounded-sm">
              <h3 className="text-lg font-black font-mulish text-center">Hapus Member</h3>

              <hr className="border-stroke" />

              <span className="text-sm">Hapus secara permanen member <span className="font-extrabold font-mulish">{member.name}</span>? <span className="text-prime">{member.isActive && "Member masih berstatus aktif."}</span> <br /> <br /> * Data member terhapus tidak dapat dipulihkan kembali.</span>

              <div className="flex gap-2 pt-6">
                <BareButton onClick={() => setRemove(false)}>Batal</BareButton>
                <PrimaryButton>Hapus</PrimaryButton>
              </div>
            </div>
          </div>
          
        </div>

        {/* SET MEMBERSHIP */}
        <div className={`fixed inset-0 flex items-center justify-center z-50 w-full h-full ${!membershipUpdate && "hidden"}`}>

          <div onClick={() => setMembershipUpdate(false)} className="absolute inset-0 bg-stroke/80" />

          <div className="absolute w-full max-w-md p-6">
            <div className="flex flex-col gap-4 bg-background p-6 rounded-sm">
              <h3 className="text-lg font-black font-mulish text-center">Perpanjang Membership</h3>

              <hr className="border-stroke" />

              <span className="text-sm">Masa aktif membership:</span>
              <div className="flex flex-col">
                <label className="text-xs">Tanggal Mulai</label>
                <input
                  type="date"
                  name="startMembershipship"
                  value={startMembership}
                  onChange={(e) => updateMembership(!isNaN(new Date(e.target.value).getTime()) ? new Date(e.target.value) : now)}
                  className="rounded-lg border px-3 py-2"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs">Tanggal Akhir</label>
                <input
                  type="date"
                  name="endMembership"
                  value={endMembership}
                  onChange={(e) => {
                    setEndMembership(e.target.value);
                  }}
                  className="rounded-lg border px-3 py-2"
                />
              </div>
              
              <div className="flex gap-2 pt-6">
                <BareButton onClick={() => {setMembershipUpdate(false); updateMembership(now);}}>Batal</BareButton>
                <PrimaryButton>Perpanjang</PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </>
      : <>
      {/* EDIT */}
        <div className="w-full flex flex-col gap-6 items-center">

          <div className="relative size-64 rounded-full cursor-pointer">
            <div className="absolute bg-stroke/60 w-full h-full rounded-full" />
            <div className="flex items-center justify-center w-full h-full absolute">
              <FontAwesomeIcon icon={faEdit} size="2xl" className="absolute text-background" />
            </div>
            <img src={member.img} alt="" className="object-cover size-64 rounded-full" />
          </div>
          

          <div className="w-full flex flex-col gap-2 items-center">
            <input type="text" name="name" placeholder="Nama Member" value={member.name} onChange={(e) => setMember({...member, name: e.target.value})} className={`
              w-full px-4 py-2
              border-1 border-stroke/40 outline-stroke rounded-sm
              text-center font-mulish font-bold text-xl bg-background
              ${member.name? "bg-background outline-2" : "bg-paragraph/10"}
              focus:outline-2
            `} />

            <input type="tel" name="phone" placeholder="No. HP Member" value={member.phone} onChange={(e) => setMember({...member, phone: e.target.value})} className={`
              w-full px-4 py-2
              border-1 border-stroke/40 outline-stroke rounded-sm
              text-center text-md font-chivo bg-background
              ${member.phone? "bg-background outline-2" : "bg-paragraph/10"}
              focus:outline-2
            `} />
          </div>

        </div>

        <div className="flex flex-col gap-4 w-full">
          <PrimaryButton>Simpan</PrimaryButton>

          <BareButton onClick={() => {setEdit(false); setMember(defMember);}}>
            <FontAwesomeIcon icon={faX} className="w-4" />
            Batal
          </BareButton>

        </div>
      </>
      }
      
    </main>
  );
};