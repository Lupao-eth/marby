export interface BreadRow {
  id: string;
  brand: string; // "MARBY", "GARDENIA", "VALLEY BREAD"
  name: string;
  delivery: number;
  offtake: number;
  offtakePercent: number;
}

export interface Section {
  section: string; // Brand name
  place: string;   // Place name
  rows: BreadRow[];
}
