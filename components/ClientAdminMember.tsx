"use client";

import PrimaryButton from "@/components/PrimaryButton";
import BareButton from "@/components/BareButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSignOutAlt, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { storeTime } from "@/lib/time";
import timePassed from "@/lib/timePassed";
import { destroyImage, uploadImage } from "@/lib/imageOperations";
import { redirect, useRouter } from "next/navigation";

export default function AdminMemberPage({ username }: { username: string }) {

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>({});

  const now = storeTime();
  const router = useRouter();

  // DETERMINE MEMBERSHIP
  // const today = now.setHours(0,0,0,0)
  // const activeMembership = today >= member.activeDate.setHours(0,0,0,0) && today <= member.expiredDate.setHours(0,0,0,0);

  const [zoomImg, setZoomImg] = useState(false);
  const [edit, setEdit] = useState(false);
  const [remove, setRemove] = useState(false);

  const [membershipExtend, setMembershipExtend] = useState(false);
  const [startMembership, setStartMembership] = useState("");
  const [endMembership, setEndMembership] = useState("");

  const [membershipLoading, setMembershipLoading] = useState(false);

  const [formEdit, setFormEdit] = useState<{name: string, phone: string, photoFile: File | null}>({
    name: "",
    phone: "",
    photoFile: null
  });

  function initMembership(date: Date) {
    const result = new Date(date);

    setStartMembership(date.toISOString().split("T")[0]);

    const daysOfMonth = new Date(
      result.getFullYear(),
      result.getMonth() + 1,
      0
    ).getDate();

    result.setDate(result.getDate() + daysOfMonth - 1);

    setEndMembership(result.toISOString().split("T")[0]);
  }

  async function extendMembership() {
    setMembershipExtend(false);
    setLoading(true);

    const res = await fetch(`/api/admin/member/${username}`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        startMembership,
        endMembership,
      }),
    });

    if (res.ok) fetchData();
    else setLoading(false);
  }
    
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormEdit({...formEdit, photoFile: file});
  }

  async function editMember() {
    try {
      setLoading(true);

      let photoUrl = member.foto_url;
      let photoId = member.foto_id;

      if (formEdit.photoFile) {
        const uploaded = await uploadImage(formEdit.name.trim() || member.nama, formEdit.photoFile);

        photoUrl = uploaded.url;
        photoId = uploaded.public_id;
      }

      const res = await fetch(`/api/admin/member/${username}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formEdit.name.trim() || member.nama,
          phone: formEdit.phone,
          photoUrl,
          photoId,
        }),
      });

      if (
        formEdit.photoFile &&
        member.id &&
        member.id !== photoId
      ) {
        try {
          await destroyImage(member.foto_id);
        } catch (err) {
          console.error("Photo deletion failed:", err);
        }
      }

      const data = await res.json();

      console.log(res.status);
      console.log(data);

      if (res.ok) fetchData();
      else setLoading(false);

      setEdit(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    } 
  }

  async function deleteMember() {
    try {
      setRemove(false);
      setLoading(true);

      const res = await fetch(
        `/api/admin/member/${username}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        throw new Error(data.message);
      }

      if (data.photoId) {
        try {
          await destroyImage(data.photoId);
        } catch (err) {
          console.error("Photo deletion failed:", err);
        }
      }
      
      router.push("/admin");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  async function fetchData() {
    const res = await fetch(`/api/admin/member/${username}`, {
      credentials: "include",
    });

    const memberJson = await res.json();

    setMember(memberJson.data[0]);

    setLoading(false);
  }

  function formatDate(dateInput: Date | string, type?: "full" | "medium") {
    const date = new Date(dateInput);

    const minute = String(date.getMinutes()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}${type === "full" ? ` - ${hour}:${minute}` : ""}`;
  }

  // LOAD MEMBERS
  useEffect(() => {
    fetchData();
    initMembership(now);
  }, []);

  // useEffect(() => {
  //   console.log(startMembership, new Date(endMembership))
  // }, [startMembership])

  useEffect(() => {
    if (!loading)
    console.log("member2: ",member);
  }, [loading])

  useEffect(() => {
    if (!loading)
      setFormEdit({
        ...formEdit,
        name: member.nama,
        phone: member.no_telp,
      })
  }, [member])

  return (
    <main className="h-[calc(100dvh-theme(spacing.12))] relative flex flex-col gap-4 py-4 px-6 justify-end items-center bg-foreground">
      {loading?
      <>
        <div className="w-full flex flex-col gap-4 items-center animate-pulse">

          <div className="bg-slate-400 size-64 rounded-full" />

          <div className="flex flex-col items-center gap-1">
            <div className="bg-slate-400 w-36 h-3 rounded-sm" />
            <div className="bg-slate-400 w-46 h-5 rounded-sm" />
            <div className="bg-slate-400 w-42 h-3 rounded-sm" />
          </div>

          <div className="w-full flex flex-col gap-2 items-start pb-1">
            <div className="bg-slate-400 w-40 h-3 rounded-sm" />
            <div className="bg-slate-400 w-full h-12 rounded-sm" />
            <div className="bg-slate-400 w-46 h-3 rounded-sm mx-auto" />
          </div>

        </div>

        <div className="bg-slate-400 w-46 h-3 rounded-sm animate-pulse" />

        <div className="flex flex-col items-center gap-4 w-full pb-2 animate-pulse">
          <div className="bg-slate-400 w-full h-12 rounded-sm" />
          <div className="flex w-full justify-between items-center">
            <div className="bg-slate-400 w-28 h-3 rounded-sm mx-auto" />
            <div className="bg-slate-400 w-28 h-3 rounded-sm mx-auto" />
          </div>
        </div>
      </>
      : !edit ?
      <>
        <div className="w-full flex flex-col gap-2 items-center">
          <img src={member.foto_url} alt="" onClick={() => setZoomImg(true)} className="object-cover size-64 rounded-full" />

          <div className="flex flex-col items-center">
            <span className="font-black text-xs italic">#{member.username}</span>
            <h1 className="font-black text-xl">{member.nama}</h1>
            <span className="text-xs pt-1">{!member.no_telp ? "Nomor HP belum dicatat" : `+62 ${member.no_telp.slice(2, 5)}-${member.no_telp.slice(6, 10)}-${member.no_telp.slice(10)}`}</span>
          </div>

          <div className="w-full flex flex-col gap-2 items-center">
            <span className="w-full text-xs text-start pt-1">Latihan terakhir {timePassed(member.lastCheckin)}</span>

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
            <div className="text-xs font-extralight tracking-widest">{formatDate(member.msStart)} - {formatDate(member.msEnd)}</div>
          </div>

        </div>

        <div className="text-xs font-extralight tracking-widest"><span className="font-light tracking-normal">Waktu daftar:</span> {formatDate(member.created_at, "full")}</div>

        <div className="flex flex-col gap-4 w-full">
          <PrimaryButton disabled={member.msStatus} onClick={() => setMembershipExtend(true)}>Perpanjang Membership</PrimaryButton>

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
          <div className="absolute px-6">
            <FontAwesomeIcon icon={faX} onClick={() => setZoomImg(false)} className="text-prime right-2 absolute -top-6 cursor-pointer" />
            <img src={member.foto_url} alt="" className="w-full object-cover" />
          </div>
          {/* <img src={member.img} alt="" className="absolute w-96 h-96 object-cover" /> */}
        </div>

        {/* EXTEND MEMBERSHIP */}
        <div className={`fixed inset-0 flex items-center justify-center z-50 w-full h-full ${!membershipExtend && "hidden"}`}>

          <div onClick={() => setMembershipExtend(false)} className="absolute inset-0 bg-stroke/80" />

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
                  onChange={(e) => initMembership(!isNaN(new Date(e.target.value).getTime()) ? new Date(e.target.value) : now)}
                  className="rounded-lg border px-3 py-2"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs">Tanggal Berakhir</label>
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
                <BareButton onClick={() => {setMembershipExtend(false); initMembership(now);}}>Batal</BareButton>
                <PrimaryButton onClick={extendMembership}>Perpanjang</PrimaryButton>
              </div>
            </div>
          </div>
        </div>

        {/* DELETE CONFIRMATION */}
        <div className={`fixed inset-0 flex items-center justify-center z-50 w-full h-full ${!remove && "hidden"}`}>

          <div onClick={() => setRemove(false)} className="absolute inset-0 bg-stroke/80" />

          <div className="absolute w-full max-w-md p-6">
            <div className="flex flex-col gap-4 bg-background p-6 rounded-sm">
              <h3 className="text-lg font-black font-mulish text-center">Hapus Member</h3>

              <hr className="border-stroke" />

              <span className="text-sm">Hapus secara permanen member <span className="font-extrabold font-mulish">{member.nama}</span>? <span className="text-prime">{member.isActive && "Member masih berstatus aktif."}</span> <br /> <br /> * Data member terhapus tidak dapat dipulihkan kembali.</span>

              <div className="flex gap-2 pt-6">
                <BareButton onClick={() => setRemove(false)}>Batal</BareButton>
                <PrimaryButton onClick={deleteMember}>Hapus</PrimaryButton>
              </div>
            </div>
          </div>
          
        </div>
      </>
      : <>
      {/* EDIT */}
        <div className="w-full flex flex-col gap-6 items-center">

          <div onClick={() => fileInputRef.current?.click()} className="relative size-64 rounded-full cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <div className="absolute bg-stroke/60 w-full h-full rounded-full" />
            <div className="flex items-center justify-center w-full h-full absolute">
              <FontAwesomeIcon icon={faEdit} size="2xl" className="absolute text-background" />
            </div>
            <img src={formEdit.photoFile ? URL.createObjectURL(formEdit.photoFile) : member.foto_url} alt="" className="object-cover size-full rounded-full" />
          </div>
          

          <div className="w-full flex flex-col gap-2 items-center">
            <input
              type="text"
              name="name"
              placeholder="Nama Member"
              value={formEdit.name || ""}
              onChange={(e) => {
                const value = e.target.value
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase());
                  setFormEdit({...formEdit, name: value})}
              }
              className={`
                w-full px-4 py-2
                border-1 border-stroke/40 outline-stroke rounded-sm
                text-center font-mulish font-bold text-xl bg-background
                ${(formEdit.name)? "bg-background outline-2" : "bg-paragraph/10"}
                focus:outline-2
              `}
            />

            <input
              type="tel"
              name="phone"
              placeholder="628......."
              value={formEdit.phone || ""}
              onChange={(e) => {
                const val = e.target.value;
                if (!isNaN(Number(val)) && val.length <= 15)
                  setFormEdit({...formEdit, phone: val})
              }}
              className={`
                w-full px-4 py-2
                border-1 border-stroke/40 outline-stroke rounded-sm
                text-center text-md font-chivo bg-background
                ${formEdit.phone? "bg-background outline-2" : "bg-paragraph/10"}
                focus:outline-2
              `}
            />
          </div>

        </div>

        <div className="flex flex-col gap-4 w-full">
          <PrimaryButton disabled={formEdit.name === member.nama && formEdit.phone === member.no_telp && !formEdit.photoFile} onClick={editMember}>Simpan</PrimaryButton>

          <BareButton onClick={() => {setEdit(false); setFormEdit({name: member.nama, phone: member.no_telp, photoFile: null});}}>
            <FontAwesomeIcon icon={faX} className="w-4" />
            Batal
          </BareButton>

        </div>
      </>
      }
      
    </main>
  );
};