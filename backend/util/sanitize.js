const sanitizeHtml = require("sanitize-html");

// For plain text fields (station, totals, names...). No tags allowed.
function cleanText(v) {
  return sanitizeHtml(String(v ?? ""), { allowedTags: [], allowedAttributes: {} });
}

// For <img src="..."> in emails: allow only https and data PNG.
function cleanQrSrc(v) {
  const s = String(v ?? "");
  try {
    const u = new URL(s);
    const httpsOk = u.protocol === "https:";
    const dataPngOk =
      u.protocol === "data:" &&
      s.startsWith("data:image/png;base64,");
    return (httpsOk || dataPngOk) ? s : "";
  } catch {
    return "";
  }
}

module.exports = { cleanText, cleanQrSrc };