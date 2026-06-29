"use client";

import PrimaryButton from "@/components/PrimaryButton";
import { storeTime } from "@/lib/time";
import { faEdit, faRemove, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function JadwalPage() {

  const now = storeTime();

  const [jadwal, setJadwal] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [idJadwal, setIdJadwal] = useState(0);

  const [form, setForm] = useState({
    date: "",
    sess1: true,
    sess2: true,
    announcement: ""
  });

  async function handleSchedule(type: "add" | "edit", id?: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/jadwal${type === "edit" ? `/${id}` : ""}`, {
        method: type === "add" ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          date: form.date,
          sess1: form.sess1,
          sess2: form.sess2,
          announcement: form.announcement
        }),
      })

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      } else { 
        fetchSchedules();
        setEdit(false);
        setForm({
          date: "",
          sess1: true,
          sess2: true,
          announcement: ""
        });
      }
      
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  async function deleteJadwal(id: number) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/jadwal/"+id, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      } else 
        fetchSchedules();
      console.log(data)
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  async function fetchSchedules() {
    try {
      const res = await fetch("/api/admin/jadwal", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      console.log(data)

      setJadwal(
        data.rows
      )
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules()
  }, []);

  // useEffect(() => {
  //   if(edit)
  //     fetchSchedule
  // }, [edit])

  console.log(jadwal)

  return(
    <main className="min-h-[calc(100dvh-theme(spacing.12))] relative flex flex-col gap-8 py-4 px-6 justify-start items-center bg-foreground">
      {/* FORM */}
      <div className="flex flex-col items-center justify-center gap-8 w-full p-4 bg-background border-2 border-stroke rounded-sm">
        <h1 className="font-black">Tambah Jadwal Tutup</h1>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex w-full gap-6">

            <div className="flex flex-col">
              <label className="text-xs">Tanggal</label>
              <input
                type="date"
                value={form.date || ""}
                onChange={(e) => {
                  const val = new Date(e.target.value).setHours(23, 59, 59, 0);
                  setForm({
                    ...form,
                    date: new Date(val) < now ? "" : e.target.value
                  })
                }}
                className="placeholder-shown:bg-paragraph/10 rounded-lg border px-4 py-2 text-sm cursor-pointer"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-xs">Sesi</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <label className="text-sm flex gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={form.sess1}
                    onChange={(e) => setForm({...form, sess1: e.target.checked})}
                    className="accent-prime"
                  />
                  Sesi 1
                </label>
                <label className="text-sm flex gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={form.sess2}
                    onChange={(e) => setForm({...form, sess2: e.target.checked})}
                    className="accent-prime"
                  />
                  Sesi 2
                </label>
              </div>
            </div>

          </div>

          <div className="flex flex-col w-full">
            <label className="text-xs">Pengumuman</label>
            <input 
              type="text" 
              placeholder="Pengumuman..." 
              value={form.announcement || ""}
              onChange={(e) => setForm({...form, announcement: e.target.value})}
              className="rounded-sm px-4 py-2 text-sm border-1 border-stroke/40 outline-2 outline-stroke placeholder-shown:bg-paragraph/10 placeholder-shown:outline-none"
            />
          </div>
        </div>
        
        <PrimaryButton disabled={loading || !form.date || form.date < storeTime().toISOString().split("T")[0] || (!form.sess1 && !form.sess2) || !form.announcement} onClick={() => handleSchedule(edit ? "edit" : "add", edit ? idJadwal : 0)}>{edit ? "Ubah Jadwal" : "Tambah Jadwal"}</PrimaryButton>

      </div>

      {/* TABLE */}
      <div className="flex flex-col w-full gap-4">
        <h1 className="font-black text-left">Jadwal Tutup</h1>

        {!loading && !jadwal.length ?
          <span>Belum ada jadwal tutup mendatang</span>
          :
          <table className="w-full rounded-sm border-2 border-stroke">
            <thead>
              <tr className="text-stroke text-xs">
                <th className="py-2 px-2 text-left">Tanggal</th>
                <th className="py-2 px-2 text-left">Pengumuman</th>
                <th className="py-2 px-2 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody className="border-2 border-stroke">
              {loading?
                <tr
                  className="odd:bg-background even:bg-foreground text-xs"
                >
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                </tr>
              : jadwal.map((j, index) => (
                <tr
                  key={index}
                  className="odd:bg-background even:bg-foreground text-xs"
                >
                  <td className="px-4 py-3">{new Date(j.waktu_mulai).toLocaleDateString('id-ID', {dateStyle: 'long'})}</td>
                  <td className="px-4 py-3 overflow-x-auto">{j.pengumuman}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEdit(true);
                        setIdJadwal(j.id);
                        setForm({
                          date: new Date(j.waktu_mulai).toISOString().split('T')[0],
                          sess1: new Date(j.waktu_mulai).getHours() < 11,
                          sess2: new Date(j.waktu_akhir).getHours() === 21,
                          announcement: j.pengumuman
                        })
                      }}
                      className="text-green-500 hover:text-stroke cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faEdit}/>
                    </button>
                    <button onClick={() => deleteJadwal(j.id)} className="text-prime hover:text-stroke cursor-pointer">
                      <FontAwesomeIcon icon={faTrash}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
        
      </div>

    </main>
  );
}