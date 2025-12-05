import jsPDF from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";
import { Section } from "../types";

interface AutoTable { finalY: number; }
interface JsPDFWithAutoTable extends jsPDF { previousAutoTable?: AutoTable; }

export const exportToPDF = (allSections: Section[], title?: string) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" }) as JsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 10;

  // Document Title (only if provided)
  if (title) {
    const docTitle = title.toUpperCase();
    doc.setFillColor(252, 211, 77); // yellow background
    doc.rect(10, currentY - 6, pageWidth - 20, 12, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(docTitle, pageWidth / 2, currentY, { align: "center" });
    currentY += 12; // move below title
  }

  // Group sections by place
  const placeGroups = allSections.reduce<Record<string, Section[]>>((acc, section) => {
    const placeKey = section.place?.trim() || "NO PLACE";
    if (!acc[placeKey]) acc[placeKey] = [];
    acc[placeKey].push(section);
    return acc;
  }, {});

  Object.values(placeGroups).forEach((sections) => {
    const place = sections.find((s) => s.place)?.place?.toUpperCase() || "NO PLACE";

    // Place title in red
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 38, 38);
    doc.text(place, 12, currentY);
    currentY += 2;

    sections.forEach((section, index) => {
      if (!section.rows?.length) return;

      const head = [[section.section.toUpperCase(), "DELIVERY", "OFFTAKE", "OFFTAKE %"]];
      const body = section.rows.map((r) => [
        r.name.toUpperCase(),
        r.delivery ?? 0,
        r.offtake ?? 0,
        (r.offtakePercent ?? 0) + "%",
      ]);

      let brandColor: [number, number, number] | undefined;
      switch (section.section.toUpperCase()) {
        case "MARBY": brandColor = [220, 38, 38]; break;
        case "GARDENIA": brandColor = [34, 197, 94]; break;
        case "VALLEY BREAD": brandColor = [252, 211, 77]; break;
      }

      const options: UserOptions = {
        startY: currentY,
        head,
        body,
        theme: "grid",
        styles: {
          fontSize: 7,
          textColor: 0,
          cellPadding: 2,
          lineColor: 0,
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: 0,
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: 0,
          halign: "center",
          valign: "middle",
        },
        columnStyles: {
          0: { cellWidth: 55 },
          1: { cellWidth: 35 },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 },
        },
        margin: { left: 10, right: 10 },
        didParseCell: (data) => {
          if (data.section === "head" && data.row.index === 0 && data.column.index === 0 && brandColor) {
            data.cell.styles.fillColor = brandColor;
            data.cell.styles.textColor = 0;
            data.cell.styles.fontStyle = "bold";
          }
        },
      };

      autoTable(doc, options);

      // Calculate next Y
      const nextY = (doc.previousAutoTable?.finalY ?? currentY) + 27;

      // Only add a page if nextY will go beyond page height AND there’s more sections
      if (nextY > pageHeight - 10 && index < sections.length - 1) {
        doc.addPage();
        currentY = 10;
      } else {
        currentY = nextY;
      }
    });

    currentY += 1;
  });

  // Save PDF
  const fileName = title ? `${title.replace(/\s+/g, "_").toUpperCase()}.pdf` : "REPORT.pdf";
  doc.save(fileName);
};
