import { db } from "@/lib/db";
import { localTime, storeDate, storeTime } from "./time";

// export type JadwalManual = {
//   id: number;
//   status_operasional: boolean;
//   pengumuman: string;
//   waktu_akhir: 
// };

// export type OperationalData = {
//   operasional: boolean;
//   sesi: 0 | 1 | 2;
//   pengunjung: number;
//   pengumuman: string;
//   waktuAkhir: Date | null;
// };

export async function getOperationalData(): Promise<any> {
  const now = localTime();
  console.log("now:", now)

  const hour = now.getHours();

  let sesi: 0 | 1 | 2 = 0;
  let waktuAkhir = now;
  const wa1 = waktuAkhir;
  console.log("wa:", waktuAkhir)

  if (hour < 11) {
    if (hour >= 7) {
      sesi = 1;
      waktuAkhir.setHours(11, 0, 0, 0);
    } else
      waktuAkhir.setHours(7, 0, 0, 0);
  } else if (hour < 21) {
    if (hour >= 15) {
      sesi = 2;
      waktuAkhir.setHours(21, 0, 0, 0);
    } else
      waktuAkhir.setHours(15, 0, 0, 0);
  } else {
    waktuAkhir.setDate(waktuAkhir.getDate() + 1);
    waktuAkhir.setHours(7, 0, 0, 0);
  }
  console.log("wa2:", waktuAkhir)
  const wa2 = waktuAkhir;

  // Default operation
  let operasional = sesi !== 0;
  let pengumuman = "";

  const jadwal = await getActiveJadwal();

  const pengumumanRow = await getActiveAnnouncement();
  pengumuman = pengumumanRow?.pengumuman ?? "";
  
  const pengunjung = await getCurrentVisitors();

  if (jadwal) {
    operasional = jadwal.status_operasional;
    // pengumuman = jadwal.pengumuman;
    // waktuAkhir = jadwal.waktu_akhir;
  }

  return {
    now: localTime(),
    operasional,
    sesi,
    pengumuman,
    jadwal,
    pengunjung,
    waktuAkhir,
  };
}

async function getActiveJadwal() {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM jadwal_manual
    WHERE ? BETWEEN waktu_mulai AND waktu_akhir
    ORDER BY waktu_mulai DESC
    LIMIT 1
    `,
    [storeTime()]
  );

  return (rows as any[])[0];
}

async function getActiveAnnouncement() {
  const tomorrow = localTime();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [rows] = await db.execute(
    `
    SELECT pengumuman
    FROM jadwal_manual
    WHERE DATE(waktu_mulai) IN (?, ?)
    ORDER BY DATE(waktu_mulai) ASC
    LIMIT 1
    `,
    [storeDate(), storeDate(tomorrow)]
  );

  return (rows as any[])[0];
}

async function getCurrentVisitors() {
  const [rows] = await db.execute(
    `
    SELECT COUNT(*) AS total
    FROM visits
    WHERE ? BETWEEN waktu_mulai AND waktu_akhir
    `,
    [storeTime()]
  );

  const total = (rows as { total: number }[])[0].total;

  return total;
}

// let op = false;
//   let sesi = 0;
//   let pengumuman: string | undefined = 'Lorem ipsum';
//   const localTime = new Date().toLocaleString('en-US', {timeZone: 'Asia/Jakarta'});
//   const waktu = new Date(localTime);
//   // const waktu = new Date("2026-04-09T06:59:00Z");
//   const jam = new Date("2026-06-12T14:00:00Z").getHours();

 
//   let jadwal = {
//     id: 0,
//     tgl: new Date("2026-04-12T14:00:00Z"),
//     sesi: '',
//     pengumuman: 'tesssss'
//   };
//   let manual = {
//     id: 0,
//     mulai: '06:50:09',
//     akhir: '12:00:00',
//     status: false
//   };

//   const isToday = jadwal.tgl.toDateString() === waktu.toDateString();


//   function setSesi(){
//     return (jam >= 7 && jam < 11) ? 1 : (jam >= 15 && jam < 21) ? 2 : 0;
//   }

//   function setOperasional(s: string) {

//     // 1. Check Manual Override first (Highest Priority)
//     if (isToday && (jadwal.id === manual.id)) {
//       // Direct string comparison "08:59:00" >= "06:50:09" works perfectly
//       if (jam >= parseInt(manual.mulai) && jam < parseInt(manual.akhir)) {
//         return manual.status;
//       }
//     }

//     // 2. Check Session Exclusions (Second Priority)
//     // If today is a restricted day and this session is in the "closed" list
//     if (isToday && jadwal.sesi.includes(s)) {
//       return false;
//     }

//     // 3. Default Fallback (Normal Operation)
//     // If sesi is 1 or 2, it returns true. If 0, it returns false.
//     return sesi !== 0;
//   }

//   function showPengumuman() {
//     if (isToday) return jadwal.pengumuman;
//   }

//   sesi = setSesi();
//   const sesiString = sesi.toString();
//   console.log('sesi sekarang = ',sesi);
//   op = setOperasional(sesiString);
//   pengumuman = showPengumuman() || '';
//   pengumuman = "lorem ipsum";
//   console.log(pengumuman)

//   console.log(jadwal.sesi.includes(sesiString));

//   console.log('');

//   console.log('tanggal jadwal = ',jadwal.tgl);
//   console.log('tanggal sekarang = ',waktu);
//   console.log('is jadwal now = ',(jadwal.tgl.getDate() == waktu.getDate()));
//   console.log('\njadwal override = ',(jadwal.id === manual.id));
//   console.log('means = ',jadwal.pengumuman);
//   console.log('override mulai = ',manual.mulai,parseInt(manual.mulai));
//   console.log('override akhir = ',manual.akhir,parseInt(manual.akhir));
//   console.log('jam sekarang = ',waktu.getHours());
//   console.log('is override now = ',(jam >= parseInt(manual.mulai) && jam < parseInt(manual.akhir)));
//   console.log('override status = ',manual.status);
//   console.log('\njadwal sesi exist = ',(jadwal.sesi!='0'));
//   console.log('jadwal sesi = ',jadwal.sesi);
//   console.log('sesi sekarang = ',sesi);
//   console.log('is jadwal sesi now = ',(jadwal.sesi.includes(sesiString)));
//   console.log('\nstatus = ',op,'\n=========');