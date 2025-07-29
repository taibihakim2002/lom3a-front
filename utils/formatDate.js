export default function formatDate(date, type = "datetime") {
  if (!date) return "";

  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return "";

  const options =
    type === "date"
      ? { year: "numeric", month: "long", day: "numeric" }
      : {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };

  return parsedDate.toLocaleString("ar-DZ", options);
}
