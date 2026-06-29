export function localTime() {
  const now = new Date();

  return new Date(
    now.getTime() + 7 * 60 * 60 * 1000
  );
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