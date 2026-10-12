const D = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
const EN: Record<string, string> = Object.fromEntries(D.map((d, i) => [d, String(i)]));

export const toBn = (v: string | number) => String(v).replace(/\d/g, (d) => D[+d]);
export const fromBn = (s: string) => s.replace(/[০-৯]/g, (d) => EN[d]);
/** Parse Bengali or English numeric text ("১,২৯০", "৬৩.৫০") to a number. */
export const parseBn = (s: string | number) =>
  typeof s === "number" ? s : parseFloat(fromBn(s).replace(/,/g, "")) || 0;

/** 1290 -> "১,২৯০" ; 63.5 -> "৬৩.৫০" */
export function fmtNum(n: number) {
  const frac = Number.isInteger(n) ? 0 : 2;
  const s = n.toLocaleString("en-US", { minimumFractionDigits: frac, maximumFractionDigits: frac });
  return toBn(s);
}
export const fmtPct = (n: number) => toBn(Math.abs(n).toFixed(1));

export function banglaDate(d = new Date()) {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dhaka",
  }).format(d);
}
