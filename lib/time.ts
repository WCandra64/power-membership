export function localTime() {
  const now = new Date();

  const localTime = new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    })
  );

  console.log("lt: ",localTime)

  return localTime;
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