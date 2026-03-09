function normalizePdfText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "?");
}

function escapePdfText(value: string) {
  return normalizePdfText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function chunkLines(lines: string[], maxPerPage: number) {
  const chunks: string[][] = [];

  for (let index = 0; index < lines.length; index += maxPerPage) {
    chunks.push(lines.slice(index, index + maxPerPage));
  }

  return chunks.length > 0 ? chunks : [["Tidak ada data."]];
}

function createPageStream(lines: string[]) {
  const commands = [
    "BT",
    "/F1 10 Tf",
    "50 800 Td",
    "14 TL",
  ];

  lines.forEach((line, index) => {
    const text = `(${escapePdfText(line)}) Tj`;
    commands.push(index === 0 ? text : `T* ${text}`);
  });

  commands.push("ET");
  return commands.join("\n");
}

export function createSimplePdf(lines: string[]) {
  const objects: string[] = [];
  const addObject = (content: string) => {
    objects.push(content);
    return objects.length;
  };

  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pagesId = addObject("<< /Type /Pages /Count 0 /Kids [] >>");
  const pageIds: number[] = [];
  const chunks = chunkLines(lines, 52);

  chunks.forEach((pageLines) => {
    const stream = createPageStream(pageLines);
    const contentId = addObject(
      `<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`,
    );
    const pageId = addObject(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
    pageIds.push(pageId);
  });

  objects[pagesId - 1] = `<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds
    .map((id) => `${id} 0 R`)
    .join(" ")}] >>`;

  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
}

export function wrapTextForPdf(text: string, maxLength = 92) {
  const raw = text.trim();
  if (!raw) {
    return [""];
  }

  const words = raw.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLength) {
      current = candidate;
      return;
    }

    if (current) {
      lines.push(current);
    }

    if (word.length > maxLength) {
      let remaining = word;
      while (remaining.length > maxLength) {
        lines.push(remaining.slice(0, maxLength));
        remaining = remaining.slice(maxLength);
      }
      current = remaining;
      return;
    }

    current = word;
  });

  if (current) {
    lines.push(current);
  }

  return lines;
}
