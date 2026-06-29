import { localTime } from "./time";

export default function timePassed(date: string | Date | null) {
  if (!date) return "belum tercatat";

  const now = localTime();
  const past = new Date(date);

  const diffMs = now.getTime() - past.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "hari ini";
  if (diffDays < 7) return `${diffDays} hari lalu`;

  const diffWeeks = Math.floor(diffDays / 7);

  if (diffDays < 30) return `${diffWeeks} minggu lalu`;

  const diffMonths = Math.floor(diffDays / 30);

  return `${diffMonths} bulan lalu`;
}