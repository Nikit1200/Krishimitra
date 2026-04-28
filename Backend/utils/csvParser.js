const fs = require("fs");

function parseCsv(raw) {
  const rows = [];
  let row = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i];
    const next = raw[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }

      row.push(current);
      current = "";

      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    current += char;
  }

  if (current !== "" || row.length > 0) {
    row.push(current);
    if (row.some((value) => value.trim() !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

function readCsvAsJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const rows = parseCsv(raw);

  if (rows.length === 0) {
    return [];
  }

  const [headers, ...dataRows] = rows;

  return dataRows.map((row) =>
    headers.reduce((record, header, index) => {
      record[header] = row[index] ?? "";
      return record;
    }, {})
  );
}

module.exports = {
  readCsvAsJson,
};
