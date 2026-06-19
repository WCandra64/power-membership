export type Member = {
  id: string;
  nama: string;
  noTelp?: string;
  tglMulai?: string;
  tglAkhir?: string;
  tglDaftar?: string;
  terakhirCheckIn?: string;
  // status: MemberStatus;
};

export const members: Member[] = [
  {
    id: "AB001",
    nama: "Nama Member",
    noTelp: "+62 812-3456-7890",
    tglMulai: "2026-01-01",
    tglAkhir: "2026-02-01",
    tglDaftar: "2025-01-01",
    terakhirCheckIn: "2026-02-01",
    // status: "aktif",
  },
];