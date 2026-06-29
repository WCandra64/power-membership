export function localTime() {
  const now = new Date();

  console.log("localtime(): ",new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    })
  ))

  return new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    })
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