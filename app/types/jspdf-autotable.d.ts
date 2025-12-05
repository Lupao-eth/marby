// types/jspdf-autotable.d.ts
import type jsPDF from "jspdf";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: {
      head?: string[][];
      body: (string | number)[][];
      [key: string]: unknown;
    }) => jsPDF;
  }
}
