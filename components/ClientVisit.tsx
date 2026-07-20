"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faArrowLeft, } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import { localTime } from "@/lib/time";

export default function VisitHistory({ username, }: { username?: string; }) {

  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, latestTotal: 0, totalPages: 1, });
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);

  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);

      const query = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (username)
        query.append("username", username);

      const res = await fetch(`/api/history/visit?${query}`);

      const json = await res.json();

      setHistory(json.data);
      setPagination(json.pagination);
      setName(json.name);
      setLoading(false);
    }
    fetchHistory();
  }, [page, username]);

  function duration(start: Date, end: Date) {
    start.setSeconds(0, 0);
    end.setSeconds(0, 0);

    const totalMinutes =
      Math.round(
        (end.getTime() - start.getTime()) / 60000
      );

    if (totalMinutes === 0)
        return "< 1 Menit";

    if (totalMinutes < 60)
        return `${totalMinutes} Menit`;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return minutes
      ? `${hours} Jam ${minutes} Menit`
      : `${hours} Jam`;
  }

  return (
    <div className="min-h-[calc(100dvh-theme(spacing.12))] px-6 py-4 flex flex-col">
      <div className="grid grid-cols-3 items-center pb-6">
        { isAdmin &&
          <div className="justify-self-start">
            <button
              onClick={() => router.back()}
              className="cursor-pointer text-prime hover:text-stroke"
            >
              <FontAwesomeIcon icon={faArrowLeft}/>
            </button>
          </div>
        }

        <h1 className={ `${!isAdmin ? "col-span-3 " : ""} justify-self-center font-black`}>
          Riwayat Latihan
        </h1>

        { isAdmin && <div />}
      </div>

      { loading ?
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="flex flex-col gap-2 items-center">
            <div className="bg-slate-400 h-3 w-28 rounded-sm"/>

            <div className="bg-slate-400 h-6 w-36 rounded-sm"/>
          </div>
          <div className="bg-slate-400 h-6 w-28 self-end rounded-sm"/>

          { Array.from({length:2}).map((_,i) => (
              <div key={i} className="h-32 rounded-sm bg-slate-400" />
            ))
          }

        </div>
        : history.length ?
        <div className="flex flex-col gap-4">

          {/* Summary */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col items-center">
              <span className="text-xs text-paragraph font-bold">
                {"#"+username}
              </span>

              <h2 className="font-black text-lg tracking-wide">
                {name.toUpperCase()}
              </h2>
            </div>

            <div className="flex justify-end items-end gap-2">
              <span className="text-xs text-paragraph tracking-widest">
                Total Latihan:
              </span>

              <span className="font-black">
                {pagination.total}x
              </span>
            </div>
            <div className="flex justify-end items-end gap-2">
              <span className="text-xs text-paragraph tracking-widest">
                Periode Membership Terakhir:
              </span>

              <span className="font-black">
                {pagination.latestTotal}x
              </span>
            </div>
          </div>

          {/* History */}
          { history.map((item) => {
              const start = localTime(new Date(item.waktu_mulai));
              const end = localTime(new Date(item.waktu_akhir));
              return(
                <div key={item.id_visit} className="border rounded-sm p-4 flex flex-col gap-3" >

                  <div className="flex justify-between">
                    <span className={`text-lg font-bold tracking-widest ${
                      item.isActive ? "text-green-500" : "text-paragraph/70"
                    }`} >
                      { item.isActive ? "SEDANG LATIHAN"
                        : start.toLocaleDateString("id-ID", { dateStyle: "medium", })
                      }
                    </span>

                    <span className="text-sm text-paragraph">
                      { duration(start, item.isActive ? localTime() : end) }
                    </span>
                  </div>

                  <hr/>

                  <div className="flex justify-between">
                    <span className="tracking-wide">
                      {
                        start.toLocaleTimeString("id-ID", { hour:"2-digit", minute:"2-digit", })
                      }
                    </span>

                    <span className="text-paragraph/40">
                      s.d.
                    </span>

                    <span className="tracking-wide">
                      { item.isActive ? "Sekarang" : end.toLocaleTimeString("id-ID",
                          {
                            hour:"2-digit",
                            minute:"2-digit",
                          }
                        )
                      }
                    </span>
                  </div>
                </div>
              );
            })
          }
        </div>
        :
        <div className="flex-1 flex items-center justify-center text-paragraph">
          Belum memiliki riwayat kunjungan.
        </div>
      }

      { !loading && pagination.totalPages > 1 &&
        <div className="flex w-full gap-2 items-center justify-center pt-6">
          <button
            onClick={() => {
              if(page>1)
                setPage(page-1);
            }}
            className="cursor-pointer mr-4 p-2 bg-prime rounded-sm text-background hover:bg-stroke"
          >
            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
          </button>

          <input
            type="text"
            placeholder={page.toString()}
            onChange={(e)=>{
              const val=Number(e.target.value);
              if(
                val<=pagination.totalPages &&
                val>0
              )
                setPage(val);
              e.target.value="";
            }}
            className="border-2 border-prime p-2 rounded-sm w-10 text-center text-sm placeholder:text-stroke bg-background"
          />

          <span className="text-stroke/60">
            dari {pagination.totalPages} hlm
          </span>

          <button
            onClick={()=>{
              if (page<pagination.totalPages)
                setPage(page+1);
            }}
            className="cursor-pointer ml-4 p-2 bg-prime rounded-sm text-background hover:bg-stroke"
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              size="sm"
            />
          </button>
        </div>
      }
    </div>
  );
}