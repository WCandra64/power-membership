"use client";

import Link from "next/link";
import { act, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faCalendarAlt, faCaretDown, faCaretUp, faCertificate, faCheck, faCheckCircle, faPlus, faPlusCircle, faSearch, faSort, faStreetView, faUserAltSlash, faUsers } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from '@/components/PrimaryButton'
import ScrollTop from "@/components/ScrollTop";
import { localTime } from "@/lib/time";
import timePassed from "@/lib/timePassed";

type Member = {
  id: number,
  name: string,
  phone: string,
  photo: string,
  username: string,

  msStart: Date,
  msEnd: Date,
  msStatus: boolean,

  lastCheckin: Date | null,
  lastCheckout: Date | null,

  showImage: boolean
}


export default function AdminPage() {

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [opData, setOpData] = useState<any>({}); 

  const [pengumuman, setPengumuman] = useState("");

  const [search, setSearch] = useState("");

  // const sort = ["Nama", "Tgl Mulai", "Tgl Expired"]
  const [sort, setSort] = useState("newest");
  const [sortOrder, setSortOrder] = useState<"def" | "asc" | "dsc">("def");

  const [categories, setCategories] = useState([
    {
      name: "Aktif",
      count: 999,
      isActive: false,
      icon: faCheckCircle,
      defaultColor: "bg-green-100",
      activeColor: "bg-green-500",
      hoveror: "hover:bg-green-500",
      iconColor: "text-green-500"
    },
    {
      name: "Latihan",
      count: 999,
      isActive: false,
      icon: faStreetView,
      defaultColor: "bg-cyan-100",
      activeColor: "bg-cyan-500",
      hoveror: "hover:bg-cyan-500",
      iconColor: "text-cyan-500"
    },
    {
      name: "Member",
      count: 999,
      isActive: true,
      icon: faUsers,
      defaultColor: "bg-prime/10",
      activeColor: "bg-prime",
      hoverColor: "hover:bg-prime",
      iconColor: "text-prime"
    },
    {
      name: "Nonaktif",
      count: 999,
      isActive: false,
      icon: faUserAltSlash,
      defaultColor: "bg-taupe-100",
      activeColor: "bg-taupe-500",
      hoveror: "hover:bg-taupe-500",
      iconColor: "text-taupe-500"
    }
  ]);

  const [stats, setStats] = useState({
    total: 999,
    active: 999,
    inactive: 999,
    training: 999
  });

  const [activeCategory, setActiveCategory] = useState("");

  async function fetchOpData() {
    const res = await fetch("/api/operational");

    const json = await res.json();
    console.log(json);

    setOpData(json);
  }

  async function changeOpData(type: 1 | 2) {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/jadwal/override", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: type === 1 ? !opData.operasional : opData.operasional,
          pengumuman: type === 2 ? pengumuman : opData.pengumuman,
        }),
      });

      const json = await res.json();

      if (res.ok) {
        window.location.reload();
      } 
    } finally {
      setLoading(false);
    }
  }

  // TRAINING SESSION
  function isTraining(checkIn: string | Date | null, checkOut: string | Date | null) {
    if (!checkIn || !checkOut) return false;

    const now = Date.now();

    return (
      now >= new Date(checkIn).getTime() &&
      now <= new Date(checkOut).getTime()
    );
  }

  // SHOW IMAGE
  function handleShowImage(id: number) {
    setMembers(prev =>
      prev.map(m =>
        m.id === id ? { ...m, showImage: true } : m
      )
    );
  }

  async function fetchMembers() {
    setLoading(true);
    const res = await fetch(`/api/admin/members?page=${page}&limit=30&search=${search}&filter=${activeCategory}&sort=${sort}`, {
      credentials: "include",
    });

    const json = await res.json();
    console.log(json);

    setMembers(
      json.data.map((m: Member) => ({
        ...m,
        showImage: false,
      }))
    );
    setLoading(false);
  }

  async function fetchStats() {
    const res = await fetch(`/api/admin/members/statistics`, {
      credentials: "include",
    });

    const json = await res.json();
    console.log(json.data[0]);

    setStats(json.data[0]);
  }

  // LOAD MEMBERS
  useEffect(() => {
    setLoading(true);
    fetchOpData();
    fetchStats();
  }, []);
  
  // LOAD MEMBERS
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
      return;
    }

    fetchMembers();
  }, [search, activeCategory, sort]);

  useEffect(() => {
    fetchMembers();
  }, [page]);

  useEffect(() => {
    setActiveCategory(categories.find(c => c.isActive)?.name ?? "Member");
  }, [categories]);

  useEffect(() => {
    console.log("data op:",opData);
    setPengumuman(opData.pengumuman);
  }, [opData]);

  return (
    <main className="relative flex flex-col gap-6 w-full min-h-[calc(100dvh-theme(spacing.12))] bg-foreground py-6">

      <div className="flex flex-col gap-4 px-6">
        <div className="flex justify-between">
          {/* OPEN BUTTON */}
          <button
            onClick={() => changeOpData(1)}
            disabled={loading}
            className={`relative w-36 h-10 rounded-full inset-shadow-sm/20 cursor-pointer transition ${
              opData.operasional ? "bg-green-500" : "bg-paragraph/10"
            }`}
          >
            <span className="font-mulish font-black text-background">{loading? "" :opData.operasional ? "BUKA" : "TUTUP"}</span>
            <div
              className={`absolute top-0.5 h-9 w-9 rounded-full bg-background shadow-sm/20 transition-transform duration-200 ${
                loading ? "hidden" :
                opData.operasional ? "translate-x-26.5" : "translate-x-0.5"
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
            value={pengumuman || ""}
            onChange={(e) => setPengumuman(e.target.value)}
            className={`
              w-full rounded-sm px-4 py-2 text-sm
              border-1 border-stroke/40 focus:outline-2 outline-stroke
              ${pengumuman ? "outline-2 bg-background" : "bg-paragraph/5"}
            `}
          />

          <button
            type="button"
            disabled={pengumuman === "" || loading || pengumuman === opData.pengumuman}
            onClick={() => changeOpData(2)}
            className="bg-green-500 px-2 text-background shadow-sm/40 rounded-sm cursor-pointer hover:bg-stroke disabled:bg-paragraph/10 disabled:text-paragraph/20 disabled:shadow-none"
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </div>
      </div>

      <hr />

      {/* MEMBER CATEGORies */}
      <div className="flex gap-2 w-full overflow-x-auto scrollbar-hidden pb-2 px-6">
        {categories.map((c, i) => (
          <div
            key={i}
            onClick={() =>
              setCategories((prev) => 
                prev.map((item, index) => ({
                  ...item,
                  isActive: index === i,
                })
              ))
            }
            className={`flex flex-col gap-1 group ${c.isActive ? c.activeColor+" shadow-sm/40" : c.defaultColor} rounded-sm px-4 py-2 border-2 border-stroke cursor-pointer hover:${c.activeColor} hover:text-background select-none`}
          >
            <div className="flex gap-2">
              <span className={`${c.isActive ? "text-background" : "text-stroke"} font-extrabold italic text-sm group-hover:text-background`}>{c.name === "Aktif" ? stats.active : c.name === "Nonaktif" ? stats.inactive : c.name === "Latihan" ? stats.training : stats.total}</span>

              <FontAwesomeIcon icon={c.icon} size="xl" className={`w-6 ${!c.isActive ? c.iconColor : "text-background"} group-hover:text-background`} />
            </div>
            
            <span className={`${c.isActive ? "text-background" : "text-stroke"} font-mulish font-bold text-xs tracking-widest group-hover:text-background`}>{c.name}</span>
          </div>
        ))}

      </div>

      {/* <button type="button" className="mx-6 bg-prime text-background py-2 font-mulish font-extrabold rounded-sm">Tambah Member</button> */}
      
      {/* SEARCH */}
      <div className="flex items-center gap-2 bg-background border-2 border-stroke py-2 px-4 mx-6 rounded-sm">
        <input type="text" name="search" placeholder="Cari member..."  value={search || ""} onChange={(e) => setSearch(e.target.value)} className="outline-none w-full text-sm" />
        <FontAwesomeIcon icon={faSearch} size="sm" className="w-4 text-stroke hover:text-stroke/40 cursor-pointer" />
      </div>

      <div className="px-6">
        <div className="flex justify-between items-center">
      
          {/* SORT BUTTON */}
          <div className="flex items-center gap-4">
            {/* <FontAwesomeIcon
              onClick={() => sortOrder === "def" ? setSortOrder("asc") : sortOrder === "asc" ? setSortOrder("dsc") : setSortOrder("def")}
              icon={sortOrder === "def" ? faSort : sortOrder === "asc" ? faCaretDown : faCaretUp}
              size="sm"
              className="w-3 text-stroke cursor-pointer"
            /> */}

            <select
              defaultValue=""
              // value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-fit bg-background py-2 px-2 text-xs rounded-full border-2 border-stroke cursor-pointer"
            >
              <option value="" disabled>
                Urutkan
              </option>

              <option value="newest">Membership Terbaru</option>
              <option value="oldest">Membership Terlama</option>
              <option value="name_asc">Nama A-Z</option>
              <option value="name_desc">Nama Z-A</option>
            </select>
          </div>

          <Link href="/admin/member/tambah" className="flex gap-2 items-center bg-prime rounded-sm shadow-sm/40 p-2 text-background text-sm font-bold font-mulish hover:bg-paragraph cursor-pointer">
            <FontAwesomeIcon icon={faPlus} size="sm" className="w-2 text-background" />
            Tambah
          </Link>
        </div>

        <hr className="px-6 my-4" />

        {/* MEMBER LIST */}
        <div className="flex flex-col items-center justify-end gap-2 w-full h-full">

          {loading?
            // LAZY LOAD
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 w-full bg-background rounded-sm shadow-md p-4 border-2 border-stroke select-none">
                <div className="w-24 h-24 flex-none bg-slate-400 animate-pulse" />

                <div className="flex flex-col gap-1 w-full">
                  <div className="bg-slate-400 h-3 w-24 rounded-sm animate-pulse" />
                  <div className="bg-slate-400 h-5 w-32 rounded-sm animate-pulse" />
                  <div className="bg-slate-400 h-3 w-46 rounded-sm animate-pulse" />
                  <div className="bg-slate-400 h-3 w-36 rounded-sm animate-pulse" />

                  <div className="bg-slate-400 w-20 h-4 rounded-full mt-4 animate-pulse" />
                </div>
                
              </div>
            ))
            : !members.length ? <span className="pt-16 font-bold">Member tidak ditemukan.</span>
            :
            // ACTUAL MEMBERS
            members.map((m, i) => (
              <Link
                key={i}
                href={`/admin/member/${m.username}`}
                className="flex items-center gap-4 w-full bg-background rounded-sm shadow-md p-4 border-2 border-stroke select-none"
              >
                <img
                  onClick={(e) => {e.preventDefault(); handleShowImage(m.id)}}
                  src={m.showImage? m.photo : "/user.png"}
                  className="w-24 h-24 object-cover"
                />

                <div className="flex flex-col gap-0">
                  <span className="font-semibold text-xs italic">#{m.username}</span>
                  <h4 className="font-extrabold text-md">{m.name}</h4>
                  <span className="text-xs tracking-widest">
                    {new Date(m.msStart).toLocaleDateString('id-ID', {dateStyle: 'medium'})} - {new Date(m.msEnd).toLocaleDateString('id-ID', {dateStyle: 'medium'})}
                  </span>
                  <span className="text-xs font-extralight">Latihan {timePassed(m.lastCheckin)}</span>

                  <div className="text-xs/5 pt-4 flex gap-2 font-mulish font-semibold">
                    {m.msStatus ? 
                      <span className="px-4 bg-green-100 text-green-500 rounded-full">Aktif</span>
                      :
                      <span className="px-4 bg-taupe-100 text-taupe-500 rounded-full">Tidak Aktif</span>
                    }
                    {isTraining(m.lastCheckin, m.lastCheckout) &&
                      <span className="px-4 bg-cyan-100 text-cyan-500 rounded-full">Latihan</span>
                    }
                  </div>
                </div>
                
              </Link>
            ))
          }
          
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-3xl h-20 pointer-events-none">
        <div className="w-full h-full relative">
          <ScrollTop />
        </div>
      </div>
      
      
    </main>
  );
}