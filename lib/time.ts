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
  return date.toISOString().split(" ")[0];
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