export const getDateInGbFormat = (date: Date): string =>
  date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
