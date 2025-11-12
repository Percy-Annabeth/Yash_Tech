// src/utils/formatters.js
export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

export const formatDate = (ts) => {
  try {
    let d = ts;
    if (ts?.toDate) d = ts.toDate();       // Firestore Timestamp
    if (!(d instanceof Date)) d = new Date(d);
    return d.toLocaleDateString();
  } catch {
    return "format date";
  }
};

