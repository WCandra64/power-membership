"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function NavbarAdmin() {
  const [opLoading, setOpLoading] = useState(true);

  const [opData, setOpData] = useState<any>({}); 

  const [pengumuman, setPengumuman] = useState("");

  async function fetchOpData() {
    setOpLoading(true);
    try {
      const res = await fetch("/api/operational");

      const json = await res.json();
      console.log(json);

      setOpData(json);
    } finally {
      setOpLoading(false);
    }
  }

  async function changeOpData(type: 1 | 2) {
    setOpLoading(true);

    const res = await fetch("/api/admin/jadwal/override", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: type === 1 ? JSON.stringify({
        status: !opData.operasional,
      }) : JSON.stringify({
        pengumuman: pengumuman,
      }),
    });

    const json = await res.json();

    if (res.ok) {
      console.log(json)
      if (type === 2)
        await fetchOpData();
      if (type === 1)
        window.location.reload();
    } 
  }

  // LOAD MEMBERS
  useEffect(() => {
    fetchOpData();
  }, []);

  useEffect(() => {
    setPengumuman(opData.pengumumanHariIni);
  }, [opData]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          {/* OPEN BUTTON */}
          <button
            onClick={() => changeOpData(1)}
            disabled={opLoading}
            className={`relative w-42 h-10 rounded-full inset-shadow-sm/20 cursor-pointer transition ${
              opData.operasional ? "bg-green-500" : "bg-paragraph/20"
            }`}
          >
            <span className="font-mulish font-black text-background">{opLoading? "" :opData.operasional ? "BUKA" : "TUTUP"}</span>
            <div
              className={`absolute top-0.5 h-9 w-9 rounded-full bg-background shadow-sm/20 transition-transform duration-200 ${
                opLoading ? "hidden" :
                opData.operasional ? "translate-x-32.5" : "translate-x-0.5"
              }`}
            />
          </button>
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
              w-full rounded-sm px-4 py-3 text-sm
              border-1 border-stroke/40 focus:outline-2 outline-stroke
              ${pengumuman ? "outline-2 bg-background" : "bg-paragraph/5"}
            `}
          />

          <button
            type="button"
            disabled={opLoading || (pengumuman === opData.pengumumanHariIni || (pengumuman === "" && opData.pengumumanHariIni === ""))}
            onClick={() => changeOpData(2)}
            className="bg-green-500 px-3 text-background shadow-sm/40 rounded-sm cursor-pointer hover:bg-stroke disabled:bg-paragraph/10 disabled:text-paragraph/20 disabled:shadow-none"
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </div>

      </div>

    </>
  );
}