"use client";

import ExcelJS from "exceljs";
import { Section } from "../types";

export const exportToExcel = async (allSections: Section[], title?: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("REPORT");

  let currentRow = 1;

  // Add title
  if (title) {
    const titleRow = worksheet.getRow(currentRow);
    titleRow.getCell(1).value = title.toUpperCase();
    titleRow.height = 25;
    titleRow.getCell(1).font = { bold: true, size: 16 };
    titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
    titleRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FBBF24" }, // yellow
    };
    // Merge title across 4 columns
    worksheet.mergeCells(currentRow, 1, currentRow, 4);
    currentRow++;
  }

  // Group by place
  const placeGroups = allSections.reduce<Record<string, Section[]>>((acc, section) => {
    const placeKey = section.place?.trim() || "NO PLACE";
    if (!acc[placeKey]) acc[placeKey] = [];
    acc[placeKey].push(section);
    return acc;
  }, {});

  for (const sections of Object.values(placeGroups)) {
    const place = sections.find((s) => s.place)?.place?.toUpperCase() || "NO PLACE";

    // Place row (text red, no background)
    const placeRow = worksheet.getRow(currentRow++);
    placeRow.getCell(1).value = place;
    placeRow.getCell(1).font = { bold: true, color: { argb: "DC2626" } };
    placeRow.getCell(1).alignment = { horizontal: "left" };

    for (const section of sections) {
      if (!section.rows?.length) continue;

      // Section header
      const headerRow = worksheet.getRow(currentRow++);
      headerRow.getCell(1).value = section.section.replace(/\s+/g, "").toUpperCase();
      headerRow.getCell(2).value = "DELIVERY";
      headerRow.getCell(3).value = "OFFTAKE";
      headerRow.getCell(4).value = "OFFTAKE %";

      // Set brand color for first column only
      let brandColor = "FFFFFF";
      switch (section.section.toUpperCase()) {
        case "MARBY": brandColor = "DC2626"; break;
        case "GARDENIA": brandColor = "22C55E"; break;
        case "VALLEY BREAD": brandColor = "FCD34D"; break;
      }

      for (let i = 1; i <= 4; i++) {
        const cell = headerRow.getCell(i);
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill =
          i === 1
            ? { type: "pattern", pattern: "solid", fgColor: { argb: brandColor } } // first column
            : { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFF" } }; // no background
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      }

      // Section rows
      for (const r of section.rows) {
        const row = worksheet.getRow(currentRow++);
        row.getCell(1).value = r.name.toUpperCase();
        row.getCell(2).value = r.delivery ?? 0;
        row.getCell(3).value = r.offtake ?? 0;
        row.getCell(4).value = r.offtakePercent ?? 0;

        for (let i = 1; i <= 4; i++) {
          row.getCell(i).border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          };
          // Center numeric columns
          if (i > 1) row.getCell(i).alignment = { horizontal: "center" };
        }
      }
    }

    currentRow++; // spacing after place
  }

  worksheet.columns = [
    { width: 30 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
  ];

  // Download
  const fileName = title ? `${title.replace(/\s+/g, "_").toUpperCase()}.xlsx` : "REPORT.xlsx";
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
};
