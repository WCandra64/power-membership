import PrimaryButton from "@/components/PrimaryButton";
import { faEdit, faRemove, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function JadwalPage() {

  const jadwal = [
    {
      date: "2026/07/18",
      pengumuman: "Aktif",
    },
    {
      date: "2026/06/15",
      pengumuman: "Expired",
    },
    {
      date: "2026/07/20",
      pengumuman: "Aktif",
    },
  ];

  const sortedJadwal = [...jadwal].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  console.log(sortedJadwal)

  return(
    <main className="min-h-[calc(100vh-theme(spacing.12))] relative flex flex-col gap-8 py-4 px-6 justify-start items-center bg-foreground">
      {/* FORM */}
      <div className="flex flex-col items-center justify-center gap-8 w-full p-4 bg-background border-2 border-stroke rounded-sm">
        <h1 className="font-black">Tambah Jadwal Tutup</h1>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex w-full gap-6">

            <div className="flex flex-col">
              <label className="text-xs">Tanggal</label>
              <input type="date" className="placeholder-shown:bg-paragraph/10 rounded-lg border px-4 py-2 text-sm" />
            </div>
            
            <div className="flex flex-col">
              <label className="text-xs">Sesi</label>
              <div className="flex gap-4">
                <label className="text-sm flex gap-2 select-none">
                  <input
                    type="checkbox"
                    className="accent-prime"
                  />
                  Sesi 1
                </label>
                <label className="text-sm flex gap-2 select-none">
                  <input
                    // onChange={(e) => {
                    //   sv((prev) => {
                    //     const copy = [...prev];
                    //     copy[id] = {
                    //       ...copy[id],
                    //       "strap": e.target.checked ? false : null,
                    //     };
                    //     return copy;
                    //   })
                    //     // console.log(cat);
                    // }}
                    type="checkbox"
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
              className="rounded-sm px-4 py-2 text-sm border-1 border-stroke/40 outline-2 outline-stroke placeholder-shown:bg-paragraph/10 placeholder-shown:outline-none"
            />
          </div>
        </div>
        
        <PrimaryButton>Tambah Jadwal</PrimaryButton>

      </div>

      {/* TABLE */}
      <div className="flex flex-col w-full gap-4">
        <h1 className="font-black text-left">Jadwal Tutup</h1>

        <table className="w-full rounded-sm border-2 border-stroke">
          <thead>
            <tr className="text-stroke text-xs">
              <th className="py-2 px-2 text-left">Tanggal</th>
              <th className="py-2 px-2 text-left">Pengumuman</th>
              <th className="py-2 px-2 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody className="border-2 border-stroke">
            {sortedJadwal.map((j, index) => (
              <tr
                key={index}
                className="odd:bg-background even:bg-foreground text-xs"
              >
                <td className="px-4 py-3">{j.date}</td>
                <td className="px-4 py-3 overflow-x-auto">{j.pengumuman}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="text-green-500 hover:text-stroke cursor-pointer"><FontAwesomeIcon icon={faEdit}/></button>
                  <button className="text-prime hover:text-stroke cursor-pointer"><FontAwesomeIcon icon={faTrash}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </main>
  );
}