// src/utils/format.js
// Utility functions for consistent currency and date formatting across the app

export const currency = (n) => {
  try {
    return n?.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
    }) ?? "$0.00";
  } catch {
    return "$0.00";
  }
};

export const fmtDateTime = (iso) => {
  try {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso || "";
  }
};
