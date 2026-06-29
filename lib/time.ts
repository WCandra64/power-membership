export function localTime() {
  const now = new Date();

  return new Date(
    now.getTime() + 7 * 60 * 60 * 1000
  );
}

export function storeTime(time = localTime()) {
  return time
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
}

export function storeDate(date = localTime()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// SAFE:
// Date.now()
// new Date().getTime()
// date1.getTime() > date2.getTime()

// AVOID:
// new Date().getHours()
// new Date().getDate()
// new Date().toLocaleString()
// NOW()
// CURDATE()
// CURRENT_TIMESTAMP