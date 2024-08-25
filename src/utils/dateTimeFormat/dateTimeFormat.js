const formatDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" }); // "Aug"
  const year = date.getFullYear().toString().slice(-2); // "24"
  const hours = String(date.getHours()).padStart(2, "0"); // "12"
  const minutes = String(date.getMinutes()).padStart(2, "0"); // "34"
  const seconds = String(date.getSeconds()).padStart(2, "0"); // "56"

  return `${day}-${month}' ${year}-${hours}:${minutes}:${seconds}`;
};

export { formatDate };
