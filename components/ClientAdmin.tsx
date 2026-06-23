"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faCalendarAlt, faCaretDown, faCaretUp, faCertificate, faCheck, faCheckCircle, faPlus, faPlusCircle, faSearch, faSort, faStreetView, faUserAltSlash, faUsers } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from '@/components/PrimaryButton'
import ScrollTop from "@/components/ScrollTop";


export default function AdminComponent() {

  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const member = {
    username: "abc123",
    name: "John Doe",
    img: "/user.png",
    isActive: true,
    activeDate: "07/06/2026",
    expiredDate: "06/07/2026",
    checkedIn: true,
  }

  const [open, setOpen] = useState(true);

  const [pengumuman, setPengumuman] = useState("");

  // const sort = ["Nama", "Tgl Mulai", "Tgl Expired"]
  const [sort, setSort] = useState("name");
  const [sortOrder, setSortOrder] = useState<"def" | "asc" | "dsc">("def");

  const [category, setCategory] = useState([
    {
      name: "Baru",
      isActive: false,
      icon: faCertificate,
      defaultColor: "bg-fuchsia-100",
      activeColor: "bg-fuchsia-500",
      hoveror: "hover:bg-fuchsia-500",
      iconColor: "text-fuchsia-500"
    },
    {
      name: "Aktif",
      isActive: false,
      icon: faCheckCircle,
      defaultColor: "bg-green-100",
      activeColor: "bg-green-500",
      hoveror: "hover:bg-green-500",
      iconColor: "text-green-500"
    },
    {
      name: "Latihan",
      isActive: false,
      icon: faStreetView,
      defaultColor: "bg-cyan-100",
      activeColor: "bg-cyan-500",
      hoveror: "hover:bg-cyan-500",
      iconColor: "text-cyan-500"
    },
    {
      name: "Member",
      isActive: true,
      icon: faUsers,
      defaultColor: "bg-prime/10",
      activeColor: "bg-prime",
      hoverColor: "hover:bg-prime",
      iconColor: "text-prime"
    },
    {
      name: "Nonaktif",
      isActive: false,
      icon: faUserAltSlash,
      defaultColor: "bg-taupe-100",
      activeColor: "bg-taupe-500",
      hoveror: "hover:bg-taupe-500",
      iconColor: "text-taupe-500"
    }
  ]);
  
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/members?page=${page}&limit=30`, {
        credentials: "include",
      });

      const json = await res.json();
      console.log(json);

      setMembers(json.data);
      setLoading(false);
    }

    load();
  }, [page]);

  return (
    <main className="relative flex flex-col gap-6 w-full min-h-[calc(100vh-theme(spacing.12))] bg-foreground py-6">

      <div className="flex flex-col gap-4 px-6">
        <div className="flex justify-between">
          {/* OPEN BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className={`relative w-36 h-10 rounded-full inset-shadow-sm/20 cursor-pointer transition ${
              open ? "bg-green-500" : "bg-paragraph/10"
            }`}
          >
            <span className="font-mulish font-black text-background">{open ? "BUKA" : "TUTUP"}</span>
            <div
              className={`absolute top-0.5 h-9 w-9 rounded-full bg-background shadow-sm/20 transition-transform duration-200 ${
                open ? "translate-x-26.5" : "translate-x-0.5"
              }`}
            />
          </button>
          
          {/* SCHED BUTTON */}
          <Link href="/admin/jadwal" className="flex gap-2 items-center py-2 px-6 bg-background text-prime font-bold text-sm rounded-sm shadow-sm/20 hover:shadow-none hover:text-stroke">
            <FontAwesomeIcon icon={faCalendarAlt} />
            Tambah Jadwal
          </Link>
        </div>
        
        {/* PENGUMUMAN FIELD */}
        <div className="flex gap-2">
          <input
            type="text"
            name="pengumuman"
            placeholder="Pengumuman..."
            value={pengumuman}
            onChange={(e) => setPengumuman(e.target.value)}
            className={`
              w-full rounded-sm px-4 py-2 text-sm
              border-1 border-stroke/40 focus:outline-2 outline-stroke
              ${pengumuman ? "outline-2 bg-background" : "bg-paragraph/5"}
            `}
          />

          <button disabled={pengumuman === ""} type="button" className="bg-green-500 px-2 text-background shadow-sm/40 rounded-sm cursor-pointer hover:bg-stroke disabled:bg-paragraph/10 disabled:text-paragraph/20 disabled:shadow-none"><FontAwesomeIcon icon={faCheck} /></button>
        </div>
      </div>

      <hr />

      {/* MEMBER CATEGORY */}
      <div className="flex gap-2 w-full overflow-x-auto scrollbar-hidden pb-2 px-6">
        {category.map((c, i) => (
          <div
            key={i}
            onClick={() =>
              setCategory((prev) => 
                prev.map((item, index) => ({
                  ...item,
                  isActive: index === i,
                })
              ))
            }
            className={`flex flex-col gap-1 group ${c.isActive ? c.activeColor+" shadow-sm/40" : c.defaultColor} rounded-sm px-4 py-2 border-2 border-stroke cursor-pointer hover:${c.activeColor} hover:text-background select-none`}
          >
            <div className="flex gap-2">
              <span className={`${c.isActive ? "text-background" : "text-stroke"} font-extrabold italic text-sm group-hover:text-background`}>999</span>

              <FontAwesomeIcon icon={c.icon} size="xl" className={`w-6 ${!c.isActive ? c.iconColor : "text-background"} group-hover:text-background`} />
            </div>
            
            <span className={`${c.isActive ? "text-background" : "text-stroke"} font-mulish font-bold text-xs tracking-widest group-hover:text-background`}>{c.name}</span>
          </div>
        ))}

      </div>

      {/* <button type="button" className="mx-6 bg-prime text-background py-2 font-mulish font-extrabold rounded-sm">Tambah Member</button> */}
      
      {/* SEARCH */}
      <div className="flex items-center gap-2 bg-background border-2 border-stroke py-2 px-4 mx-6 rounded-sm">
        <input type="text" name="search" placeholder="Cari member..." className="outline-none w-full text-sm" />
        <FontAwesomeIcon icon={faSearch} size="sm" className="w-4 text-stroke hover:text-stroke/40 cursor-pointer" />
      </div>

      <div className="px-6">
        <div className="flex justify-between items-center pb-2">
      
          {/* SORT BUTTON */}
          <div className="flex items-center gap-4">
            <FontAwesomeIcon
              onClick={() => sortOrder === "def" ? setSortOrder("asc") : sortOrder === "asc" ? setSortOrder("dsc") : setSortOrder("def")}
              icon={sortOrder === "def" ? faSort : sortOrder === "asc" ? faCaretDown : faCaretUp}
              size="sm"
              className="w-3 text-stroke cursor-pointer"
            />

            <select
              defaultValue=""
              // value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-fit bg-background py-2 px-2 text-xs rounded-full border-2 border-stroke cursor-pointer"
            >
              <option value="" disabled>
                Urutkan
              </option>

              <option value="name">Nama</option>
              <option value="startDate">Tanggal Mulai</option>
              <option value="endDate">Tanggal Berakhir</option>
            </select>
          </div>

          <Link href="/admin/member/daftar" className="flex gap-2 items-center bg-prime rounded-sm shadow-sm/40 p-2 text-background text-xs font-bold font-mulish hover:bg-paragraph cursor-pointer">
            <FontAwesomeIcon icon={faPlus} size="sm" className="w-2 text-background" />
            Tambah
          </Link>
        </div>

        {/* MEMBER LIST */}
        <div className="flex flex-col items-center justify-end gap-2 w-full h-full">
          {
            // user.filter((u) => u.username !== "admin").map((u, index) => (
            Array.from({ length: 2 }).map((_, i) => (
              <Link
                key={i}
                href={`/admin/member/${member.username}`}
                className="flex items-center gap-4 w-full bg-background rounded-sm shadow-md p-4 border-2 border-stroke select-none"
              >
                <img src={member.img} alt="" className="w-24 h-24 object-cover" />

                <div className="flex flex-col gap-0">
                  <span className="font-semibold text-xs italic">#{member.username}</span>
                  <h4 className="font-extrabold text-md">{member.name}</h4>
                  <span className="text-xs tracking-widest">07 Jun '26 - 06 Jul '26</span>
                  <span className="text-xs font-extralight">Latihan 2 hari lalu</span>

                  <div className="text-xs/5 pt-4 flex gap-2 font-mulish font-semibold">
                    <span className="px-4 bg-green-100 text-green-500 rounded-full">Aktif</span>
                    <span className="px-4 bg-cyan-100 text-cyan-500 rounded-full">Latihan</span>
                    <span className="px-4 bg-fuchsia-100 text-fuchsia-500 rounded-full">Baru</span>
                    {/* <span className="px-4 bg-taupe-100 text-taupe-500 rounded-full">Tidak Aktif</span> */}
                  </div>
                </div>
                
              </Link>
            ))
          }

          {members.map((m, i) => (
              <Link
                key={i}
                href={`/admin/member/${m.username}`}
                className="flex items-center gap-4 w-full bg-background rounded-sm shadow-md p-4 border-2 border-stroke select-none"
              >
                <img src={member.img} alt="" className="w-24 h-24 object-cover" />

                <div className="flex flex-col gap-0">
                  <span className="font-semibold text-xs italic">#{m.username}</span>
                  <h4 className="font-extrabold text-md">{m.name}</h4>
                  <span className="text-xs tracking-widest">
                    {new Date(m.msStart).toLocaleDateString('id-ID', {dateStyle: 'medium'})} - {new Date(m.msEnd).toLocaleDateString('id-ID', {dateStyle: 'medium'})}
                    </span>
                  <span className="text-xs font-extralight">Latihan {m.lastVisit}</span>

                  <div className="text-xs/5 pt-4 flex gap-2 font-mulish font-semibold">
                    {m.membershipStatus && 
                      <span className="px-4 bg-green-100 text-green-500 rounded-full">Aktif</span>
                    }
                    {/* <span className="px-4 bg-cyan-100 text-cyan-500 rounded-full">Latihan</span>
                    <span className="px-4 bg-fuchsia-100 text-fuchsia-500 rounded-full">Baru</span> */}
                    {/* <span className="px-4 bg-taupe-100 text-taupe-500 rounded-full">Tidak Aktif</span> */}
                  </div>
                </div>
                
              </Link>
            ))
          }
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-md h-20 pointer-events-none">
        <div className="w-full h-full relative">
          <ScrollTop />
        </div>
      </div>
      
      
    </main>
  );
}