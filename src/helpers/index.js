export function exportToCSV(items) {
  // replace null values if any with ""
  const replacer = (value) => (value === null ? "" : value);
  const header = Object.keys(items[0]);

  const csv = [
    header.join(","), // header row first
    ...items.map((row) =>
      header.map((fieldName) => replacer(row[fieldName])).join(",")
    ),
  ].join("\r\n");

  var a = window.document.createElement("a");
  a.href = window.URL.createObjectURL(
    new Blob([csv], { type: "text/csv" })
  );

  a.download = "stoxData.csv";

  // Append anchor to body.
  document.body.appendChild(a);
  a.click();

  // Remove anchor from body
  document.body.removeChild(a);
}

export const debounce = (func, wait) => {
  let timeout;

  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};