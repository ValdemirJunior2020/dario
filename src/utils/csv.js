// src/utils/csv.js
function escapeCSV(val) {
  if (val == null) return "";
  const s = String(val);
  if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportJobsCSV(jobs) {
  const headers = [
    "id","title","client","trade","status",
    "bid_total","expenses_total","profit","margin_pct",
    "created_at","created_by"
  ];

  const rows = jobs.map(j => ([
    j.id,
    j.title,
    j.client,
    j.trade,
    j.status,
    Number(j.estimate?.totalBidToClient || 0).toFixed(2),
    Number(j.expSum || 0).toFixed(2),
    Number(j.profit || 0).toFixed(2),
    Number(j.marginPct || 0).toFixed(2),
    j.createdAt || "",
    j.createdBy || "",
  ]));

  const csv = [headers, ...rows].map(r => r.map(escapeCSV).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "jobs_report.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
