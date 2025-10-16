export const currency = (n) =>
  n?.toLocaleString(undefined, { style: "currency", currency: "USD" }) ?? "$0.00";
